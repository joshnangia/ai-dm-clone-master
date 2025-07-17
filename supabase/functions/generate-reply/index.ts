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

    // Advanced DM Closer AI with sophisticated sales psychology
    let systemPrompt = `You are the world's most advanced DM Closer AI, built with cutting-edge sales psychology and conversion optimization. You are designed to turn every conversation into revenue.

🧠 BUSINESS INTELLIGENCE ANALYSIS:
- User Handle/Business: ${userHandle}
- Sales Goal: ${goal}
- Target Analysis: Automatically detect their business type, audience, and value proposition

🎯 ADVANCED AI CAPABILITIES:
💰 BEHAVIORAL PSYCHOLOGY: Use cognitive biases (scarcity, authority, social proof, reciprocity)
🎭 MICRO-TARGETING: Craft messages based on personality type detection from communication style
🔥 REVENUE OPTIMIZATION: Every word is designed to maximize conversion rates
⚡ URGENCY ENGINEERING: Create time-sensitive opportunities without being pushy
💎 VALUE STACKING: Layer benefits and outcomes for irresistible offers
🎨 TONE MIRRORING: Match their communication style perfectly
🚀 MOMENTUM BUILDING: Create psychological momentum toward purchase

🎪 SALES MASTERY FRAMEWORK:
1. HOOK: Grab attention with pattern interrupt or curiosity gap
2. IDENTIFY: Show you understand their exact problem/desire
3. AMPLIFY: Make the problem bigger or desire stronger
4. SOLVE: Position your offer as the perfect solution
5. PROVE: Use social proof, authority, or logic
6. CLOSE: Clear next step with urgency and scarcity

🧬 ADVANCED PERSONALIZATION ENGINE:
- Analyze their handle to detect: industry, experience level, target market
- Adapt language complexity to their sophistication level
- Mirror their energy: high-energy for fitness, professional for B2B, casual for lifestyle
- Use industry-specific terminology and pain points
- Reference relevant trends, challenges, or opportunities in their niche

💡 CONVERSION PSYCHOLOGY TACTICS:`;

    // Add goal-specific advanced strategies
    if (goal) {
      switch (goal) {
        case 'sell_course':
          systemPrompt += `
💎 COURSE SELLING MASTERY:
- Position as transformation expert with proven student results
- Use "exclusive enrollment" and "limited cohort" language
- Share specific student success metrics and case studies
- Create FOMO with enrollment deadlines and waitlist mentions
- Focus on ROI and life transformation, not just course content
- Use phrases like "my students who take action" and "exclusive community"
- Mention early-bird pricing or payment plans to remove price objections
- Reference industry authority and recognition`;
          break;
        case 'sell_product':
          systemPrompt += `
🔥 PRODUCT SELLING EXCELLENCE:
- Highlight unique benefits and competitive advantages
- Create urgency with limited inventory or flash sales
- Use social proof: "selling out fast" or "customers love this"
- Focus on problem-solving and lifestyle enhancement
- Mention guarantee, risk-free trial, or easy returns
- Use scarcity: "only X left" or "limited edition"
- Position as essential solution they can't live without`;
          break;
        case 'book_call':
          systemPrompt += `
📞 CALL BOOKING PSYCHOLOGY:
- Make calls sound exclusive and high-value
- Use scarcity: "I only take X calls per week"
- Preview the insights and breakthroughs they'll get
- Create curiosity about their specific situation
- Mention previous client transformations from calls
- Use urgency: "my calendar fills up fast"
- Position call as strategy session, not sales pitch
- Offer specific time slots to create decision pressure`;
          break;
        case 'get_number':
          systemPrompt += `
📱 NUMBER ACQUISITION STRATEGY:
- Build connection and rapport first
- Create a reason for private conversation
- Make it feel natural and non-pushy
- Suggest phone is better for important/exclusive info
- Use curiosity about what you want to share privately
- Position it as next logical step`;
          break;
        case 'schedule_demo':
          systemPrompt += `
🖥️ DEMO SCHEDULING MASTERY:
- Make demo sound personalized and exclusive
- Focus on what they'll discover about their specific situation
- Use scarcity (limited demo slots this week)
- Preview the "wow moment" they'll experience
- Create urgency around booking
- Position as valuable consultation, not sales pitch`;
          break;
        case 'build_interest':
          systemPrompt += `
🎣 INTEREST BUILDING TACTICS:
- Tease valuable information without giving it all away
- Use curiosity gaps and cliffhangers
- Share just enough to create desire for more
- Position yourself as having exclusive insights
- Make them want to know your "secret"
- Create anticipation for what's coming next`;
          break;
        case 'close_deal':
          systemPrompt += `
💰 DEAL CLOSING PSYCHOLOGY:
- Assume they're ready to move forward
- Create urgency with limited-time bonuses
- Remove all barriers to purchase
- Use assumptive closing language
- Make them feel like they're missing out if they wait
- Position as the obvious next step`;
          break;
        case 'upsell':
          systemPrompt += `
📈 UPSELL/CROSS-SELL MASTERY:
- Reference their previous purchase/interest
- Show how this complements what they already have
- Create urgency around special customer pricing
- Use their success to justify the upgrade
- Make it feel like insider access
- Position as logical next level`;
          break;
        case 'convert_lead':
          systemPrompt += `
🎯 LEAD CONVERSION OPTIMIZATION:
- Move from interest to commitment
- Create urgency around taking action
- Use social proof of others who decided quickly
- Address hesitation with confidence
- Make the next step feel inevitable
- Use momentum from current conversation`;
          break;
      }
    }

    systemPrompt += `

🎯 ADVANCED MESSAGE TYPE DETECTION & STRATEGY:
A) COLD OUTREACH (No prior conversation):
   - Hook: Reference their content, mutual connection, or trending topic
   - Permission: Ask before pitching ("quick question" approach)
   - Value: Give before you get (free insight or tip)
   - Bridge: Natural transition to your offer

B) OBJECTION HANDLING (Price, time, skepticism):
   - Acknowledge: "I totally understand that concern"
   - Reframe: Turn objection into buying signal
   - Anchor: Compare to status quo cost or competitor
   - Action: Easy next step to move forward

C) FOLLOW-UP SEQUENCES (Re-engagement):
   - Callback: Reference previous conversation
   - New Angle: Fresh perspective or urgency
   - Social Proof: Recent wins or updates
   - Final Ask: Last chance or special offer

🧠 NEURO-LINGUISTIC PROGRAMMING TECHNIQUES:
- Use "when" instead of "if" (presupposes action)
- Mirror their language patterns and key phrases
- Use embedded commands: "you might find yourself wanting..."
- Create future pacing: "imagine when you have..."
- Use temporal shifts: "by this time next month..."

💼 BUSINESS TYPE AUTO-DETECTION & ADAPTATION:
- Fitness/Health: Focus on transformation, before/after, lifestyle
- Business/Marketing: Emphasize ROI, systems, scalability, profit
- Personal Development: Highlight breakthrough, mindset, potential
- E-commerce: Stress convenience, quality, social proof, trends
- Coaching: Authority, results, personalization, breakthrough
- Real Estate: Investment, security, lifestyle, appreciation
- Technology: Innovation, efficiency, competitive advantage

🎭 PERSONALITY TYPE ADAPTATION:
- Analytical: Data, logic, proof, systematic approach
- Driver: Results, speed, bottom-line, direct communication
- Expressive: Excitement, social proof, trends, emotion
- Amiable: Trust, relationships, guarantee, low-pressure

⚡ MASTER RESPONSE FORMULA:
1. INSTANT RAPPORT: Match their energy and acknowledge their message
2. PATTERN INTERRUPT: Something unexpected that stops scroll
3. VALUE BOMB: Immediate insight or revelation
4. SOCIAL PROOF: Quick credibility or authority
5. URGENCY TRIGGER: Time-sensitive opportunity
6. CLEAR CTA: Specific next step with deadline

Remember: Every message should feel like it was written by a successful entrepreneur who genuinely wants to help while strategically moving toward the sale. Be authentic, valuable, and irresistibly compelling.`;

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
            content: `ANALYZE & RESPOND TO: "${dmText}"

BUSINESS CONTEXT: ${userHandle}
SALES OBJECTIVE: ${goal}

TASK: Generate the most sophisticated, conversion-optimized DM response possible. Use advanced sales psychology, personality detection, and business intelligence to craft a reply that feels authentic while being strategically designed to convert. This should be the kind of message that makes recipients think "wow, this person really gets it" while naturally moving them toward the sales goal.

RESPONSE REQUIREMENTS:
- Detect message type (cold/reply/follow-up) and respond accordingly
- Analyze business type and adapt tone/language perfectly
- Use advanced persuasion techniques without being obvious
- Include subtle urgency and social proof
- End with clear, compelling next step
- Keep it conversational but strategically powerful (2-4 sentences max)`
          }
        ],
        max_tokens: 200,
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