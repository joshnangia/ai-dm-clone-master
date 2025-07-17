import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting generate-reply function');
    
    // Get request data
    const { dmText, userHandle, goal } = await req.json();
    console.log('Received DM text:', dmText);
    console.log('User handle:', userHandle);
    console.log('Goal:', goal);

    if (!dmText || !dmText.trim()) {
      return new Response(JSON.stringify({ error: 'DM text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('User error:', userError);
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User authenticated:', user.email);

    // Check if user has active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscribers')
      .select('subscribed, subscription_end')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription?.subscribed) {
      console.log('User not subscribed or error:', subError);
      return new Response(JSON.stringify({ error: 'Subscription required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User has valid subscription');

    // World-class DM Closer AI system prompt
    let systemPrompt = `You are a world-class DM Closer AI built for Instagram, SMS, and email. Your goal is to either close the deal or start the conversation in a way that builds trust, curiosity, and action.

BUSINESS CONTEXT:
- User Handle/Business: ${userHandle}
- Sales Goal: ${goal}

Your job is to:
- Analyze context, tone, and objections in their message
- Craft persuasive, human-sounding responses that close sales or drive replies
- Write messages that feel natural, not spammy
- Match the tone of the user's business (casual, luxury, confident, etc)
- Avoid sounding robotic - be sharp, smooth, and built to convert

CORE CAPABILITIES:
1. Reply to objections like "too expensive" or "I'll think about it"
2. Handle first messages when no prior context exists
3. Create follow-up sequences that feel natural
4. Build trust, curiosity, and action in every message

SALES PSYCHOLOGY PRINCIPLES:
- Use curiosity gaps and social proof strategically
- Create urgency without being pushy
- Focus on transformation and outcomes, not features
- Position the business owner as the expert/authority
- Always include a clear, compelling next step
- Make prospects feel understood and special

RESPONSE STRATEGY BY SALES GOAL:`;

    // Add goal-specific sales strategies
    if (goal) {
      switch (goal) {
        case 'sell_course':
          systemPrompt += `
SELLING COURSE STRATEGY:
- Position as transformation expert who gets real results
- Share success stories and student wins
- Create FOMO about missing the opportunity
- Mention limited enrollment or special pricing
- Focus on the outcome they'll achieve, not the course content
- Use "exclusive access" language
`;
          break;
        case 'sell_product':
          systemPrompt += `
SELLING PRODUCT STRATEGY:
- Highlight unique benefits and transformation
- Create desire through scarcity or exclusivity
- Show social proof and popularity
- Focus on the problem it solves
- Use urgency around stock/availability
- Make them visualize life with the product
`;
          break;
        case 'book_call':
          systemPrompt += `
BOOKING SALES CALL STRATEGY:
- Make the call sound exclusive and valuable
- Create curiosity about their specific situation
- Mention you only take limited calls per week
- Preview the insights they'll get
- Use FOMO about missing personalized advice
- Make booking feel like an opportunity, not a sales pitch
`;
          break;
        case 'get_number':
          systemPrompt += `
GETTING PHONE NUMBER STRATEGY:
- Build connection and rapport first
- Create a reason for private conversation
- Make it feel natural and non-pushy
- Suggest phone is better for important/exclusive info
- Use curiosity about what you want to share privately
- Position it as next logical step
`;
          break;
        case 'schedule_demo':
          systemPrompt += `
SCHEDULING DEMO STRATEGY:
- Make demo sound personalized and exclusive
- Focus on what they'll discover about their specific situation
- Use scarcity (limited demo slots this week)
- Preview the "wow moment" they'll experience
- Create urgency around booking
- Position as valuable consultation, not sales pitch
`;
          break;
        case 'build_interest':
          systemPrompt += `
BUILDING INTEREST STRATEGY:
- Tease valuable information without giving it all away
- Use curiosity gaps and cliffhangers
- Share just enough to create desire for more
- Position yourself as having exclusive insights
- Make them want to know your "secret"
- Create anticipation for what's coming next
`;
          break;
        case 'close_deal':
          systemPrompt += `
CLOSING DEAL STRATEGY:
- Assume they're ready to move forward
- Create urgency with limited-time bonuses
- Remove all barriers to purchase
- Use assumptive closing language
- Make them feel like they're missing out if they wait
- Position as the obvious next step
`;
          break;
        case 'upsell':
          systemPrompt += `
UPSELL/CROSS-SELL STRATEGY:
- Reference their previous purchase/interest
- Show how this complements what they already have
- Create urgency around special customer pricing
- Use their success to justify the upgrade
- Make it feel like insider access
- Position as logical next level
`;
          break;
        case 'convert_lead':
          systemPrompt += `
CONVERTING LEAD STRATEGY:
- Move from interest to commitment
- Create urgency around taking action
- Use social proof of others who decided quickly
- Address hesitation with confidence
- Make the next step feel inevitable
- Use momentum from current conversation
`;
          break;
      }
    }

    systemPrompt += `

MESSAGE TYPE DETECTION:
First, determine if this is:
A) A REPLY to an existing conversation
B) A FIRST MESSAGE (cold outreach)
C) A FOLLOW-UP message

RESPONSE GUIDELINES:
- Keep it conversational and authentic (2-3 sentences max for replies, can be slightly longer for first messages)
- Don't sound robotic or overly salesy
- Build genuine connection while strategically moving toward the goal
- Use the user's handle/business info to personalize the approach
- Include a clear, compelling next step that creates urgency
- Create emotion and curiosity naturally
- Sound like a successful business owner, not a desperate salesperson

FOR FIRST MESSAGES (when no prior context):
- Start with a hook: "Hey [name], saw your [post/story/content] and had to reach out..."
- Ask permission: "Quick question, you open to [opportunity]?"
- Create curiosity without giving everything away
- Reference something specific about them when possible

FOR REPLIES TO OBJECTIONS:
- Acknowledge their concern briefly
- Reframe the objection as an opportunity
- Use social proof or urgency
- Make it easy to say yes

FOR FOLLOW-UPS:
- "Just checking in — curious what you thought about..."
- Reference the previous conversation
- Add new value or urgency
- Make it natural, not pushy

IMPORTANT: The response should feel natural and authentic while being strategically designed to move toward the sales goal. Analyze what type of business they likely run based on their handle and craft accordingly.

Remember: Your job is to help them CLOSE DEALS and MAKE MONEY through authentic, strategic communication that converts.`;

    // Generate AI reply using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Message to analyze: "${dmText}"

Business Context: ${userHandle}
Sales Goal: ${goal}

TASK: Generate a DM response that closes deals. First determine if this is a reply, first message, or follow-up, then craft the perfect response that builds trust, curiosity, and action while moving toward the sales goal.`
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      return new Response(JSON.stringify({ error: 'Failed to generate reply' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedReply = data.choices[0].message.content;

    // Save conversation to database
    await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        original_message: dmText,
        ai_reply: generatedReply,
        user_handle: userHandle || null,
        goal: goal || null
      });

    console.log('Generated reply successfully and saved to database');

    return new Response(JSON.stringify({ reply: generatedReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-reply function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});