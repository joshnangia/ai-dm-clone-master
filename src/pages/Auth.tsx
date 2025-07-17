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

      <div className="max-w-md mx-auto px-6 py-16 font-inter">
        {/* Modern Payment Card */}
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-premium via-premium-secondary to-premium opacity-20 rounded-3xl blur-sm"></div>
          
          <Card className="relative bg-card/95 backdrop-blur-xl border-0 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <CardHeader className="text-center pt-12 pb-8 px-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto"
                   style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                <Star className="w-8 h-8 text-white" />
              </div>
              
              <CardTitle className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                Unlock AI Replies
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground font-medium">
                Get perfect responses instantly
              </CardDescription>
              
              {/* Social proof */}
              <div className="flex items-center justify-center mt-6 space-x-1">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                </div>
                <span className="text-sm text-muted-foreground ml-3">Trusted by 12,000+ users</span>
              </div>
            </CardHeader>
            
            <CardContent className="px-8 pb-12">
              {/* Email Input */}
              <div className="mb-6">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-lg bg-background/50 border-2 border-border/50 focus:border-premium rounded-xl transition-all duration-300 placeholder:text-muted-foreground/60"
                  placeholder="Enter your email address"
                />
              </div>
              
              {/* Main CTA */}
              <Button
                onClick={handlePayAndGetAccess}
                disabled={paymentLoading}
                className="w-full h-16 text-xl font-bold rounded-2xl mb-6 relative overflow-hidden group transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #8B5CF6 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 3s ease infinite'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {paymentLoading ? (
                  <span className="relative z-10">Creating account...</span>
                ) : (
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    <span>Start for $9.99/month</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </Button>
              
              {/* Trust badges */}
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  ✓ Cancel anytime ✓ 30-day money back ✓ Instant setup
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <Zap className="w-5 h-5 mx-auto mb-2 text-premium" />
                    <p className="text-xs font-medium text-muted-foreground">Unlimited<br />Replies</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-5 h-5 mx-auto mb-2 text-premium-secondary" />
                    <p className="text-xs font-medium text-muted-foreground">AI<br />Psychology</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-5 h-5 mx-auto mb-2 text-premium-accent" />
                    <p className="text-xs font-medium text-muted-foreground">Secure<br />& Private</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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