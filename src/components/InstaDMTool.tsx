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

  // Code rain animation
  const [codeLines, setCodeLines] = useState<string[]>([]);

  useEffect(() => {
    // Generate code lines for animation
    const codes = [
      'if (dm.intent === "sales") { generateReply(); }',
      'const response = await ai.analyze(message);',
      'function closeTheDeal(conversation) {',
      'return optimizeConversion(reply);',
      'ai.train(closingTechniques);',
      'const result = processInboundDM();',
      'export default DMCloser;',
      'handleConversation(userInput);',
      'if (conversion > 0.85) success();',
      'return professionalReply;'
    ];
    setCodeLines(codes);

    // Check if user has used their free try
    const usedFreeTry = localStorage.getItem('instareply_used_free_try');
    const paidStatus = localStorage.getItem('instareply_paid_status');
    
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
        localStorage.setItem('instareply_used_free_try', 'true');
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
    localStorage.setItem('instareply_paid_status', 'true');
    setIsPaid(true);
    setShowPaywall(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/25530eda-8a1d-468c-9929-0025e965b72e.png" 
              alt="InstaReply.co Logo" 
              className="h-16 w-16 drop-shadow-lg"
            />
            <Link to="/" className="text-2xl md:text-3xl font-bold font-mono text-white drop-shadow-lg">
              Sales Machine Pro
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/how-it-works" className="font-mono text-white/80 hover:text-white transition-all duration-300 hover:scale-105">
              How It Works
            </Link>
            <Link to="/pricing" className="font-mono text-white/80 hover:text-white transition-all duration-300 hover:scale-105">
              Pricing
            </Link>
            <Link to="/about" className="font-mono text-white/80 hover:text-white transition-all duration-300 hover:scale-105">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center p-4 pt-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 font-mono drop-shadow-2xl">
              Turn DMs into{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Cold Hard Cash.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-mono drop-shadow-lg">
              AI that analyzes your business and writes money-making replies. Try free.
            </p>
          </div>

          {/* Main Tool */}
          <Card className="p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl transform hover:scale-105 transition-all duration-500">
            <div className="space-y-6">
              {/* Input */}
              <div>
                <Textarea
                  placeholder="Paste their DM here..."
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  className="min-h-32 text-lg font-mono resize-none bg-black/60 backdrop-blur-sm border-2 border-purple-500/30 focus:border-purple-500/60 text-white placeholder:text-white/60 rounded-2xl"
                  disabled={isLoading}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateReply}
                disabled={isLoading || !dmText.trim()}
                className="w-full py-6 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transition-all duration-300 transform hover:scale-105 rounded-2xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>AI is Analyzing...</span>
                  </div>
                ) : (
                  'Generate Money-Making Reply'
                )}
              </Button>

              {/* Generated Reply */}
              {generatedReply && (
                <div className="mt-8 p-6 backdrop-blur-xl bg-purple-900/20 rounded-2xl border border-purple-500/30 transform animate-scale-in">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white font-mono">
                      Your Sales Reply:
                    </h3>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="font-mono bg-purple-600/30 border-purple-500/30 text-white hover:bg-purple-600/50"
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-white/90 font-mono leading-relaxed">
                    {generatedReply}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Usage Status */}
          {!isPaid && (
            <div className="text-center mt-6 animate-fade-in">
              <p className="text-sm text-white/60 font-mono backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 inline-block">
                {hasUsedFreeTry ? 'Free try used. Upgrade to start making money.' : 'One free money-making try remaining.'}
              </p>
            </div>
          )}

          {isPaid && (
            <div className="text-center mt-6 animate-fade-in">
              <p className="text-sm text-green-400 font-mono backdrop-blur-sm bg-green-400/10 rounded-full px-4 py-2 inline-block">
                ✨ Unlimited money-making replies activated
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Code Rain Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
        <div className="absolute inset-0 overflow-hidden">
          {codeLines.map((line, index) => (
            <div
              key={index}
              className="absolute text-white/40 font-mono text-sm animate-pulse"
              style={{
                left: `${(index * 15) % 100}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: '4s',
                transform: `translateY(${-50 + (index * 20)}px)`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-mono text-white mb-8 drop-shadow-2xl">
            Powered by{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Sales Psychology AI
            </span>
          </h2>
          <p className="text-xl text-white/80 font-mono mb-12">
            Analyzes your business and creates replies that actually close deals and make money
          </p>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* Features Section */}
        <section className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-12 drop-shadow-lg">
            Why Sales Machine Pro Makes You Money
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 transform hover:scale-105 transition-all duration-500 hover:bg-white/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-white/20 to-white/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-4">
                Instant Sales Replies
              </h3>
              <p className="text-white/80 font-mono leading-relaxed">
                AI analyzes your business and creates money-making responses in seconds.
              </p>
            </div>
            <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 transform hover:scale-105 transition-all duration-500 hover:bg-white/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-white/20 to-white/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-4">
                Business Psychology
              </h3>
              <p className="text-white/80 font-mono leading-relaxed">
                Understands what you sell and crafts replies that convert prospects into paying customers.
              </p>
            </div>
            <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 transform hover:scale-105 transition-all duration-500 hover:bg-white/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-white/20 to-white/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-4">
                Money on Autopilot
              </h3>
              <p className="text-white/80 font-mono leading-relaxed">
                Turn every DM into a sales opportunity. Never miss a potential customer again.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="text-center backdrop-blur-xl bg-white/5 py-20 rounded-3xl border border-white/20">
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-12 drop-shadow-lg">
            Real Results That Pay
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl md:text-7xl font-bold font-mono text-white drop-shadow-lg mb-2">3x</div>
              <div className="text-white/80 font-mono text-lg">More Sales Closed</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl md:text-7xl font-bold font-mono text-white drop-shadow-lg mb-2">92%</div>
              <div className="text-white/80 font-mono text-lg">Higher Revenue Per DM</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl md:text-7xl font-bold font-mono text-white drop-shadow-lg mb-2">$10K+</div>
              <div className="text-white/80 font-mono text-lg">Extra Monthly Revenue</div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-12 drop-shadow-lg">
            Making Bank with AI
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl transform hover:scale-105 transition-all duration-500">
              <p className="text-white/90 font-mono mb-6 text-lg leading-relaxed">
                "Made $15K extra last month just from better DM replies. This AI gets my business."
              </p>
              <div className="text-sm text-white/60 font-mono">— Sarah K., Course Creator</div>
            </Card>
            <Card className="p-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl transform hover:scale-105 transition-all duration-500">
              <p className="text-white/90 font-mono mb-6 text-lg leading-relaxed">
                "Closed 3 high-ticket clients this week using these AI replies. Game changer."
              </p>
              <div className="text-sm text-white/60 font-mono">— Mike R., Business Coach</div>
            </Card>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-xl bg-white/10 border-t border-white/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src="/lovable-uploads/25530eda-8a1d-468c-9929-0025e965b72e.png" 
              alt="InstaReply.co Logo" 
              className="h-12 w-12 drop-shadow-lg"
            />
            <span className="text-2xl font-bold font-mono text-white drop-shadow-lg">
              Sales Machine Pro
            </span>
          </div>
          <p className="text-white/60 font-mono text-sm">
            AI that analyzes your business and turns DMs into cash
          </p>
        </div>
      </footer>

      {/* Paywall Popup */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl transform animate-scale-in">
            <div className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-mono">
                Ready to make money?
              </h2>
              <p className="text-white/80 font-mono leading-relaxed">
                Unlock unlimited AI replies that actually close deals and generate revenue.
                Start turning every DM into cash for just $9.99/month.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={handleUpgrade}
                  className="w-full py-4 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-2xl transform hover:scale-105 transition-all duration-300"
                >
                  💰 Start Making Money - $9.99/mo
                </Button>
                <Button
                  onClick={() => setShowPaywall(false)}
                  variant="ghost"
                  className="w-full font-mono text-white/60 hover:text-white hover:bg-white/10 rounded-2xl"
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