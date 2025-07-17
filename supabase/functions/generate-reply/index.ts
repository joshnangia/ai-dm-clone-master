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
    const { dmText, conversationType, goal } = await req.json();
    console.log('Received DM text:', dmText);
    console.log('Conversation type:', conversationType);
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

    // Build sales-focused system prompt based on conversation type and goal
    let systemPrompt = `You are an expert sales professional and master of persuasive communication. Your goal is to write high-converting direct messages that actually close deals and make money.

CORE PRINCIPLES:
- Always focus on SELLING and getting the prospect to take action
- Create urgency and scarcity when appropriate
- Use psychological triggers and persuasion techniques
- Be confident, direct, and results-oriented
- Every message should move the prospect closer to a sale

`;

    // Add conversation type specific instructions
    if (conversationType) {
      switch (conversationType) {
        case 'cold_dm':
          systemPrompt += `COLD DM STRATEGY:
- Hook them immediately with a compelling opener
- Show social proof or credibility quickly
- Create curiosity about your offer
- Don't pitch directly - build interest first
- End with a soft ask to continue the conversation

`;
          break;
        case 'follow_up':
          systemPrompt += `FOLLOW-UP STRATEGY:
- Reference previous conversation naturally
- Add new value or information
- Create urgency about moving forward
- Address any potential hesitations
- Push for commitment or next step

`;
          break;
        case 'objection_handling':
          systemPrompt += `OBJECTION HANDLING STRATEGY:
- Acknowledge their concern genuinely
- Reframe the objection as an opportunity
- Provide social proof or success stories
- Create fear of missing out
- Guide them toward the solution

`;
          break;
        case 'closing':
          systemPrompt += `CLOSING STRATEGY:
- Assume the sale is happening
- Create urgency with limited time/spots
- Use scarcity tactics
- Offer a clear, irresistible next step
- Remove all friction from saying yes

`;
          break;
        case 'appointment_setting':
          systemPrompt += `APPOINTMENT SETTING STRATEGY:
- Make the meeting sound exclusive and valuable
- Use time scarcity (limited slots available)
- Preview the value they'll get from the call
- Make it easy to book with clear next steps
- Create FOMO about missing the opportunity

`;
          break;
        case 'social_proof':
          systemPrompt += `SOCIAL PROOF STRATEGY:
- Share specific results and numbers
- Mention recognizable names or companies
- Use testimonials or case studies
- Show momentum and popularity
- Make them feel left out if they don't join

`;
          break;
        case 'value_proposition':
          systemPrompt += `VALUE PROPOSITION STRATEGY:
- Lead with the biggest benefit
- Quantify the value in dollars/time saved
- Compare to expensive alternatives
- Show unique advantages
- Make the ROI crystal clear

`;
          break;
        case 'urgency_scarcity':
          systemPrompt += `URGENCY/SCARCITY STRATEGY:
- Use time-sensitive language
- Mention limited availability
- Reference other interested prospects
- Create fear of price increases
- Use deadline-driven calls to action

`;
          break;
      }
    }

    // Add goal specific instructions
    if (goal) {
      switch (goal) {
        case 'book_call':
          systemPrompt += `GOAL - BOOK A SALES CALL:
- Position the call as exclusive and valuable
- Mention you only take X calls per week
- Preview what you'll cover on the call
- Ask for their best number and preferred time
- Create urgency around booking

`;
          break;
        case 'get_number':
          systemPrompt += `GOAL - GET PHONE NUMBER:
- Make it feel natural and non-pushy
- Give a reason why you need their number
- Suggest it's for something exclusive or urgent
- Mention you prefer phone over DMs for important stuff
- Make them want to give it to you

`;
          break;
        case 'schedule_demo':
          systemPrompt += `GOAL - SCHEDULE A DEMO:
- Make the demo sound exclusive and personalized
- Mention specific results they'll see
- Use scarcity (limited demo slots)
- Preview the "wow moment" they'll experience
- Make booking easy and immediate

`;
          break;
        case 'close_sale':
          systemPrompt += `GOAL - CLOSE THE SALE:
- Assume they're ready to buy
- Create urgency with bonuses or pricing
- Remove all barriers to purchase
- Use assumptive closing language
- Make it feel like they're missing out if they don't buy NOW

`;
          break;
        case 'get_commitment':
          systemPrompt += `GOAL - GET COMMITMENT:
- Ask for a specific commitment
- Make them say "yes" to something
- Use the foot-in-the-door technique
- Get them to agree to a next step
- Lock in their word/promise

`;
          break;
        case 'overcome_objection':
          systemPrompt += `GOAL - OVERCOME OBJECTION:
- Turn their objection into a reason to buy
- Use "that's exactly why" reframes
- Share stories of others who had the same concern
- Show them the cost of not taking action
- Guide them to see you as the solution

`;
          break;
        case 'build_rapport':
          systemPrompt += `GOAL - BUILD RAPPORT:
- Find common ground quickly
- Mirror their communication style
- Share something personal but relevant
- Show genuine interest in their situation
- Create a connection that leads to trust

`;
          break;
        case 'create_urgency':
          systemPrompt += `GOAL - CREATE URGENCY:
- Use time-sensitive language
- Mention limited opportunities
- Reference other interested people
- Show consequences of waiting
- Make them feel like they need to act NOW

`;
          break;
        case 'next_step':
          systemPrompt += `GOAL - MOVE TO NEXT STEP:
- Be crystal clear about what happens next
- Remove all friction from the next step
- Create excitement about moving forward
- Use momentum from current conversation
- Make it easy to say yes

`;
          break;
      }
    }

    systemPrompt += `
RESPONSE GUIDELINES:
- Keep it concise but powerful (1-2 sentences max)
- Use confident, direct language
- Include specific calls to action
- Create emotion and urgency
- Sound natural and conversational
- ALWAYS focus on making money and closing deals

Remember: Your job is to help them SELL and MAKE MONEY. Every word should serve that purpose.`;

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
            content: `Write a high-converting sales reply to this message: "${dmText}"`
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
        conversation_type: conversationType || null,
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