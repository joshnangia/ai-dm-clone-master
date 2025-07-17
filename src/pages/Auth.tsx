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

      <div className="max-w-md mx-auto px-6 py-12">
        {/* Payment-First Section */}
        <Card className="relative overflow-hidden border-0 mb-8 animate-scale-in" 
              style={{ 
                background: 'var(--gradient-premium-subtle)',
                borderImage: 'var(--gradient-premium) 1',
                borderWidth: '2px',
                borderStyle: 'solid',
                boxShadow: 'var(--shadow-premium)'
              }}>
          <div className="absolute inset-0 opacity-20"
               style={{ background: 'var(--gradient-premium)' }}></div>
          <CardHeader className="relative text-center pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto"
                 style={{ 
                   background: 'var(--gradient-premium)',
                   boxShadow: 'var(--glow-premium)'
                 }}>
              <Star className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-premium to-premium-secondary bg-clip-text text-transparent">
              Get Instant Access
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg mt-2">
              Pay $9.99/month → Account created instantly → Start using AI immediately
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <div className="space-y-2">
              <Label htmlFor="payment-email" className="text-foreground font-medium">Email Address</Label>
              <Input
                id="payment-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-premium transition-all duration-300"
                placeholder="Enter your email address"
              />
            </div>
            
            <Button
              onClick={handlePayAndGetAccess}
              disabled={paymentLoading}
              className="w-full h-14 font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              style={{ 
                background: 'var(--gradient-premium)',
                boxShadow: 'var(--shadow-premium)'
              }}
            >
              {paymentLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Creating secure checkout...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <CreditCard className="w-6 h-6" />
                  <span>Pay $9.99/month - Get Instant Access</span>
                </div>
              )}
            </Button>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-background/30 backdrop-blur-sm">
                <Zap className="w-5 h-5 text-premium" />
                <span className="text-xs font-medium text-center text-muted-foreground">Unlimited AI Replies</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-background/30 backdrop-blur-sm">
                <Star className="w-5 h-5 text-premium-secondary" />
                <span className="text-xs font-medium text-center text-muted-foreground">Advanced Psychology</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-background/30 backdrop-blur-sm">
                <Shield className="w-5 h-5 text-premium-accent" />
                <span className="text-xs font-medium text-center text-muted-foreground">Instant Setup</span>
              </div>
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