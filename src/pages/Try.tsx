import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const Try = () => {
  const [dmText, setDmText] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUsedOnce, setHasUsedOnce] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const used = localStorage.getItem('usedOnce');
    if (used === 'true') {
      setHasUsedOnce(true);
    }
  }, []);

  const generateReply = async () => {
    if (!dmText.trim() || hasUsedOnce) return;

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockReply = "Hey! Thanks for reaching out. I'm definitely interested - can you tell me more about the details? I'd love to learn how this could work for me.";
      setGeneratedReply(mockReply);
      
      // Mark as used
      localStorage.setItem('usedOnce', 'true');
      setHasUsedOnce(true);
    } catch (error) {
      console.error('Error generating reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  if (hasUsedOnce && !generatedReply) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-black mb-8">
            You've used your free reply.
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Upgrade for unlimited access — $9.99/month.
          </p>
          <Link to="/unlock">
            <Button 
              size="lg" 
              className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium rounded-none transform hover:scale-105 transition-all duration-300"
            >
              Unlock Unlimited Access
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="p-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/25530eda-8a1d-468c-9929-0025e965b72e.png" 
              alt="InstaCloser.ai Logo" 
              className="h-12 w-12"
            />
            <Link to="/" className="text-xl font-bold text-black">
              InstaCloser.ai
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/try" className="text-black font-medium">
              Try It
            </Link>
            <Link to="/unlock" className="text-gray-600 hover:text-black transition-colors">
              Pricing
            </Link>
            <Link to="/faq" className="text-gray-600 hover:text-black transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          {!generatedReply ? (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl lg:text-5xl font-bold text-black mb-8">
                  Paste a DM below. Your AI Closer will handle it.
                </h1>
              </div>

              <div className="space-y-6">
                <Textarea
                  placeholder="Paste your DM here"
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  className="min-h-40 text-lg border-2 border-gray-200 focus:border-black rounded-none resize-none"
                  disabled={isLoading}
                />

                <Button
                  onClick={generateReply}
                  disabled={isLoading || !dmText.trim()}
                  className="w-full py-4 text-lg font-medium bg-black hover:bg-gray-800 text-white rounded-none transform hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating Reply...</span>
                    </div>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-black mb-8">
                  Your AI Reply:
                </h2>
              </div>

              <div className="bg-gray-50 p-8 border-2 border-gray-200 mb-8">
                <p className="text-lg text-black leading-relaxed mb-6">
                  {generatedReply}
                </p>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-black hover:text-white rounded-none"
                >
                  Copy Reply
                </Button>
              </div>

              <div className="text-center bg-black text-white p-8">
                <h3 className="text-2xl font-bold mb-4">
                  You've used your free reply.
                </h3>
                <p className="text-lg mb-6">
                  Upgrade for unlimited access — $9.99/month.
                </p>
                <Link to="/unlock">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-black px-12 py-4 text-lg font-medium rounded-none"
                  >
                    Unlock Unlimited Access
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Try;