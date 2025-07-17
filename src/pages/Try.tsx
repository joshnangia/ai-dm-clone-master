import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';

const Try = () => {
  const [dmText, setDmText] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUsedOnce, setHasUsedOnce] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, session, subscribed, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const used = localStorage.getItem('usedOnce');
    if (used === 'true') {
      setHasUsedOnce(true);
    }
  }, []);

  const generateReply = async () => {
    if (!dmText.trim()) return;

    // If user is not logged in, redirect to auth
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to use the AI reply generator.",
      });
      navigate('/auth');
      return;
    }

    // If user has already used free try and is not subscribed, show paywall
    if (hasUsedOnce && !subscribed) {
      setGeneratedReply("PAYWALL");
      return;
    }

    // If user is logged in but not subscribed and hasn't used free try, allow 1 free generation
    if (!subscribed && !hasUsedOnce) {
      // Mark as used after this generation
      localStorage.setItem('usedOnce', 'true');
      setHasUsedOnce(true);
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: { dmText },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.reply) {
        setGeneratedReply(data.reply);
        toast({
          title: "Reply generated!",
          description: "Your perfect reply is ready to copy.",
        });
      } else {
        throw new Error('No reply generated');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeCheckout = () => {
    window.open('https://buy.stripe.com/test_6oU9AU6QO0sY9Qn6HKdAk07', '_blank');
  };

  const copyToClipboard = async () => {
    if (generatedReply && generatedReply !== "PAYWALL") {
      await navigator.clipboard.writeText(generatedReply);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Reply copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Used state - show upgrade
  if (hasUsedOnce && !generatedReply) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Copy className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-6">
            You Already Used Your Free Try
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Ready for unlimited AI replies?
          </p>
          <Button 
            size="lg" 
            className="w-full py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
            onClick={handleStripeCheckout}
          >
            Get InstaDM Pro - $9.99/mo
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Cancel anytime
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 py-8">
        {/* Back link */}
        <div className="mb-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">← Back</Link>
        </div>

        {!generatedReply ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-fade-in">
                <Copy className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                Try InstaDM Pro Free
              </h1>
              <p className="text-muted-foreground">
                Paste their message and get a perfect AI reply
              </p>
              {!hasUsedOnce && (
                <p className="text-sm text-primary mt-2">
                  ✨ This is your free try!
                </p>
              )}
            </div>

            <div className="space-y-6">
              <Textarea
                placeholder="Hey, I saw your story about..."
                value={dmText}
                onChange={(e) => setDmText(e.target.value)}
                className="min-h-40 text-lg rounded-xl resize-none"
                disabled={isLoading}
              />

              <Button
                onClick={generateReply}
                disabled={isLoading || !dmText.trim()}
                className="w-full py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                    <span>AI is thinking...</span>
                  </div>
                ) : (
                  'Generate Perfect Reply'
                )}
              </Button>
            </div>
          </div>
        ) : generatedReply === "PAYWALL" ? (
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              Your Free Try Is Complete!
            </h2>
            <p className="text-muted-foreground mb-8">
              Get unlimited AI replies and advanced features
            </p>

            <div className="bg-card rounded-2xl p-6 mb-6 text-left border">
              <h3 className="font-semibold mb-4 text-center">Unlock full access:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Unlimited AI-generated replies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">8 proven conversation strategies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Conversation history & analytics</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStripeCheckout}
              className="w-full py-6 text-lg font-semibold rounded-xl mb-4 transition-all hover:scale-105"
            >
              Get InstaDM Pro - $9.99/mo
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Start getting better responses today • Cancel anytime
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              Your Perfect Reply
            </h2>
            <p className="text-muted-foreground mb-8">
              Copy this reply and send it
            </p>

            <div className="bg-card border rounded-2xl p-6 mb-6">
              <p className="text-lg leading-relaxed mb-4 text-left">{generatedReply}</p>
              <Button
                onClick={copyToClipboard}
                className="w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy Reply'}
              </Button>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Want unlimited access to all features?
              </p>
              <Button
                onClick={handleStripeCheckout}
                className="w-full mb-4"
              >
                Get InstaDM Pro - $9.99/mo
              </Button>
              <Button
                onClick={() => {
                  setGeneratedReply('');
                  setDmText('');
                }}
                variant="outline"
                className="w-full"
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Try;