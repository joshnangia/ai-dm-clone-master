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
  Plus,
  DollarSign,
  Target,
  TrendingUp,
  Zap,
  MessageCircle,
  Crown,
  Settings,
  Download,
  History,
  BarChart3,
  Users,
  Briefcase,
  Save,
  Search
} from 'lucide-react';

interface Conversation {
  id: string;
  original_message: string;
  ai_reply: string;
  user_handle?: string;
  goal?: string;
  created_at: string;
}

interface UserProfile {
  instagram_handle?: string;
  bio?: string;
  saved_handles: string[];
  preferred_goals: string[];
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
  { value: 'convert_lead', label: 'Convert to Lead' },
  { value: 'custom', label: 'Custom Goal' }
];


const Dashboard = () => {
  const { user, session, loading, subscribed, signOut } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newDmText, setNewDmText] = useState('');
  const [userHandle, setUserHandle] = useState('');
  const [goal, setGoal] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReply, setShowNewReply] = useState(false);
  const [generatedReply, setGeneratedReply] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile>({ saved_handles: [], preferred_goals: [] });
  const [showSettings, setShowSettings] = useState(false);
  const [instagramHandle, setInstagramHandle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (subscribed && user) {
      loadConversations();
      loadUserProfile();
    }
  }, [subscribed, user]);

  useEffect(() => {
    // Redirect to auth if no user after loading is complete
    if (!loading && !user) {
      window.location.href = '/auth';
    }
  }, [loading, user]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (!error && data) {
        const socialLinks = data.social_links as any;
        const perks = data.perks as any;
        
        setUserProfile({
          instagram_handle: data.username || '',
          bio: data.bio || '',
          saved_handles: socialLinks?.saved_handles || [],
          preferred_goals: perks?.preferred_goals || []
        });
        setInstagramHandle(data.username || '');
        if (socialLinks?.saved_handles?.length > 0) {
          setUserHandle(socialLinks.saved_handles[0]);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveUserProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          username: instagramHandle,
          social_links: { 
            saved_handles: userProfile.saved_handles.includes(userHandle) 
              ? userProfile.saved_handles 
              : [...userProfile.saved_handles, userHandle]
          },
          perks: { 
            preferred_goals: [...userProfile.preferred_goals, goal].filter(Boolean)
          }
        });

      if (!error) {
        toast({
          title: "Profile saved!",
          description: "Your preferences have been updated.",
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const generateNewReply = async () => {
    const finalGoal = goal === 'custom' ? customGoal : getGoalLabel(goal);
    
    if (!newDmText.trim() || !session || !userHandle || !finalGoal) return;

    setIsGenerating(true);
    setIsAnalyzing(true);
    
    try {
      // Save current inputs to profile
      await saveUserProfile();

      // Simulate analysis for better UX
      setTimeout(() => setIsAnalyzing(false), 2000);

      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: { 
          dmText: newDmText,
          userHandle,
          goal: finalGoal,
          instagramHandle: instagramHandle || userHandle
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.reply) {
        setGeneratedReply(data.reply);
        toast({
          title: "AI reply generated!",
          description: "Your high-converting response is ready.",
        });
        setNewDmText('');
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
      setIsAnalyzing(false);
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
      <div className="min-h-screen bg-black text-white relative">
        {/* Blurred Dashboard Background */}
        <div className="absolute inset-0 filter blur-sm opacity-30">
          {/* Header */}
          <div className="bg-black/95 backdrop-blur-sm border-b border-gray-900 sticky top-0 z-20">
            <div className="px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <ArrowLeft className="w-4 h-4" />
                  Home
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full">
                    <Crown className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Pro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-6 max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sales Machine Pro Dashboard
              </h1>
              <p className="text-xl text-gray-300">
                Turn every DM into cash with AI-powered sales replies
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">247</div>
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
                <div className="text-2xl font-bold text-white">$50K+</div>
                <p className="text-xs text-gray-400">Revenue Generated</p>
              </div>
            </div>

            {/* Generate New Reply Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Generate Money-Making Reply</h2>
                    <p className="text-gray-400">Tell us who you are and what you want to sell</p>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Reply
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg h-12 animate-pulse"></div>
                    <div className="bg-gray-800 rounded-lg h-12 animate-pulse"></div>
                  </div>
                  <div className="bg-gray-800 rounded-lg h-32 animate-pulse"></div>
                  <div className="bg-purple-600/50 rounded-lg h-12 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="bg-gray-700 h-4 w-3/4 rounded animate-pulse mb-2"></div>
                      <div className="bg-gray-700 h-3 w-1/2 rounded animate-pulse"></div>
                    </div>
                    <div className="bg-gray-700 h-8 w-16 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-700 h-3 w-full rounded animate-pulse"></div>
                    <div className="bg-gray-700 h-3 w-5/6 rounded animate-pulse"></div>
                    <div className="bg-gray-700 h-3 w-4/5 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Centered Upgrade Modal */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-black/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unlock Full Access
              </h2>
              <p className="text-gray-300 mb-6">
                Get unlimited AI-powered sales replies and turn every DM into revenue
              </p>

              {/* Features */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Unlimited AI sales replies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">9 proven sales psychology frameworks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Advanced conversation analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Priority customer support</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold rounded-xl mb-4 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                Start Pro Plan - $9.99/mo
              </Button>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-gray-400 pt-4 border-t border-gray-800">
                <Link to="/" className="hover:text-purple-400 transition-colors">← Back to Home</Link>
                <span>Cancel anytime</span>
                <button onClick={signOut} className="hover:text-purple-400 transition-colors">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Enhanced Header */}
      <div className="bg-black/80 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-all duration-300 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Home</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 px-4 py-2 rounded-full">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pro Member</span>
              </div>
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Enhanced Header with Settings */}
        <div className="flex justify-between items-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 rounded-full px-4 py-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Sales Machine Pro Dashboard</span>
          </div>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">⚙️ Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Instagram Handle</label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500/50"
                />
                <p className="text-xs text-gray-400 mt-1">AI learns from your Instagram style</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Quick Actions</label>
                <div className="flex gap-2">
                  <Button onClick={saveUserProfile} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Turn DMs Into Revenue
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate high-converting sales replies powered by advanced AI psychology frameworks
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{conversations.length}</div>
            <p className="text-sm text-purple-300">Sales Replies Generated</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border border-pink-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">∞</div>
            <p className="text-sm text-pink-300">Unlimited Access</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{userProfile.saved_handles.length}</div>
            <p className="text-sm text-purple-300">Saved Handles</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border border-pink-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">97%</div>
            <p className="text-sm text-pink-300">Success Rate</p>
          </div>
        </div>

        {/* Enhanced Generate Section */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 backdrop-blur-sm rounded-3xl mb-12 animate-scale-in overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-1">
            <div className="bg-gray-900/80 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">🎯 AI Sales Reply Generator</h2>
                  <p className="text-gray-400 text-lg">
                    Transform any DM into a money-making opportunity
                  </p>
                </div>
                <Button
                  onClick={() => setShowNewReply(!showNewReply)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/30"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Generate New Reply
                </Button>
              </div>
              
              {showNewReply && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-white">
                        Your Business/Handle
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. @fitnessguru, Course Creator, SaaS Founder"
                          value={userHandle}
                          onChange={(e) => setUserHandle(e.target.value)}
                          className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                          disabled={isGenerating}
                        />
                        {userProfile.saved_handles.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-2">Quick select:</p>
                            <div className="flex flex-wrap gap-2">
                              {userProfile.saved_handles.map((handle, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setUserHandle(handle)}
                                  className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg text-xs hover:bg-purple-600/30 transition-colors"
                                >
                                  {handle}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-white">
                        Sales Objective
                      </label>
                      <Select value={goal} onValueChange={setGoal}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-600/50 text-white h-14 rounded-xl">
                          <SelectValue placeholder="What's your sales goal?" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {SALES_GOALS.map((goalOption) => (
                            <SelectItem key={goalOption.value} value={goalOption.value} className="text-white hover:bg-gray-700">
                              {goalOption.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {goal === 'custom' && (
                        <input
                          type="text"
                          placeholder="Type your custom sales goal..."
                          value={customGoal}
                          onChange={(e) => setCustomGoal(e.target.value)}
                          className="w-full mt-3 px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500/50"
                          disabled={isGenerating}
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-white">
                      Their Message
                    </label>
                    <Textarea
                      placeholder="Paste their DM here and watch the AI work its magic..."
                      value={newDmText}
                      onChange={(e) => setNewDmText(e.target.value)}
                      className="min-h-40 resize-none bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Analysis Preview */}
                  {isAnalyzing && (
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-purple-300 font-medium">AI analyzing message psychology...</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <span className="text-gray-400">Intent Detection</span>
                          <div className="text-purple-400 font-medium">Scanning...</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <span className="text-gray-400">Emotional Tone</span>
                          <div className="text-pink-400 font-medium">Analyzing...</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <span className="text-gray-400">Best Strategy</span>
                          <div className="text-green-400 font-medium">Optimizing...</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={generateNewReply}
                      disabled={isGenerating || !newDmText.trim() || !userHandle || (!goal || (goal === 'custom' && !customGoal))}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Generating High-Converting Reply...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Generate Money-Making Reply
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowNewReply(false)}
                      variant="ghost"
                      className="px-6 py-4 text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
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