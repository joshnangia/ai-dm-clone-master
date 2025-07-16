import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const Try = () => {
  const [dmText, setDmText] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUsedOnce, setHasUsedOnce] = useState(false);

  useEffect(() => {
    const used = localStorage.getItem('usedOnce');
    if (used === 'true') {
      setHasUsedOnce(true);
    }
  }, []);

  const generateReply = async () => {
    if (!dmText.trim()) return;

    setIsLoading(true);
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Instead of showing result, show paywall
      setGeneratedReply("PAYWALL");
      localStorage.setItem('usedOnce', 'true');
      setHasUsedOnce(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
  };

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
          <Link to="/unlock">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-xl font-black rounded-2xl transform hover:scale-105 transition-all duration-300"
            >
              Unlock Unlimited Access
            </Button>
          </Link>
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
        ) : (
          <div className="max-w-md mx-auto">
            {/* Paywall after submit */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🔒</div>
              <h2 className="text-3xl font-black mb-4">
                AI Reply Generated!
              </h2>
              <p className="text-gray-300 mb-6">
                Your perfect reply is ready. Unlock it now to see what the AI wrote.
              </p>
            </div>

            {/* Upgrade prompt */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Unlock Your AI Reply
              </h3>
              <p className="text-lg mb-2">
                Just $9.99/month for unlimited AI replies
              </p>
              <p className="text-sm opacity-80 mb-6">
                Cancel anytime • Instant access
              </p>
              <Link to="/unlock">
                <Button 
                  size="lg" 
                  className="w-full bg-white text-black hover:bg-gray-200 py-4 text-xl font-black rounded-xl transform hover:scale-105 transition-all duration-300"
                >
                  Unlock Now - $9.99/mo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Try;