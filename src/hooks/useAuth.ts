import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          console.log('Initial session:', session?.user?.email || 'no user');
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session) {
            // Check subscription status when we have a session
            checkSubscription(session);
          } else {
            setSubscribed(false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Session error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        console.log('Auth change:', event, session?.user?.email || 'no user');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // Defer subscription check to prevent auth deadlocks
          setTimeout(() => {
            if (mounted && session) {
              checkSubscription(session);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setSubscribed(false);
        }
        setLoading(false);
      }
    });

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkSubscription = async (userSession: Session) => {
    try {
      console.log('Checking subscription for user:', userSession.user.email);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${userSession.access_token}`,
        },
      });

      if (!error && data) {
        console.log('Subscription check result:', data);
        setSubscribed(data.subscribed || false);
      } else {
        console.error('Subscription check error:', error);
        setSubscribed(false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscribed(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    try {
      console.log('SignOut function called');
      
      // Clear any sensitive data from memory first
      setUser(null);
      setSession(null);
      setSubscribed(false);
      
      // Clear all possible auth-related storage items
      try {
        localStorage.clear();
        sessionStorage.clear();
        // Clear specific Supabase keys that might exist
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });
      } catch (storageError) {
        console.warn('Storage clear error:', storageError);
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Supabase signOut error:', error);
      } else {
        console.log('Supabase signOut successful');
      }
      
      // Small delay to ensure cleanup completes
      setTimeout(() => {
        // Force hard reload to clear any cached state
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('Sign out catch error:', error);
      // Force redirect even if there's an error
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  };

  return {
    user,
    session,
    loading,
    subscribed,
    signIn,
    signUp,
    signOut,
    checkSubscription: () => session && checkSubscription(session),
  };
};