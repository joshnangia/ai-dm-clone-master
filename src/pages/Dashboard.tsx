import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Crown, 
  MessageSquare, 
  ArrowLeft, 
  History, 
  Copy, 
  Check, 
  Trash2,
  Search,
  Plus,
  Sparkles
} from 'lucide-react';

interface Conversation {
  id: string;
  original_message: string;
  ai_reply: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, session, subscribed, signOut } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newDmText, setNewDmText] = useState('');
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
    if (!newDmText.trim() || !session) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: { dmText: newDmText },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.reply) {
        toast({
          title: "Reply generated!",
          description: "New conversation added to your history.",
        });
        setNewDmText('');
        setShowNewReply(false);
        loadConversations(); // Refresh the list
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
      title: "Copied!",
      description: "Reply copied to clipboard.",
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
        description: "Conversation removed from history.",
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

  if (!subscribed) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
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
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-black mb-2">
                Upgrade to Premium
              </h1>
              <p className="text-gray-300 text-sm">
                Get unlimited AI replies and never get left on read again
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 mb-6 text-left">
              <h3 className="font-bold mb-4 text-center">What you get:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Unlimited AI replies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Conversation history</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Perfect responses every time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-xl font-black rounded-2xl mb-4"
            >
              Get Premium - $9.99/mo
            </Button>

            <p className="text-xs text-gray-400">
              Secure payment with Stripe • Cancel anytime
            </p>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-3">Want to try first?</p>
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur border-b border-white/10 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-green-600 px-3 py-1 rounded-full font-medium">
                Premium Active
              </span>
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

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your AI Reply Dashboard
          </h1>
          <p className="text-gray-300">
            Generate perfect replies and manage your conversation history
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* New Reply Card */}
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30 hover:border-purple-400/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Generate New Reply</h2>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Create the perfect response to any DM
              </p>
              <Button 
                onClick={() => setShowNewReply(!showNewReply)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Reply
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <History className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Your Stats</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-purple-400">{conversations.length}</div>
                  <p className="text-xs text-gray-400">Total Replies</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">∞</div>
                  <p className="text-xs text-gray-400">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Reply Form */}
        {showNewReply && (
          <Card className="mb-8 bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                Generate New Reply
              </CardTitle>
              <CardDescription>
                Paste the DM you received and get the perfect reply
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Hey, I saw your story about..."
                  value={newDmText}
                  onChange={(e) => setNewDmText(e.target.value)}
                  className="min-h-32 bg-gray-900/80 border-gray-600 text-white placeholder:text-gray-400 rounded-lg resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  disabled={isGenerating}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={generateNewReply}
                    disabled={isGenerating || !newDmText.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Reply
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowNewReply(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conversation History */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <CardTitle>Conversation History</CardTitle>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            <CardDescription>
              Your previous AI-generated replies ({filteredConversations.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-sm">
                  {conversations.length === 0 
                    ? "Generate your first AI reply to get started!" 
                    : "No conversations match your search."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all"
                  >
                    {/* Original Message */}
                    <div className="mb-3">
                      <div className="text-xs text-gray-400 mb-1">Original DM:</div>
                      <div className="text-sm text-gray-200 bg-gray-800/50 p-3 rounded-md">
                        {conversation.original_message}
                      </div>
                    </div>

                    {/* AI Reply */}
                    <div className="mb-3">
                      <div className="text-xs text-purple-400 mb-1">AI Reply:</div>
                      <div className="text-sm text-white bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-3 rounded-md border border-purple-500/20">
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
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
        <div className="text-center mt-8 pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            Need help? Email support@instareply.co
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;