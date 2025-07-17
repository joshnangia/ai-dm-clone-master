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
  { value: 'cold_dm', label: '🎯 Cold DM' },
  { value: 'follow_up', label: '📞 Follow-up' },
  { value: 'objection_handling', label: '🛡️ Objection Handling' },
  { value: 'closing', label: '💰 Closing' },
  { value: 'appointment_setting', label: '📅 Appointment Setting' },
  { value: 'social_proof', label: '⭐ Social Proof' },
  { value: 'value_proposition', label: '💎 Value Proposition' },
  { value: 'urgency_scarcity', label: '⚡ Urgency/Scarcity' }
];

const CONVERSATION_GOALS = [
  { value: 'book_call', label: '📞 Book a Sales Call' },
  { value: 'get_number', label: '📱 Get Their Phone Number' },
  { value: 'schedule_demo', label: '🖥️ Schedule a Demo' },
  { value: 'close_sale', label: '💸 Close the Sale' },
  { value: 'get_commitment', label: '✅ Get Commitment' },
  { value: 'overcome_objection', label: '🎯 Overcome Objection' },
  { value: 'build_rapport', label: '🤝 Build Rapport' },
  { value: 'create_urgency', label: '⏰ Create Urgency' },
  { value: 'next_step', label: '➡️ Move to Next Step' }
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
      title: "💰 Copied to clipboard!",
      description: "Now go close that deal!",
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
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
              className="text-gray-400 hover:text-white"
            >
              Sign Out
            </Button>
          </div>

          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-black mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Unlock Sales Machine
              </h1>
              <p className="text-gray-300 text-lg">
                Generate high-converting DMs that actually close deals
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-6 mb-6 text-left border border-green-500/20">
              <h3 className="font-bold mb-4 text-center text-green-400">What you get:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">8 proven conversation types</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">9 sales-focused goals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Unlimited high-converting replies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Conversation history & analytics</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-xl font-black rounded-2xl mb-4 shadow-2xl transform hover:scale-105 transition-all"
            >
              💰 Get Sales Machine - $9.99/mo
            </Button>

            <p className="text-xs text-gray-400">
              Start closing more deals today • Cancel anytime
            </p>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">Want to try first?</p>
              <Link to="/try">
                <Button variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-900/20">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/70 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-1 rounded-full">
                <Crown className="w-3 h-3" />
                <span className="text-xs font-semibold">Sales Pro</span>
              </div>
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
            Sales Machine Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Generate high-converting DMs that close deals 💰
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-green-400">{conversations.length}</div>
              <p className="text-xs text-gray-400">Sales Messages</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-blue-400">∞</div>
              <p className="text-xs text-gray-400">Remaining</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-purple-400">8</div>
              <p className="text-xs text-gray-400">Message Types</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/30">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold text-orange-400">9</div>
              <p className="text-xs text-gray-400">Sales Goals</p>
            </CardContent>
          </Card>
        </div>

        {/* Generate New Reply Section */}
        <Card className="mb-8 bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-green-400">💰 Generate High-Converting Reply</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose your strategy and watch the magic happen
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowNewReply(!showNewReply)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Reply
              </Button>
            </div>
          </CardHeader>
          
          {showNewReply && (
            <CardContent>
              <div className="space-y-6">
                {/* Strategy Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      🎯 Conversation Type
                    </label>
                    <Select value={conversationType} onValueChange={setConversationType}>
                      <SelectTrigger className="bg-gray-900/80 border-gray-600 text-white">
                        <SelectValue placeholder="Choose your approach..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-600 z-50">
                        {CONVERSATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-800">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      🎯 Sales Goal
                    </label>
                    <Select value={goal} onValueChange={setGoal}>
                      <SelectTrigger className="bg-gray-900/80 border-gray-600 text-white">
                        <SelectValue placeholder="What's your goal?" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-600 z-50">
                        {CONVERSATION_GOALS.map((goalOption) => (
                          <SelectItem key={goalOption.value} value={goalOption.value} className="text-white hover:bg-gray-800">
                            {goalOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    📱 Their Message
                  </label>
                  <Textarea
                    placeholder="Paste what they sent you..."
                    value={newDmText}
                    onChange={(e) => setNewDmText(e.target.value)}
                    className="min-h-32 bg-gray-900/80 border-gray-600 text-white placeholder:text-gray-400 rounded-lg resize-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    disabled={isGenerating}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generateNewReply}
                    disabled={isGenerating || !newDmText.trim() || !conversationType || !goal}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Money Reply...
                      </>
                    ) : (
                      <>
                        💰 Generate High-Converting Reply
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowNewReply(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Conversation History */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-blue-400" />
                <div>
                  <CardTitle>Sales Conversation History</CardTitle>
                  <CardDescription>
                    Your high-converting messages ({filteredConversations.length} total)
                  </CardDescription>
                </div>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No sales messages yet</h3>
                <p className="text-sm">
                  {conversations.length === 0 
                    ? "Generate your first high-converting reply to start closing deals!" 
                    : "No conversations match your search."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all"
                  >
                    {/* Strategy Tags */}
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">
                        {getTypeLabel(conversation.conversation_type)}
                      </span>
                      <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs font-semibold border border-green-500/30">
                        {getGoalLabel(conversation.goal)}
                      </span>
                    </div>

                    {/* Original Message */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">📱 Their Message:</div>
                      <div className="text-sm text-gray-200 bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                        {conversation.original_message}
                      </div>
                    </div>

                    {/* AI Reply */}
                    <div className="mb-4">
                      <div className="text-xs text-green-400 mb-2">💰 Your High-Converting Reply:</div>
                      <div className="text-sm text-white bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-4 rounded-lg border border-green-500/30">
                        {conversation.ai_reply}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {new Date(conversation.created_at).toLocaleDateString()} at{' '}
                        {new Date(conversation.created_at).toLocaleTimeString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(conversation.ai_reply, conversation.id)}
                          size="sm"
                          variant="outline"
                          className="border-green-600/50 text-green-400 hover:bg-green-900/20"
                        >
                          {copiedId === conversation.id ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          onClick={() => deleteConversation(conversation.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-600/50 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            Ready to make more money? Email support@instareply.co
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;