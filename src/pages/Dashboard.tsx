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
  conversation_type?: string;
  goal?: string;
  created_at: string;
}

const CONVERSATION_TYPES = [
  { value: 'cold_dm', label: 'Cold DM' },
  { value: 'follow_up', label: 'Follow-up Message' },
  { value: 'story_reply', label: 'Story Reply' },
  { value: 'casual_chat', label: 'Casual Conversation' },
  { value: 'flirty', label: 'Flirty Message' },
  { value: 'funny', label: 'Funny/Witty' },
  { value: 'supportive', label: 'Supportive Message' },
  { value: 'comeback', label: 'Comeback/Response' }
];

const CONVERSATION_GOALS = [
  { value: 'get_response', label: 'Get a Response' },
  { value: 'start_conversation', label: 'Start Conversation' },
  { value: 'get_number', label: 'Get Their Number' },
  { value: 'schedule_meetup', label: 'Schedule a Meetup' },
  { value: 'build_connection', label: 'Build Connection' },
  { value: 'be_memorable', label: 'Be Memorable' },
  { value: 'show_interest', label: 'Show Interest' },
  { value: 'keep_talking', label: 'Keep the Conversation Going' },
  { value: 'make_laugh', label: 'Make Them Laugh' }
];

const Dashboard = () => {
  const { user, session, subscribed, signOut } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newDmText, setNewDmText] = useState('');
  const [conversationType, setConversationType] = useState('');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReply, setShowNewReply] = useState(false);

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
    if (!newDmText.trim() || !session || !conversationType || !goal) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: { 
          dmText: newDmText,
          conversationType,
          goal
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.reply) {
        toast({
          title: "🎯 Sales reply generated!",
          description: "Your high-converting response is ready.",
        });
        setNewDmText('');
        setConversationType('');
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

  const handleUpgrade = () => {
    window.open('https://buy.stripe.com/test_6oU9AU6QO0sY9Qn6HKdAk07', '_blank');
  };

  const filteredConversations = conversations.filter(
    conv => 
      conv.original_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.ai_reply.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeLabel = (type?: string) => {
    if (!type) return 'N/A';
    const found = CONVERSATION_TYPES.find(t => t.value === type);
    return found ? found.label : type;
  };

  const getGoalLabel = (goal?: string) => {
    if (!goal) return 'N/A';
    const found = CONVERSATION_GOALS.find(g => g.value === goal);
    return found ? found.label : goal;
  };

  if (!subscribed) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
            </Button>
          </div>

          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-fade-in">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unlock InstaDM Pro
              </h1>
              <p className="text-gray-300 text-lg">
                Generate perfect Instagram DM replies that get responses
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6 text-left">
              <h3 className="font-semibold mb-4 text-center text-white">What you get:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">8 conversation types</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">9 strategic goals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Unlimited AI-generated replies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Conversation history & analytics</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold rounded-xl mb-4 transition-all hover:scale-105"
            >
              Get InstaDM Pro - $9.99/mo
            </Button>

            <p className="text-xs text-gray-400">
              Start getting better responses today • Cancel anytime
            </p>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Want to try first?</p>
              <Link to="/try">
                <Button variant="outline" className="w-full border-purple-600/50 text-purple-400 hover:bg-purple-900/20">
                  Try 1 Free Reply
                </Button>
              </Link>
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
            InstaDM Pro Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Generate perfect Instagram DM replies with AI
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:bg-gray-900/70 transition-colors">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">{conversations.length}</div>
            <p className="text-xs text-gray-400">Generated Replies</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:bg-gray-900/70 transition-colors">
            <Target className="w-8 h-8 mx-auto mb-2 text-pink-400" />
            <div className="text-2xl font-bold text-white">∞</div>
            <p className="text-xs text-gray-400">Remaining</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:bg-gray-900/70 transition-colors">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-400">Message Types</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center hover:bg-gray-900/70 transition-colors">
            <Zap className="w-8 h-8 mx-auto mb-2 text-pink-400" />
            <div className="text-2xl font-bold text-white">9</div>
            <p className="text-xs text-gray-400">Goals</p>
          </div>
        </div>

        {/* Generate New Reply Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl mb-8 animate-scale-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Generate Perfect Reply</h2>
                <p className="text-gray-400">
                  Choose your strategy and create the perfect response
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
                {/* Strategy Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Conversation Type
                    </label>
                    <Select value={conversationType} onValueChange={setConversationType}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Choose your approach..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {CONVERSATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Goal
                    </label>
                    <Select value={goal} onValueChange={setGoal}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="What's your goal?" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {CONVERSATION_GOALS.map((goalOption) => (
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
                    disabled={isGenerating || !newDmText.trim() || !conversationType || !goal}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all hover:scale-105"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Reply...
                      </>
                    ) : (
                      <>
                        Generate Perfect Reply
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowNewReply(false)}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conversation History */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl animate-scale-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Your Replies</h2>
                <p className="text-gray-400">
                  Generated conversation history
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
                <p className="text-gray-400 mb-2">No conversations yet</p>
                <p className="text-gray-500 text-sm">
                  Generate your first reply above
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConversations.map((conv) => (
                  <div key={conv.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 transition-all hover:bg-gray-800/70">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
                          {getTypeLabel(conv.conversation_type)}
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
                        <p className="text-sm text-purple-300 font-medium mb-1">Your Perfect Reply:</p>
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
            Need help? Contact support@instadm.pro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;