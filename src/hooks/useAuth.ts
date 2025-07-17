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
            setTimeout(() => checkSubscription(session), 100);
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
        if (session && event === 'SIGNED_IN') {
          // Check subscription when user signs in
          setTimeout(() => checkSubscription(session), 100);
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

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscribed(false);
  };

  return {
    user,
    session,
    loading,
    subscribed,
    signOut,
    checkSubscription: () => session && checkSubscription(session),
  };
};