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
        {/* Premium Payment Popup */}
        <div className="relative mb-8">
          {/* Backdrop blur effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-premium/20 via-premium-secondary/20 to-premium-accent/20 rounded-3xl blur-xl"></div>
          
          {/* Main payment card */}
          <div className="relative">
            <Card className="relative overflow-hidden border-0 bg-card/80 backdrop-blur-xl animate-scale-in"
                  style={{ 
                    boxShadow: '0 25px 50px -12px hsl(var(--premium) / 0.4), 0 0 0 1px hsl(var(--premium) / 0.2)',
                  }}>
              
              {/* Animated gradient background */}
              <div className="absolute inset-0 opacity-30"
                   style={{ 
                     background: 'conic-gradient(from 0deg at 50% 50%, hsl(var(--premium)), hsl(var(--premium-secondary)), hsl(var(--premium-accent)), hsl(var(--premium)))',
                     animation: 'spin 20s linear infinite'
                   }}></div>
              
              {/* Glowing border */}
              <div className="absolute inset-0 rounded-lg"
                   style={{ 
                     background: 'linear-gradient(135deg, hsl(var(--premium)), hsl(var(--premium-secondary)))',
                     mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                     maskComposite: 'subtract',
                     padding: '2px'
                   }}></div>
              
              <CardHeader className="relative text-center pb-6 pt-8">
                {/* Premium badge */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto relative"
                     style={{ 
                       background: 'var(--gradient-premium)',
                       boxShadow: '0 0 40px hsl(var(--premium) / 0.8), inset 0 1px 0 hsl(0 0% 100% / 0.2)'
                     }}>
                  <Star className="w-10 h-10 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 rounded-full animate-ping"
                       style={{ background: 'var(--gradient-premium)', opacity: '0.3' }}></div>
                </div>
                
                <div className="space-y-2">
                  <div className="inline-block px-4 py-1 rounded-full text-xs font-bold text-premium-foreground mb-2"
                       style={{ background: 'var(--gradient-premium)' }}>
                    LIMITED TIME OFFER
                  </div>
                  <CardTitle className="text-4xl font-black bg-gradient-to-r from-premium via-premium-secondary to-premium-accent bg-clip-text text-transparent leading-tight">
                    Get Instant Access
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-lg font-medium">
                    Join 10,000+ users who generate perfect replies instantly
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-6 pb-8">
                {/* Email input with floating label effect */}
                <div className="relative">
                  <Input
                    id="payment-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-background/70 backdrop-blur-sm border-2 border-border/50 focus:border-premium transition-all duration-300 text-lg px-4 rounded-xl peer placeholder-transparent"
                    placeholder="your@email.com"
                  />
                  <Label 
                    htmlFor="payment-email" 
                    className="absolute left-4 -top-2.5 bg-card px-2 text-sm font-medium text-premium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-premium peer-focus:text-sm"
                  >
                    Email Address
                  </Label>
                </div>
                
                {/* Premium CTA Button */}
                <div className="space-y-4">
                  <Button
                    onClick={handlePayAndGetAccess}
                    disabled={paymentLoading}
                    className="w-full h-16 font-black text-xl rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl relative overflow-hidden group"
                    style={{ 
                      background: 'var(--gradient-premium)',
                      boxShadow: '0 20px 40px -10px hsl(var(--premium) / 0.6)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {paymentLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                        <span>Creating secure checkout...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3 relative z-10">
                        <CreditCard className="w-7 h-7" />
                        <span>Start for $9.99/month</span>
                        <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </Button>
                  
                  {/* Trust indicators */}
                  <div className="text-center space-y-2">
                    <p className="text-xs text-muted-foreground">✓ Cancel anytime ✓ Secure payment ✓ Instant access</p>
                  </div>
                </div>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-gradient-to-br from-premium/10 to-premium-secondary/10 backdrop-blur-sm border border-premium/20">
                    <Zap className="w-6 h-6 text-premium drop-shadow-sm" />
                    <span className="text-xs font-semibold text-center text-foreground">Unlimited AI Replies</span>
                  </div>
                  <div className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-gradient-to-br from-premium-secondary/10 to-premium-accent/10 backdrop-blur-sm border border-premium-secondary/20">
                    <Star className="w-6 h-6 text-premium-secondary drop-shadow-sm" />
                    <span className="text-xs font-semibold text-center text-foreground">Psychology AI</span>
                  </div>
                  <div className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-gradient-to-br from-premium-accent/10 to-premium/10 backdrop-blur-sm border border-premium-accent/20">
                    <Shield className="w-6 h-6 text-premium-accent drop-shadow-sm" />
                    <span className="text-xs font-semibold text-center text-foreground">Instant Setup</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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