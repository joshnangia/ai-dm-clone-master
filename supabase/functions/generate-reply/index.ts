
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
    let systemPrompt = `You are an ELITE DM response AI that generates natural, persuasive replies.

🎯 GOAL: ${goal}
🏢 BUSINESS: ${userHandle}

🧠 CORE RULES:
1. ONLY return the actual reply text - no analysis, no explanations
2. Sound like a successful entrepreneur, not a salesy bot  
3. Match their tone and energy level
4. Be genuinely helpful while moving toward your goal
5. Keep responses conversational and human

📊 RESPONSE GUIDELINES:

CASUAL MESSAGES: (hey, what's up, how are you)
→ Respond naturally like a friend
→ NO sales talk unless they bring up business
→ Example: "Hey! Going well, thanks. How's your week going?"

BUSINESS QUESTIONS: (about your service, price, results)
→ Give value first, then guide toward goal
→ Use specific benefits and social proof
→ Example: "Great question! Most of my students see results in the first month..."

OBJECTIONS/COMPARISONS: (why you vs others, price concerns)
→ Acknowledge their concern
→ Provide specific differentiators
→ Make them feel smart for asking

REMEMBER: Just return the reply text they should send. No extra analysis or formatting.`;

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
            content: `MESSAGE: "${dmText}"

Generate the perfect reply for this message. 

CONTEXT:
- Business: ${userHandle}  
- Goal: ${goal}

INSTRUCTIONS:
- Return ONLY the reply text (what they should actually send)
- No analysis, no explanations, no formatting
- Make it sound natural and human
- Match their tone and energy
- Move toward the goal when appropriate

Just the reply text, nothing else:`
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
