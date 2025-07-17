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
      <div className="min-h-screen bg-background text-foreground">
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Out
            </Button>
          </div>

          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-fade-in">
                <MessageCircle className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Unlock InstaDM Pro
              </h1>
              <p className="text-muted-foreground text-lg">
                Generate perfect Instagram DM replies that get responses
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 mb-6 text-left border shadow-sm">
              <h3 className="font-semibold mb-4 text-center">What you get:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">8 proven conversation types</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">9 strategic goals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Unlimited AI-generated replies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Conversation history & analytics</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              className="w-full py-6 text-lg font-semibold rounded-xl mb-4 transition-all hover:scale-105"
            >
              Get InstaDM Pro - $9.99/mo
            </Button>

            <p className="text-xs text-muted-foreground">
              Start getting better responses today • Cancel anytime
            </p>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-3">Want to try first?</p>
              <Link to="/try">
                <Button variant="outline" className="w-full">
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-20">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
                <Crown className="w-3 h-3 text-primary-foreground" />
                <span className="text-xs font-semibold text-primary-foreground">Pro</span>
              </div>
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground transition-colors"
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
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            InstaDM Pro Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate perfect Instagram DM replies with AI
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{conversations.length}</div>
              <p className="text-xs text-muted-foreground">Generated Replies</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">∞</div>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Message Types</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-muted-foreground">Goals</p>
            </CardContent>
          </Card>
        </div>

        {/* Generate New Reply Section */}
        <Card className="mb-8 animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Generate Perfect Reply</CardTitle>
                <CardDescription>
                  Choose your strategy and create the perfect response
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowNewReply(!showNewReply)}
                className="transition-all hover:scale-105"
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
                    <label className="block text-sm font-medium mb-2">
                      Conversation Type
                    </label>
                    <Select value={conversationType} onValueChange={setConversationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your approach..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CONVERSATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Goal
                    </label>
                    <Select value={goal} onValueChange={setGoal}>
                      <SelectTrigger>
                        <SelectValue placeholder="What's your goal?" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONVERSATION_GOALS.map((goalOption) => (
                          <SelectItem key={goalOption.value} value={goalOption.value}>
                            {goalOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Their Message
                  </label>
                  <Textarea
                    placeholder="Paste what they sent you..."
                    value={newDmText}
                    onChange={(e) => setNewDmText(e.target.value)}
                    className="min-h-32 resize-none"
                    disabled={isGenerating}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generateNewReply}
                    disabled={isGenerating || !newDmText.trim() || !conversationType || !goal}
                    className="flex-1 font-semibold py-3 transition-all hover:scale-105"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
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
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Conversation History */}
        <Card className="animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Your Replies</CardTitle>
                <CardDescription>
                  Generated conversation history
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No conversations yet</p>
                <p className="text-muted-foreground text-sm">
                  Generate your first reply above
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConversations.map((conv) => (
                  <div key={conv.id} className="bg-card rounded-xl p-4 border transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                          {getTypeLabel(conv.conversation_type)}
                        </span>
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                          {getGoalLabel(conv.goal)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => copyToClipboard(conv.ai_reply, conv.id)}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {copiedId === conv.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={() => deleteConversation(conv.id)}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-muted-foreground/30">
                        <p className="text-sm font-medium mb-1">Their Message:</p>
                        <p className="text-foreground">{conv.original_message}</p>
                      </div>
                      
                      <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary">
                        <p className="text-sm text-primary font-medium mb-1">Your Perfect Reply:</p>
                        <p className="text-foreground">{conv.ai_reply}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-muted-foreground">
                      {new Date(conv.created_at).toLocaleDateString()} at {new Date(conv.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="text-center mt-8 pt-8 border-t">
          <p className="text-muted-foreground text-sm">
            Need help? Contact support@instadm.pro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;