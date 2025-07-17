
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
    
    // Determine message type and context
    const lowerText = dmText.toLowerCase();
    let messageType = '';
    let tone = '';
    let context = '';
    let strategy = '';

    if (lowerText.includes('hey') || lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('what\'s up') || lowerText.includes('how are you')) {
      messageType = 'Casual/Social';
      tone = 'Friendly & Relaxed';
      context = 'Opening conversation or greeting';
      strategy = 'Match their energy, build rapport naturally';
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
    } else {
      messageType = 'General Inquiry';
      tone = 'Neutral & Helpful';
      context = 'Information seeking';
      strategy = 'Provide helpful response, build connection';
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

      // Mock AI response based on message type
      const lowerText = dmText.toLowerCase();
      let mockReply = '';

      if (lowerText.includes('hey') || lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('what\'s up') || lowerText.includes('how are you')) {
        mockReply = "Hey! Going well, thanks for asking. How's your day treating you?";
      } else if (lowerText.includes('course') && lowerText.includes('how')) {
        mockReply = "It's been incredible! Just had 3 students hit their first $10k month this week. The results speak for themselves - are you looking to level up your game too?";
      } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('expensive')) {
        mockReply = "I totally get that - it's an investment. But think about it this way: what's the cost of staying where you are for another year? Most of my students make back their investment in the first month.";
      } else if (lowerText.includes('interested') || lowerText.includes('tell me more')) {
        mockReply = "Perfect timing! I just opened up a few spots in my next cohort. The transformation my students see is insane. Want me to send you some of their success stories?";
      } else {
        mockReply = "That's a great question! I love that you're thinking strategically about this. Most successful people ask exactly what you're asking. Here's what I've found works best...";
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
