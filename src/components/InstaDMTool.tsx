import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const InstaDMTool = () => {
  const [dmText, setDmText] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUsedFreeTry, setHasUsedFreeTry] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    // Check if user has used their free try
    const usedFreeTry = localStorage.getItem('instacloser_used_free_try');
    const paidStatus = localStorage.getItem('instacloser_paid_status');
    
    if (usedFreeTry === 'true') {
      setHasUsedFreeTry(true);
    }
    if (paidStatus === 'true') {
      setIsPaid(true);
    }
  }, []);

  const generateReply = async () => {
    if (!dmText.trim()) return;

    // Check if user can use the tool
    if (hasUsedFreeTry && !isPaid) {
      setShowPaywall(true);
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call to Supabase edge function
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockReply = "Hey! Thanks for reaching out. I'm definitely interested - can you tell me more about the details? I'd love to learn how this could work for me.";
      setGeneratedReply(mockReply);
      
      // Mark free try as used if not paid
      if (!isPaid) {
        localStorage.setItem('instacloser_used_free_try', 'true');
        setHasUsedFreeTry(true);
      }
    } catch (error) {
      console.error('Error generating reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    // TODO: Integrate with Stripe checkout via Supabase edge function
    console.log('Redirecting to Stripe checkout...');
    // For now, simulate successful payment
    localStorage.setItem('instacloser_paid_status', 'true');
    setIsPaid(true);
    setShowPaywall(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/25530eda-8a1d-468c-9929-0025e965b72e.png" 
              alt="InstaCloser.ai Logo" 
              className="h-10 w-10"
            />
            <Link to="/" className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
              InstaCloser.ai
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/how-it-works" className="font-mono text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              How It Works
            </Link>
            <Link to="/pricing" className="font-mono text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Pricing
            </Link>
            <Link to="/about" className="font-mono text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center p-4 pt-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 font-mono">
              Type a DM. Get a pro-level reply.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-mono">
              Your personal AI Closer. Built for Instagram. Try it free once.
            </p>
          </div>

          {/* Main Tool */}
          <Card className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="space-y-6">
              {/* Input */}
              <div>
                <Textarea
                  placeholder="Paste your DM here"
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  className="min-h-32 text-lg font-mono resize-none border-2 border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white"
                  disabled={isLoading}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateReply}
                disabled={isLoading || !dmText.trim()}
                className="w-full py-4 text-lg font-bold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors"
              >
                {isLoading ? 'Generating Reply...' : 'Generate Reply'}
              </Button>

              {/* Generated Reply */}
              {generatedReply && (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                      Your AI Reply:
                    </h3>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="font-mono"
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                    {generatedReply}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Usage Status */}
          {!isPaid && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {hasUsedFreeTry ? 'Free try used. Upgrade for unlimited replies.' : 'One free try remaining.'}
              </p>
            </div>
          )}

          {isPaid && (
            <div className="text-center mt-6">
              <p className="text-sm text-green-600 dark:text-green-400 font-mono">
                Unlimited replies activated
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Sections */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Features Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold font-mono text-gray-900 dark:text-white mb-8">
            Why InstaCloser.ai Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-bold font-mono text-gray-900 dark:text-white mb-3">
                Instant Replies
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-mono">
                Generate professional responses in seconds. Never leave anyone on read again.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold font-mono text-gray-900 dark:text-white mb-3">
                Conversion Focused
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-mono">
                Trained specifically for closing deals, making sales, and converting leads.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold font-mono text-gray-900 dark:text-white mb-3">
                Mobile First
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-mono">
                Built for Instagram users. Works perfectly on your phone.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="text-center bg-gray-50 dark:bg-gray-800 py-16 rounded-lg">
          <h2 className="text-3xl font-bold font-mono text-gray-900 dark:text-white mb-8">
            The Numbers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold font-mono text-gray-900 dark:text-white">10x</div>
              <div className="text-gray-600 dark:text-gray-300 font-mono">Faster Responses</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-mono text-gray-900 dark:text-white">85%</div>
              <div className="text-gray-600 dark:text-gray-300 font-mono">Higher Conversion Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-mono text-gray-900 dark:text-white">24/7</div>
              <div className="text-gray-600 dark:text-gray-300 font-mono">Always Available</div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold font-mono text-gray-900 dark:text-white mb-8">
            What Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 font-mono mb-4">
                "This saved me hours every day. My DM response rate went through the roof."
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">— Sarah K.</div>
            </Card>
            <Card className="p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 font-mono mb-4">
                "Finally, a tool that actually understands how to close deals via DM."
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">— Mike R.</div>
            </Card>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img 
              src="/lovable-uploads/25530eda-8a1d-468c-9929-0025e965b72e.png" 
              alt="InstaCloser.ai Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold font-mono text-gray-900 dark:text-white">
              InstaCloser.ai
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-mono text-sm">
            AI-powered DM replies for modern entrepreneurs
          </p>
        </div>
      </footer>

      {/* Paywall Popup */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-8 bg-white dark:bg-gray-800">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                You just used your free try.
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-mono">
                Unlock unlimited replies for just $9.99/month.
                Start closing leads, sales, and conversations in seconds.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleUpgrade}
                  className="w-full py-3 text-lg font-bold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  Unlock Now
                </Button>
                <Button
                  onClick={() => setShowPaywall(false)}
                  variant="ghost"
                  className="w-full font-mono"
                >
                  Maybe later
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InstaDMTool;