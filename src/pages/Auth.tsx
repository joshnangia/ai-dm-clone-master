import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Star, Shield, CreditCard, Crown, Lock, CheckCircle, Rocket, Eye, EyeOff, Loader2 } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'signup' | 'preview' | 'signin'>('signup');
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

  const handleSignUp = async () => {
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email_confirm: false // Skip email verification
          }
        }
      });

      if (error) {
        toast({
          title: "Error creating account",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to InstaReply! No verification needed.",
        });
        setStep('preview');
      }
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const handleUpgrade = async () => {
    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email }
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      window.location.href = data.url;
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

  // Preview Dashboard Step
  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <Crown className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-black">InstaReply.co</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Your AI Closer is 
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Almost Ready!</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Unlock unlimited AI replies and start converting leads 24/7
            </p>
          </div>

          {/* Preview Dashboard (Blurred) */}
          <div className="relative mb-12">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden">
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-10 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-bold mb-2">Premium Dashboard</h3>
                  <p className="text-gray-300 mb-6">Unlock to access your AI reply dashboard</p>
                </div>
              </div>
              
              {/* Mock dashboard content */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-purple-900/30 p-6 rounded-xl">
                  <h4 className="text-lg font-bold mb-2">Total Replies</h4>
                  <p className="text-3xl font-black text-purple-400">1,247</p>
                </div>
                <div className="bg-pink-900/30 p-6 rounded-xl">
                  <h4 className="text-lg font-bold mb-2">Conversion Rate</h4>
                  <p className="text-3xl font-black text-pink-400">34.2%</p>
                </div>
                <div className="bg-blue-900/30 p-6 rounded-xl">
                  <h4 className="text-lg font-bold mb-2">Revenue Generated</h4>
                  <p className="text-3xl font-black text-blue-400">$47,830</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">@potential_customer</span>
                  </div>
                  <p className="text-gray-300">Hey, I'm interested in your course. What's included?</p>
                  <div className="mt-2 p-3 bg-green-900/30 rounded border-l-4 border-green-400">
                    <p className="text-sm">AI Reply: Great question! Our course includes...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Section */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Start Converting?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-400">What You Get:</h3>
                <div className="space-y-3 text-left">
                  {[
                    'Unlimited AI replies',
                    'Advanced sales psychology',
                    'Objection handling system',
                    'Call booking integration',
                    'Real-time analytics',
                    'Custom training for your offer'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-pink-400">The Results:</h3>
                <div className="space-y-3 text-left">
                  {[
                    '5x faster response times',
                    '3x higher conversion rates',
                    '24/7 lead nurturing',
                    'Zero missed opportunities',
                    'Consistent sales messaging',
                    'Scalable lead handling'
                  ].map((result, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleUpgrade}
              disabled={paymentLoading}
              className="px-12 py-6 text-2xl font-black rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] transform hover:scale-105 transition-all duration-300 mb-4"
            >
              {paymentLoading ? (
                <Loader2 className="mr-3 w-6 h-6 animate-spin" />
              ) : (
                <Rocket className="mr-3 w-6 h-6" />
              )}
              Unlock Premium - $9.99/mo
            </Button>
            
            <p className="text-gray-400">Start earning back your investment within days</p>
            
            <div className="mt-6">
              <Button 
                onClick={() => setStep('signin')} 
                variant="ghost" 
                className="text-purple-400 hover:text-purple-300"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {step === 'signin' ? (
          /* Sign In Form */
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-card-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Sign in to your InstaReply account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-12 bg-background border-border text-foreground"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 h-12 bg-background border-border text-foreground pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full h-12 bg-premium hover:bg-premium/90"
              >
                {loading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <div className="text-center">
                <Button 
                  onClick={() => setStep('signup')} 
                  variant="ghost" 
                  className="text-premium hover:text-premium/80"
                >
                  Don't have an account? Sign up
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Sign Up Form */
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
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground font-medium">
                  Start converting leads with AI
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
              
              <CardContent className="px-8 pb-12 space-y-6">
                {/* Email Input */}
                <div>
                  <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 h-14 text-lg bg-background/50 border-2 border-border/50 focus:border-premium rounded-xl transition-all duration-300 placeholder:text-muted-foreground/60"
                    placeholder="Enter your email address"
                  />
                </div>
                
                {/* Password Input */}
                <div>
                  <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 h-14 text-lg bg-background/50 border-2 border-border/50 focus:border-premium rounded-xl transition-all duration-300 placeholder:text-muted-foreground/60 pr-12"
                      placeholder="Create a secure password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Create Account Button */}
                <Button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="w-full h-16 text-xl font-bold rounded-2xl mb-6 relative overflow-hidden group transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
                  style={{ 
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #8B5CF6 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 3s ease infinite'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {loading ? (
                    <div className="relative z-10 flex items-center justify-center space-x-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="relative z-10 flex items-center justify-center space-x-3">
                      <span>Create Free Account</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Button>
                
                {/* Trust badges */}
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    ✓ Free account ✓ See demo dashboard ✓ Upgrade anytime
                  </p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/50">
                    <div className="text-center">
                      <Zap className="w-5 h-5 mx-auto mb-2 text-premium" />
                      <p className="text-xs font-medium text-muted-foreground">Instant<br />Setup</p>
                    </div>
                    <div className="text-center">
                      <Star className="w-5 h-5 mx-auto mb-2 text-premium-secondary" />
                      <p className="text-xs font-medium text-muted-foreground">AI<br />Preview</p>
                    </div>
                    <div className="text-center">
                      <Shield className="w-5 h-5 mx-auto mb-2 text-premium-accent" />
                      <p className="text-xs font-medium text-muted-foreground">Secure<br />& Private</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setStep('signin')} 
                    variant="ghost" 
                    className="text-premium hover:text-premium/80"
                  >
                    Already have an account? Sign in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;