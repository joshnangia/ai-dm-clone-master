import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, Zap, Star, Crown, Brain, Target, Sparkles, X } from 'lucide-react';

const SALES_GOALS = [
  { value: 'sell_course', label: 'Sell My Course' },
  { value: 'sell_product', label: 'Sell My Product' },
  { value: 'book_call', label: 'Book a Sales Call' },
  { value: 'get_number', label: 'Get Their Number' },
  { value: 'schedule_demo', label: 'Schedule a Demo' },
  { value: 'build_interest', label: 'Build Interest' },
  { value: 'close_deal', label: 'Close the Deal' },
  { value: 'upsell', label: 'Upsell/Cross-sell' },
  { value: 'convert_lead', label: 'Convert to Lead' }
];

const Try = () => {
  const { toast } = useToast();
  const [dmText, setDmText] = useState('');
  const [userHandle, setUserHandle] = useState('');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [hasUsedFreeReply, setHasUsedFreeReply] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const generateFreeReply = async () => {
    if (!dmText.trim() || !userHandle || !goal) return;

    setIsGenerating(true);
    
    // Show analysis popup
    setShowAnalysisPopup(true);
    setCurrentStep(0);
    
    // Analysis steps
    const steps = [
      "🧠 Analyzing message tone and context...",
      "🎯 Detecting conversation type (casual/sales/objection)...", 
      "💡 Identifying personality patterns...",
      "🔥 Crafting psychological hooks...",
      "⚡ Optimizing for conversion..."
    ];
    setAnalysisSteps(steps);

    try {
      // Simulate sophisticated AI analysis
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep(i + 1);
      }
      
      // Smart context-aware replies
      const casualMessages = ['hey', 'hi', 'hello', 'how are you', 'whats up', 'what\'s up', 'how\'s your day'];
      const isCasual = casualMessages.some(casual => dmText.toLowerCase().includes(casual)) && dmText.length < 50;
      
      let reply;
      
      if (isCasual) {
        // Natural, conversational responses for casual messages
        const casualReplies = [
          "Hey! Going great, thanks for asking! How's your day treating you?",
          "Hi there! Doing well over here - how about yourself?", 
          "Hey! Pretty good day so far, appreciate you checking in! What's been going on with you?",
          "Hi! Can't complain - hope you're having a solid day too!"
        ];
        reply = casualReplies[Math.floor(Math.random() * casualReplies.length)];
      } else {
        // Strategic sales responses based on goal
        const smartReplies = {
          sell_course: `I can tell you're thinking about this seriously! I've actually been working with people in similar situations and seeing some incredible breakthroughs. Quick question - when you say you're interested, are you looking to make real changes in the next 30 days or still exploring?`,
          sell_product: `I appreciate you reaching out! This is exactly the kind of challenge I love helping people solve. Based on what you're saying, it sounds like you're ready for a real solution. Are you looking to handle this soon or just gathering info for now?`,
          book_call: `Great question! I'd actually love to give you a personalized take on this since everyone's situation is unique. I have a few strategy calls open this week - would you be up for a quick 15-min chat? I think I can give you some real clarity.`,
          get_number: `Absolutely! There's actually quite a bit I'd love to share about this - probably too much for DMs honestly. What's the best number to reach you? I can shoot you a quick message with some insights that might be exactly what you need.`,
          schedule_demo: `Perfect timing! I'm actually doing some personalized demos this week to show exactly how this works for different situations. I've got 2 spots left - would Thursday at 2 or Friday at 10 work better for you?`,
          build_interest: `I love that you're asking about this! Most people don't even realize this opportunity exists right now. Without giving away everything here - are you someone who moves quickly when you see something that makes sense?`,
          close_deal: `You know what? I can tell you're serious about making this happen. Since you've been asking all the right questions, I want to make this simple for you. Ready to move forward today?`,
          upsell: `Since you're already getting results with what you have, you're going to love what this next level can do. I'm only offering this to people who are already succeeding - and that's exactly who you are. Interested in hearing more?`,
          convert_lead: `I can see you're really thinking this through, which I respect. Here's what I've learned - the people who succeed are the ones who trust their instincts and take action. Does this feel like the right move for you?`
        };
        
        reply = smartReplies[goal as keyof typeof smartReplies] || 
          `Thanks for reaching out! I can definitely help with this. When you say you're interested, are you looking to move forward soon or still in the research phase? Want to make sure I give you exactly what you need.`;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGeneratedReply(reply);
      setHasUsedFreeReply(true);
      setShowAnalysisPopup(false);
      
      toast({
        title: "Smart reply generated!",
        description: "Context-aware AI analysis complete!",
      });
    } catch (error) {
      console.error('Error generating free reply:', error);
      setShowAnalysisPopup(false);
      toast({
        title: "Error",
        description: "Failed to generate reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTryAgain = () => {
    if (hasUsedFreeReply) {
      setShowAnalysisPopup(true);
      setCurrentStep(0);
      
      const steps = [
        "🔒 Checking subscription status...",
        "💳 Free trial already used...",
        "⭐ Premium features required..."
      ];
      setAnalysisSteps(steps);
      
      setTimeout(() => {
        setCurrentStep(1);
        setTimeout(() => {
          setCurrentStep(2);
          setTimeout(() => {
            setCurrentStep(3);
            setTimeout(() => {
              setShowAnalysisPopup(false);
              // Show upgrade modal instead of allowing generation
            }, 800);
          }, 800);
        }, 800);
      }, 800);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Your sales reply is ready to send.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-gray-900 sticky top-0 z-20">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Try Sales Machine Free
          </h1>
          <p className="text-xl text-gray-300">
            Generate your first money-making DM reply
          </p>
        </div>

        {!hasUsedFreeReply ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
            <div className="space-y-6">
              {/* User Info & Sales Goal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Your Handle/Business
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @fitnessguru, Course Creator"
                    value={userHandle}
                    onChange={(e) => setUserHandle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                    disabled={isGenerating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Sales Goal
                  </label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="What do you want to sell?" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {SALES_GOALS.map((goalOption) => (
                        <SelectItem key={goalOption.value} value={goalOption.value} className="text-white hover:bg-gray-700">
                          {goalOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Their Message
                </label>
                <Textarea
                  placeholder="Paste what they sent you..."
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  className="min-h-32 resize-none bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  disabled={isGenerating}
                />
              </div>

              <Button
                onClick={generateFreeReply}
                disabled={isGenerating || !dmText.trim() || !userHandle || !goal}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all hover:scale-105"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Your Free Reply...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Generate Free Sales Reply</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8 text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-bold text-white mb-2">Free Reply Used!</h3>
            <p className="text-gray-300 mb-4">
              Want unlimited smart DM replies? Upgrade to Pro for just $9.99/month
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={handleTryAgain}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
              >
                Try Again (Demo)
              </Button>
              <Link to="/auth" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Generated Reply Display */}
        {generatedReply && (
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">🎯 Your Money-Making Reply</h3>
                  <p className="text-purple-300 text-sm">Ready to send and start making sales!</p>
                </div>
                <Button
                  onClick={() => copyToClipboard(generatedReply)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Reply
                </Button>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-purple-500/20">
                <p className="text-white leading-relaxed text-lg">{generatedReply}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade CTA */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Want Unlimited Sales Replies?</h3>
          <p className="text-gray-300 mb-4">
            Join thousands making money with AI-powered DM responses
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Unlimited replies</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>9 sales goals</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Analytics & tracking</span>
            </div>
          </div>
          <Link to="/auth">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6">
              Get Sales Machine Pro - $9.99/mo
            </Button>
          </Link>
        </div>

        {/* Analysis Popup */}
        {showAnalysisPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI Analysis in Progress
                </h3>
                
                <div className="space-y-4 mb-6">
                  {analysisSteps.map((step, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 transition-all duration-500 ${
                        index < currentStep ? 'text-green-400' : 
                        index === currentStep ? 'text-purple-400' : 'text-gray-500'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        index < currentStep ? 'bg-green-400' : 
                        index === currentStep ? 'bg-purple-400 animate-pulse' : 'bg-gray-600'
                      }`} />
                      <span className="text-sm">{step}</span>
                      {index < currentStep && <Sparkles className="w-4 h-4 text-green-400" />}
                    </div>
                  ))}
                </div>

                {currentStep >= analysisSteps.length && (
                  <div className="text-center">
                    <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-semibold">Analysis Complete!</p>
                  </div>
                )}

                {hasUsedFreeReply && currentStep >= 3 && (
                  <div className="text-center mt-6">
                    <p className="text-purple-300 mb-4">Ready to unlock unlimited smart replies?</p>
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Try;