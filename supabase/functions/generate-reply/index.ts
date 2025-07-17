
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

    // Check if this is a free try (no auth) or authenticated user
    const authHeader = req.headers.get('Authorization');
    const isFreeMode = !authHeader || authHeader.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdHdhd3pra2tycmVveWdraGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzMzNTQsImV4cCI6MjA2NTEwOTM1NH0._RHtQYQDbOOv-GK-PwqTTvlUZR1XJbK1at186VVLzLQ');
    
    let user = null;
    
    if (!isFreeMode) {
      // Create Supabase client with service role key
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Get user from token
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !authUser) {
        console.error('User error:', userError);
        return new Response(JSON.stringify({ error: 'Invalid user' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('User authenticated:', authUser.email);

      // Check if user has active subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_end')
        .eq('user_id', authUser.id)
        .single();

      if (subError || !subscription?.subscribed) {
        console.log('User not subscribed or error:', subError);
        return new Response(JSON.stringify({ error: 'Subscription required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('User has valid subscription');
      user = authUser;
    } else {
      console.log('Free mode request - no authentication required');
    }

    // MASSIVELY IMPROVED AI SYSTEM
    let systemPrompt = `You are an ELITE communication AI that understands human psychology and context at the deepest level.

🧠 CORE INTELLIGENCE RULES:
1. ANALYZE CONTEXT FIRST - What type of conversation is this?
2. MATCH THEIR ENERGY - Mirror their communication style exactly
3. BE GENUINELY HELPFUL - Don't just push toward sales goals
4. SOUND LIKE A REAL PERSON - Not a sales bot

📊 CONVERSATION TYPE DETECTION:

CASUAL/SOCIAL: ("hey", "what's up", "how are you", "lol", "haha", general chat)
→ Respond naturally like a friend would
→ NO sales language whatsoever
→ Build genuine connection
→ Example: "Pretty good! Just staying busy with work. How about you?"

BUSINESS/SALES: (mentions product, price, service, "interested", objections)
→ Now you can use strategic sales psychology
→ Focus on value and benefits
→ Address concerns professionally
→ Guide toward goal: ${goal}

FOLLOW-UP/NURTURE: (existing conversation, checking in, updates)
→ Reference previous context
→ Provide value or updates
→ Natural progression in relationship

🎯 GOAL CONTEXT: ${goal}
🏢 BUSINESS: ${userHandle}

💡 ADVANCED PSYCHOLOGY TECHNIQUES:

FOR CASUAL MESSAGES:
- Mirror their exact tone and energy
- Use similar language patterns
- Be genuinely interested and curious
- Ask natural follow-up questions
- NO mention of business unless they bring it up

FOR BUSINESS MESSAGES:
- Use reciprocity (give value first)
- Create urgency through scarcity
- Use social proof and authority
- Address emotional motivations
- Make next step feel obvious and easy

FOR OBJECTIONS:
- Acknowledge their concern first
- Reframe the objection as a buying signal
- Use "feel, felt, found" technique
- Provide specific evidence or examples
- Make them feel smart for asking

🎭 PERSONALITY MIRRORING:
- Professional tone → Match their professionalism
- Casual tone → Be relaxed and friendly
- Excited tone → Show enthusiasm
- Serious tone → Be direct and focused

🚀 RESPONSE QUALITY STANDARDS:
- Must sound like it came from a successful entrepreneur
- Zero generic or template language
- Specific to their message context
- Moves conversation forward naturally
- Creates curiosity and engagement

REMEMBER: You're not a pushy salesperson. You're a successful business owner who genuinely wants to help while achieving your goals. Be smart, strategic, and authentically human.`;

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
            content: `MESSAGE TO ANALYZE: "${dmText}"

STEP 1 - CONVERSATION TYPE DETECTION:
Is this: A) Casual/Social chat  B) Business/Sales discussion  C) Follow-up/Nurture?

STEP 2 - CONTEXT ANALYSIS:
- What's their emotional state?
- What's their actual intent?
- What do they really want to know?

STEP 3 - STRATEGIC RESPONSE:
- If CASUAL: Respond like a normal human friend would
- If BUSINESS: Use advanced sales psychology toward goal: ${goal}
- If FOLLOW-UP: Reference context and provide value

BUSINESS: ${userHandle}
GOAL: ${goal}

Generate a response that feels completely natural and human while being strategically effective.`
          }
        ],
        max_tokens: 250,
        temperature: 0.7,
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

    // Save conversation to database only if user is authenticated
    if (user) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          original_message: dmText,
          ai_reply: generatedReply,
          goal: goal || null
        });
    }

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
