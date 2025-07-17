import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Trash2,
  Search,
  Plus,
  DollarSign,
  Target,
  TrendingUp,
  Zap,
  MessageCircle,
  Crown
} from 'lucide-react';

interface Conversation {
  id: string;
  original_message: string;
  ai_reply: string;
  user_handle?: string;
  goal?: string;
  created_at: string;
}

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


const Dashboard = () => {
  const { user, session, subscribed, signOut } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newDmText, setNewDmText] = useState('');
  const [userHandle, setUserHandle] = useState('');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReply, setShowNewReply] = useState(false);
  const [generatedReply, setGeneratedReply] = useState<string>('');

  useEffect(() => {
    if (subscribed && user) {
      loadConversations();
    }
  }, [subscribed, user]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const generateNewReply = async () => {
    if (!newDmText.trim() || !session || !userHandle || !goal) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: { 
          dmText: newDmText,
          userHandle,
          goal
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.reply) {
        setGeneratedReply(data.reply);
        toast({
          title: "Sales reply generated!",
          description: "Your money-making response is ready.",
        });
        setNewDmText('');
        setUserHandle('');
        setGoal('');
        setShowNewReply(false);
        loadConversations();
      }
    } catch (error) {
      console.error('Error generating reply:', error);
      toast({
        title: "Error",
        description: "Failed to generate reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied to clipboard!",
      description: "Your perfect reply is ready to send.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteConversation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setConversations(conversations.filter(c => c.id !== id));
      toast({
        title: "Deleted",
        description: "Conversation removed.",
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation.",
        variant: "destructive",
      });
    }
  };

  const handleUpgrade = async () => {
    if (!user?.email) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email: user.email },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredConversations = conversations.filter(
    conv => 
      conv.original_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.ai_reply.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGoalLabel = (goal?: string) => {
    if (!goal) return 'N/A';
    const found = SALES_GOALS.find(g => g.value === goal);
    return found ? found.label : goal;
  };

  if (!subscribed) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Blurred Background Content */}
        <div className="blur-sm pointer-events-none opacity-50">
          <div className="px-4 py-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sales Machine Pro Dashboard
              </h1>
              <p className="text-xl text-gray-300">
                Turn every DM into cash with AI-powered sales replies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">0</div>
                <p className="text-xs text-gray-400">Sales Replies</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <div className="text-2xl font-bold text-white">∞</div>
                <p className="text-xs text-gray-400">Remaining</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">9</div>
                <p className="text-xs text-gray-400">Sales Goals</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <div className="text-2xl font-bold text-white">∞</div>
                <p className="text-xs text-gray-400">Revenue Potential</p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Generate Money-Making Reply</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-3 h-12"></div>
                  <div className="bg-gray-800 rounded-lg p-3 h-12"></div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 h-32"></div>
                <div className="bg-purple-600 rounded-lg p-3 h-12"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/90 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unlock Sales Machine Pro
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                Turn every DM into cash with AI-powered sales replies
              </p>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3 text-center text-white">Premium Features:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Unlimited AI sales replies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">9 proven sales goals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Psychology-based responses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Analytics & tracking</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold rounded-xl mb-4 transition-all hover:scale-105"
              >
                Get Sales Machine Pro - $9.99/mo
              </Button>

              <div className="flex justify-between items-center text-xs text-gray-400">
                <Link to="/" className="hover:text-white transition-colors">← Back</Link>
                <span>Cancel anytime</span>
                <button onClick={signOut} className="hover:text-white transition-colors">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-sm border-b border-gray-900 sticky top-0 z-20">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full">
                <Crown className="w-3 h-3 text-white" />
                <span className="text-xs font-semibold text-white">Pro</span>
              </div>
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sales Machine Pro Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Turn every DM into cash with AI-powered sales replies
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:bg-gray-900/70 transition-colors">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">{conversations.length}</div>
            <p className="text-xs text-gray-400">Sales Replies</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:bg-gray-900/70 transition-colors">
            <Target className="w-8 h-8 mx-auto mb-2 text-pink-400" />
            <div className="text-2xl font-bold text-white">∞</div>
            <p className="text-xs text-gray-400">Remaining</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:bg-gray-900/70 transition-colors">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">9</div>
            <p className="text-xs text-gray-400">Sales Goals</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:bg-gray-900/70 transition-colors">
            <Zap className="w-8 h-8 mx-auto mb-2 text-pink-400" />
            <div className="text-2xl font-bold text-white">∞</div>
            <p className="text-xs text-gray-400">Revenue Potential</p>
          </div>
        </div>

        {/* Generate New Reply Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl mb-8 animate-scale-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Generate Money-Making Reply</h2>
                <p className="text-gray-400">
                  Tell us who you are and what you want to sell
                </p>
              </div>
              <Button
                onClick={() => setShowNewReply(!showNewReply)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Reply
              </Button>
            </div>
            
            {showNewReply && (
              <div className="space-y-6">
                {/* User Info & Sales Goal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Your Handle/Business
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. @fitnessguru, Course Creator, Product Owner"
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
                    value={newDmText}
                    onChange={(e) => setNewDmText(e.target.value)}
                    className="min-h-32 resize-none bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    disabled={isGenerating}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generateNewReply}
                    disabled={isGenerating || !newDmText.trim() || !userHandle || !goal}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all hover:scale-105"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Sales Reply...
                      </>
                    ) : (
                      <>
                        Generate Money-Making Reply
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowNewReply(false)}
                    variant="ghost"
                    size="sm"
                    className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generated Reply Display */}
        {generatedReply && (
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl mb-8 animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">🎯 Your Money-Making Reply</h3>
                  <p className="text-purple-300 text-sm">Ready to send and start making sales!</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(generatedReply, 'latest')}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Reply
                  </Button>
                  <Button
                    onClick={() => setGeneratedReply('')}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-purple-500/20">
                <p className="text-white leading-relaxed whitespace-pre-wrap text-lg">{generatedReply}</p>
              </div>
            </div>
          </div>
        )}

        {/* Conversation History */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl animate-scale-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Your Sales Arsenal</h2>
                <p className="text-gray-400">
                  Money-making replies that convert
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
            </div>
            
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 mb-2">No sales replies yet</p>
                <p className="text-gray-500 text-sm">
                  Generate your first money-making reply above
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConversations.map((conv) => (
                  <div key={conv.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 transition-all hover:bg-gray-800/70">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
                          {conv.user_handle || 'Unknown User'}
                        </span>
                        <span className="text-xs bg-pink-900/30 text-pink-300 px-2 py-1 rounded-full border border-pink-500/30">
                          {getGoalLabel(conv.goal)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => copyToClipboard(conv.ai_reply, conv.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-purple-400 transition-colors"
                        >
                          {copiedId === conv.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={() => deleteConversation(conv.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-700/50 rounded-lg p-3 border-l-4 border-gray-600">
                        <p className="text-sm text-gray-300 font-medium mb-1">Their Message:</p>
                        <p className="text-white">{conv.original_message}</p>
                      </div>
                      
                      <div className="bg-purple-900/20 rounded-lg p-3 border-l-4 border-purple-500">
                        <p className="text-sm text-purple-300 font-medium mb-1">Your Money-Making Reply:</p>
                        <p className="text-white">{conv.ai_reply}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500">
                      {new Date(conv.created_at).toLocaleDateString()} at {new Date(conv.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Need help making more money? Contact support@salesmachine.pro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;