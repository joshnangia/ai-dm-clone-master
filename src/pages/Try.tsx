import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, Zap, Star, Crown } from 'lucide-react';

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

  const generateFreeReply = async () => {
    if (!dmText.trim() || !userHandle || !goal) return;

    setIsGenerating(true);
    try {
      // Simulate AI generation with a crafted response based on goal
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const sampleReplies = {
        sell_course: `Hey! I totally get where you're coming from. I actually just helped 3 students this week achieve similar results with my proven system. Quick question - are you serious about making this change or just browsing? If you're ready, I have 2 spots left this month.`,
        sell_product: `I hear you! This is exactly why I created this solution. I've seen hundreds of people struggle with this same issue. Quick question - when you say you're interested, are you looking to solve this in the next 30 days or just exploring options?`,
        book_call: `That's a great question! I'd love to give you a personalized answer because everyone's situation is unique. I have 3 slots open this week for a quick 15-min strategy call. Are you free Tuesday or Wednesday?`,
        get_number: `Absolutely! This is actually something I'm passionate about helping with. There's so much to share - way too much for DMs. What's the best number to reach you? I'll shoot you a quick text with some exclusive insights.`,
        schedule_demo: `Perfect timing! I'm actually doing personalized demos this week to show exactly how this works for your specific situation. I only have 2 slots left - are you free Thursday at 2pm or Friday at 10am?`,
        build_interest: `I love that you're asking about this! Most people don't even realize this opportunity exists. Without giving away all my secrets here - are you someone who takes action when you see something that works?`,
        close_deal: `You know what? I can tell you're serious about this. Since you've been following along and asking great questions, I want to make this a no-brainer for you. Are you ready to get started today?`,
        upsell: `Since you're already seeing results with what you have, you're going to love this next level. I'm only offering this to my best customers - and since you're getting such great results, you're exactly who this is for. Interested?`,
        convert_lead: `I can see you're really thinking about this seriously. Here's what I know - the people who succeed with this are the ones who decide quickly and take action. Are you ready to be one of those success stories?`
      };
      
      const reply = sampleReplies[goal as keyof typeof sampleReplies] || 
        `Thanks for reaching out! I can definitely help you with this. When you say you're interested, are you looking to move forward this week or just gathering information? I want to make sure I give you exactly what you need.`;
      
      setGeneratedReply(reply);
      setHasUsedFreeReply(true);
      
      toast({
        title: "Free reply generated!",
        description: "Want unlimited replies? Upgrade to Pro!",
      });
    } catch (error) {
      console.error('Error generating free reply:', error);
      toast({
        title: "Error",
        description: "Failed to generate reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
              Want unlimited money-making replies? Upgrade to Pro for just $9.99/month
            </p>
            <div className="flex gap-3">
              <Link to="/auth" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Upgrade to Pro
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setHasUsedFreeReply(false);
                  setGeneratedReply('');
                  setDmText('');
                  setUserHandle('');
                  setGoal('');
                }}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Try Again
              </Button>
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
      </div>
    </div>
  );
};

export default Try;