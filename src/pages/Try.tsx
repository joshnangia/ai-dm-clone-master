
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Copy, Zap, Brain, Target, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Try = () => {
  const [dmText, setDmText] = useState('');
  const [userHandle, setUserHandle] = useState('');
  const [goal, setGoal] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState({
    messageType: '',
    tone: '',
    context: '',
    strategy: ''
  });
  const [hasTriedFree, setHasTriedFree] = useState(false);
  const { toast } = useToast();

  const simulateAnalysis = () => {
    setShowAnalysis(true);
    
    // Determine message type and context - PRIORITIZE BUSINESS INTENT
    const lowerText = dmText.toLowerCase();
    let messageType = '';
    let tone = '';
    let context = '';
    let strategy = '';

    // BUSINESS INTENT DETECTION (highest priority)
    // Sales comparison and competitive advantage questions
    if (lowerText.includes('why you over competitors') || lowerText.includes('what makes you different') || lowerText.includes('how are you better than others') || lowerText.includes('why choose your company') || lowerText.includes('compare your offer to others') || lowerText.includes('why your business') || lowerText.includes('why should i go with you') || lowerText.includes('what makes you stand out')) {
      messageType = 'Sales Comparison / Competitive Advantage';
      tone = 'Evaluating & Comparing';
      context = 'Seeking competitive differentiators and unique value';
      strategy = 'Highlight unique advantages, proof points, and competitive edge';
    } else if (lowerText.includes('reason') || lowerText.includes('why should') || lowerText.includes('convince me') || lowerText.includes('what makes') || lowerText.includes('tell me about') || lowerText.includes('give me')) {
      messageType = 'Sales Interest / Objection Response';
      tone = 'Curious & Evaluating';
      context = 'Asking for value proposition or reasons to buy';
      strategy = 'Provide specific, credible value points with social proof';
    } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('expensive') || lowerText.includes('buy') || lowerText.includes('purchase')) {
      messageType = 'Sales/Business';
      tone = 'Professional & Persuasive';
      context = 'Price or purchase inquiry';
      strategy = 'Address concerns, show value, create urgency';
    } else if (lowerText.includes('interested') || lowerText.includes('tell me more') || lowerText.includes('course') || lowerText.includes('service')) {
      messageType = 'Business Interest';
      tone = 'Engaged & Curious';
      context = 'Showing interest in offer';
      strategy = 'Provide value, build excitement, guide to next step';
    } else if (lowerText.includes('hey') || lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('what\'s up') || lowerText.includes('how are you')) {
      // Only treat as casual if NO business intent detected
      messageType = 'Casual/Social';
      tone = 'Friendly & Relaxed';
      context = 'Opening conversation or greeting';
      strategy = 'Match their energy, build rapport naturally';
    } else {
      messageType = 'General Business Inquiry';
      tone = 'Professional & Helpful';
      context = 'Information seeking with business intent';
      strategy = 'Provide helpful response, show expertise, build connection';
    }

    setAnalysis({
      messageType,
      tone,
      context,
      strategy
    });
  };

  const handleGenerate = async () => {
    if (!dmText.trim()) {
      toast({
        title: "Please enter a message",
        description: "Add the DM text you want to respond to.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    simulateAnalysis();

    try {
      // Simulate the analysis steps with realistic timing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // AI response based on BUSINESS INTENT FIRST
      const lowerText = dmText.toLowerCase();
      let mockReply = '';

      // PRIORITIZE BUSINESS QUESTIONS - Check for competitive questions first
      if (lowerText.includes('why you over competitors') || lowerText.includes('what makes you different') || lowerText.includes('how are you better than others') || lowerText.includes('why choose your company') || lowerText.includes('compare your offer to others') || lowerText.includes('why your business') || lowerText.includes('why should i go with you') || lowerText.includes('what makes you stand out')) {
        mockReply = "Great question — here's what makes us stand out:\n\n• Higher conversion rates — turns DMs into actual sales, not just responses\n• Niche-specific training — built for your exact audience and industry\n• Proven results — used by top creators generating 6-7 figures from DMs\n• Lightning fast setup — get it running in under 10 minutes\n• Ongoing optimization — constantly improves based on your performance\n\nWant to see it in action for your goal?";
      } else if (lowerText.includes('reason') || lowerText.includes('why should') || lowerText.includes('convince me') || lowerText.includes('what makes') || (lowerText.includes('give me') && (lowerText.includes('reason') || lowerText.includes('why')))) {
        mockReply = "Absolutely. Here's why:\n\n• Converts DMs into sales, not just replies\n• Trained for your exact audience and niche  \n• 24/7 auto-replies that feel human and persuasive\n• Used by top creators to close inbound DMs at scale\n• Backed by data, results, and real-world conversion boosts\n\nWant a quick preview of how it works for your course?";
      } else if (lowerText.includes('tell me about') && (lowerText.includes('course') || lowerText.includes('program') || lowerText.includes('business'))) {
        mockReply = "My course teaches Instagram DM conversion - turning cold messages into paying customers. I've helped 500+ students add $5-15k/month just from better DM strategies. The system works because it's based on psychology, not just templates. What's your current biggest challenge with DMs?";
      } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('expensive')) {
        mockReply = "I get it - it's an investment. But here's the thing: what's the cost of staying where you are for another year? Most students make back their investment in the first month. Plus, one good client pays for the entire course. Want to see some student results?";
      } else if (lowerText.includes('interested') || lowerText.includes('tell me more')) {
        mockReply = "Perfect timing! I just opened a few spots in my next cohort. The transformation is insane - students go from struggling with DMs to closing 3-5 sales per week. Want me to send you some success stories?";
      } else if (lowerText.includes('hey') || lowerText.includes('hi') || lowerText.includes('hello')) {
        // Only casual if NO business intent detected
        if (!lowerText.includes('reason') && !lowerText.includes('business') && !lowerText.includes('course')) {
          mockReply = "Hey! Going well, thanks for asking. How's your day treating you?";
        } else {
          mockReply = "Hey! Absolutely - happy to help with that. What specific part interests you most?";
        }
      } else {
        mockReply = "That's exactly what I help people with! Most of my students were in the same spot. What's your biggest challenge with this right now?";
      }

      setReply(mockReply);
      setHasTriedFree(true);
      
      toast({
        title: "Reply generated!",
        description: "Your AI-powered response is ready to copy.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReply = () => {
    navigator.clipboard.writeText(reply);
    toast({
      title: "Copied!",
      description: "Reply copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="p-6 border-b border-gray-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-black">
            InstaReply.co
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/auth" className="text-gray-400 hover:text-white">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Try InstaReply AI
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            See how our AI responds to your DMs. First reply is free!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="space-y-6">
              <div>
                <Label htmlFor="dm-text" className="text-white font-medium">
                  DM Message
                </Label>
                <Textarea
                  id="dm-text"
                  placeholder="Paste the message you received..."
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  className="mt-2 bg-black border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="user-handle" className="text-white font-medium">
                  Your Handle/Business (Optional)
                </Label>
                <Input
                  id="user-handle"
                  placeholder="@yourhandle or Your Business Name"
                  value={userHandle}
                  onChange={(e) => setUserHandle(e.target.value)}
                  className="mt-2 bg-black border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="goal" className="text-white font-medium">
                  Your Goal (Optional)
                </Label>
                <Input
                  id="goal"
                  placeholder="e.g., sell course, book call, build interest"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="mt-2 bg-black border-gray-700 text-white"
                />
              </div>

              {!hasTriedFree ? (
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-bold"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate FREE Reply
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">🔥 Upgrade for Unlimited</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      The actual AI is 10x smarter with unlimited replies, advanced psychology, and custom training.
                    </p>
                    <Link to="/auth">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Get Unlimited Access - $9.99/mo
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Analysis & Output Section */}
          <div className="space-y-6">
            {/* AI Analysis */}
            {showAnalysis && (
              <Card className="p-6 bg-gray-900 border-gray-800">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-lg">AI Analysis</h3>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Message Type:</span>
                    <span className="font-medium text-purple-400">{analysis.messageType}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Detected Tone:</span>
                    <span className="font-medium text-blue-400">{analysis.tone}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Context:</span>
                    <p className="text-white mt-1">{analysis.context}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Strategy:</span>
                    <p className="text-pink-400 mt-1">{analysis.strategy}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Generated Reply */}
            {reply && (
              <Card className="p-6 bg-gray-900 border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    <h3 className="font-bold text-lg">Generated Reply</h3>
                  </div>
                  <Button
                    onClick={copyReply}
                    variant="secondary"
                    size="sm"
                    className="bg-muted/20 border-muted-foreground/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                
                <div className="bg-black p-4 rounded-lg border border-gray-700">
                  <p className="text-white leading-relaxed">{reply}</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Upgrade CTA */}
        {hasTriedFree && (
          <div className="mt-12 text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">Ready for the Full Power?</h2>
            <p className="text-xl text-gray-300 mb-6">
              Upgrade to get unlimited replies, advanced AI psychology, and 10x better responses.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-bold">
                  Upgrade Now - $9.99/mo
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
