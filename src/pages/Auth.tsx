import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Star, Shield, CreditCard } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handlePayAndGetAccess = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to get access.",
        variant: "destructive",
      });
      return;
    }

    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email }
      });

      if (error) throw error;

      // Open Stripe checkout in new tab
      window.open(data.url, '_blank');
    } catch (error: any) {
      toast({
        title: "Error creating checkout",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please provide both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Navigation */}
      <nav className="p-6 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-black text-foreground hover:text-premium transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span>InstaReply.co</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-sm mx-auto px-6 py-12">
        {/* Clean Payment Card */}
        <Card className="bg-card border-border shadow-2xl animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                 style={{ background: 'var(--gradient-premium)' }}>
              <Star className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Start Using AI Replies
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Join thousands getting perfect replies instantly
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Simple email input */}
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-center text-lg"
                placeholder="Enter your email"
              />
            </div>
            
            {/* Clean CTA button */}
            <Button
              onClick={handlePayAndGetAccess}
              disabled={paymentLoading}
              className="w-full h-14 text-lg font-semibold"
              style={{ background: 'var(--gradient-premium)' }}
            >
              {paymentLoading ? (
                <span>Processing...</span>
              ) : (
                <>Start for $9.99/month</>
              )}
            </Button>
            
            {/* Simple benefits */}
            <div className="text-center space-y-2 pt-2">
              <p className="text-sm text-muted-foreground">✓ Unlimited AI replies ✓ Cancel anytime ✓ Works instantly</p>
            </div>
          </CardContent>
        </Card>

        {/* Existing Users Sign In */}
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-card-foreground">Existing User?</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="signin-password" className="text-foreground">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-background border-border text-foreground"
                placeholder="Enter your password"
              />
            </div>
            <Button
              onClick={handleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full border-border hover:bg-accent"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;