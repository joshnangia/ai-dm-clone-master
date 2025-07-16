import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2 } from 'lucide-react';

const Success = () => {
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const { user, session, checkSubscription } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && session) {
      verifySubscription();
    } else {
      setVerifying(false);
    }
  }, [user, session]);

  const verifySubscription = async () => {
    try {
      // Manually add user as subscriber for now
      // In a real app, this would be handled by Stripe webhooks
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          user_id: user?.id,
          email: user?.email,
          subscribed: true,
          subscription_tier: 'premium',
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });

      if (error) {
        console.error('Error updating subscription:', error);
        toast({
          title: "Verification failed",
          description: "Please contact support if this issue persists.",
          variant: "destructive",
        });
      } else {
        setVerified(true);
        if (checkSubscription) {
          checkSubscription();
        }
        toast({
          title: "Payment successful!",
          description: "Your premium access is now active.",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: "Please contact support if this issue persists.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-black mb-6">Please Sign In</h1>
          <p className="text-gray-300 mb-8">
            You need to sign in to verify your subscription.
          </p>
          <Link to="/auth">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-bold rounded-lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {verifying ? (
          <>
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-green-500" />
            <h1 className="text-3xl font-black mb-6">Verifying Payment...</h1>
            <p className="text-gray-300">
              Please wait while we confirm your subscription.
            </p>
          </>
        ) : verified ? (
          <>
            <Check className="w-16 h-16 mx-auto mb-6 text-green-500" />
            <h1 className="text-3xl font-black mb-6">Welcome to Premium!</h1>
            <p className="text-gray-300 mb-8">
              Your payment was successful. You now have unlimited access to AI-generated replies.
            </p>
            <div className="space-y-4">
              <Link to="/try">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-bold rounded-lg">
                  Start Using AI Replies
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Back to Home
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-black mb-6">Verification Failed</h1>
            <p className="text-gray-300 mb-8">
              We couldn't verify your subscription. Please contact support if this issue persists.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={verifySubscription}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-bold rounded-lg"
              >
                Try Again
              </Button>
              <Link to="/">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Back to Home
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;