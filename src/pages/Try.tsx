
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Copy, Zap, Brain, Target, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Try = () => {
  const [dmText, setDmText] = useState('');
  const [userHandle, setUserHandle] = useState('');
  const [goal, setGoal] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysis, setAnalysis] = useState({
    messageType: '',
    tone: '',
    context: '',
    strategy: ''
  });
  const [hasTriedFree, setHasTriedFree] = useState(false);
  const { toast } = useToast();

  const analysisSteps = [
    { label: "Analyzing message intent...", icon: Brain },
    { label: "Detecting emotional tone...", icon: Target },
    { label: "Crafting strategic response...", icon: Sparkles },
    { label: "Generating AI reply...", icon: CheckCircle }
  ];

  const simulateAnalysisSteps = async () => {
    const lowerText = dmText.toLowerCase();
    
    // Step 1: Message Intent
    setAnalysisStep(0);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let messageType = '';
    if (lowerText.includes('why you over competitors') || lowerText.includes('what makes you different') || lowerText.includes('how are you better than others') || lowerText.includes('why choose your company') || lowerText.includes('compare your offer to others') || lowerText.includes('why your business') || lowerText.includes('why should i go with you') || lowerText.includes('what makes you stand out')) {
      messageType = 'Sales Comparison / Competitive Advantage';
    } else if (lowerText.includes('reason') || lowerText.includes('why should') || lowerText.includes('convince me') || lowerText.includes('what makes') || lowerText.includes('tell me about') || lowerText.includes('give me')) {
      messageType = 'Sales Interest / Objection Response';
    } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('expensive') || lowerText.includes('buy') || lowerText.includes('purchase')) {
      messageType = 'Sales/Business';
    } else if (lowerText.includes('interested') || lowerText.includes('tell me more') || lowerText.includes('course') || lowerText.includes('service')) {
      messageType = 'Business Interest';
    } else if (lowerText.includes('hey') || lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('what\'s up') || lowerText.includes('how are you')) {
      messageType = 'Casual/Social';
    } else {
      messageType = 'General Business Inquiry';
    }
    
    // Step 2: Emotional Tone
    setAnalysisStep(1);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let tone = '';
    if (messageType.includes('Sales Comparison')) {
      tone = 'Evaluating & Comparing';
    } else if (messageType.includes('Sales Interest')) {
      tone = 'Curious & Evaluating';
    } else if (messageType.includes('Business')) {
      tone = 'Professional & Engaged';
    } else if (messageType.includes('Casual')) {
      tone = 'Friendly & Relaxed';
    } else {
      tone = 'Professional & Helpful';
    }
    
    // Step 3: Strategy
    setAnalysisStep(2);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let context = '';
    let strategy = '';
    if (messageType.includes('Comparison')) {
      context = 'Seeking competitive differentiators and unique value';
      strategy = 'Highlight unique advantages, proof points, and competitive edge';
    } else if (messageType.includes('Sales Interest')) {
      context = 'Asking for value proposition or reasons to buy';
      strategy = 'Provide specific, credible value points with social proof';
    } else if (messageType.includes('Business')) {
      context = 'Showing interest in offer or service';
      strategy = 'Provide value, build excitement, guide to next step';
    } else if (messageType.includes('Casual')) {
      context = 'Opening conversation or greeting';
      strategy = 'Match their energy, build rapport naturally';
    } else {
      context = 'Information seeking with business intent';
      strategy = 'Provide helpful response, show expertise, build connection';
    }
    
    setAnalysis({ messageType, tone, context, strategy });
    
    // Step 4: Generate Reply
    setAnalysisStep(3);
    await new Promise(resolve => setTimeout(resolve, 600));
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
    setShowAnalysisModal(true);
    setAnalysisStep(0);

    try {
      // Run analysis animation
      await simulateAnalysisSteps();

      // Call the actual AI edge function
      const response = await fetch('https://ostwawzkkkrreoygkhji.supabase.co/functions/v1/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdHdhd3pra2tycmVveWdraGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzMzNTQsImV4cCI6MjA2NTEwOTM1NH0._RHtQYQDbOOv-GK-PwqTTvlUZR1XJbK1at186VVLzLQ`,
        },
        body: JSON.stringify({
          dmText: dmText,
          userHandle: userHandle || '@instareply',
          goal: goal || 'Sell AI DM automation course'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setReply(data.reply);
      setHasTriedFree(true);
      
      // Close modal and show success
      setTimeout(() => {
        setShowAnalysisModal(false);
        toast({
          title: "Reply generated!",
          description: "Your AI-powered response is ready to copy.",
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error calling AI:', error);
      setShowAnalysisModal(false);
      toast({
        title: "AI generation failed",
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

          {/* Analysis Modal */}
          <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold">AI Analysis in Progress</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-6">
                {analysisSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === analysisStep;
                  const isCompleted = index < analysisStep;
                  
                  return (
                    <div key={index} className={`flex items-center space-x-3 transition-all duration-300 ${
                      isActive ? 'text-purple-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {isActive ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                      <span className={`${isActive ? 'font-medium' : ''}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
                
                {analysisStep === 3 && (
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Message Type:</span>
                        <span className="text-purple-400 font-medium">{analysis.messageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Detected Tone:</span>
                        <span className="text-blue-400 font-medium">{analysis.tone}</span>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-400">Strategy:</span>
                        <p className="text-pink-400 text-sm mt-1">{analysis.strategy}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Analysis & Output Section - Only show after modal closes */}
          <div className="space-y-6">
            {reply && !showAnalysisModal && (
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
