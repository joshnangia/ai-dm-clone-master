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

    // If user is logged in but not subscribed, show paywall
    if (!subscribed) {
      setGeneratedReply("PAYWALL");
      localStorage.setItem('usedOnce', 'true');
      setHasUsedOnce(true);
      return;
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // Used state - show upgrade
  if (hasUsedOnce && !generatedReply) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">😤</div>
          <h1 className="text-3xl font-black mb-6">
            You Already Used Your Free Try
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Want unlimited AI replies?
            <br />
            <span className="text-white font-bold">Just $9.99/month</span>
          </p>
          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-xl font-black rounded-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => window.location.href = 'https://buy.stripe.com/test_aFa5kEcVagA855I3YFb7y01'}
          >
            Unlock Unlimited Access
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 py-8">
        {/* Back link */}
        <div className="mb-4">
          <Link to="/" className="text-gray-400 hover:text-white">← Back</Link>
        </div>

        {!generatedReply ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black mb-4">
                Paste Your DM Here
              </h1>
              <p className="text-gray-300">
                AI will write the perfect reply in seconds
              </p>
            </div>

            <div className="space-y-6">
              <Textarea
                placeholder="Hey, I saw your story about..."
                value={dmText}
                onChange={(e) => setDmText(e.target.value)}
                className="min-h-40 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-2xl resize-none"
                disabled={isLoading}
              />

              <Button
                onClick={generateReply}
                disabled={isLoading || !dmText.trim()}
                className="w-full py-6 text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>AI is thinking...</span>
                  </div>
                ) : (
                  'Generate Perfect Reply'
                )}
              </Button>
            </div>
          </div>
        ) : generatedReply === "PAYWALL" ? (
          <div className="max-w-md mx-auto">
            {/* Seamless continuation that matches the vibe */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-4">
                Your Reply Is Ready
              </h2>
              <p className="text-gray-300">
                Upgrade to unlimited access
              </p>
            </div>

            {/* Simple clean upgrade */}
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-xl font-black rounded-2xl transform hover:scale-105 transition-all duration-300 mb-4"
              onClick={() => window.location.href = 'https://buy.stripe.com/test_aFa5kEcVagA855I3YFb7y01'}
            >
              Get Unlimited Access - $9.99/mo
            </Button>
            
            <p className="text-center text-sm text-gray-400">
              Cancel anytime
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-4">
                Your Perfect Reply
              </h2>
              <p className="text-gray-300">
                Copy and paste this reply
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
              <p className="text-lg leading-relaxed mb-4">{generatedReply}</p>
              <Button
                onClick={copyToClipboard}
                className="w-full bg-white text-black hover:bg-gray-100 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy Reply'}
              </Button>
            </div>

            <div className="text-center space-y-4">
              <Button
                onClick={() => {
                  setGeneratedReply('');
                  setDmText('');
                }}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Generate Another Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Try;