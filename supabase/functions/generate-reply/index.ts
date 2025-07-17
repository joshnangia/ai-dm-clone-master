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
    const { dmText } = await req.json();
    console.log('Received DM text:', dmText);

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
            content: `You are an expert at writing engaging, flirty, and charming replies to direct messages. Your goal is to help the user create responses that are:
- Confident and playful
- Personalized to the message received
- Engaging and conversation-starting
- Appropriate but flirty
- Natural and authentic

Keep responses concise (1-2 sentences max) and always maintain a fun, confident tone.`
          },
          {
            role: 'user',
            content: `Write a perfect flirty reply to this DM: "${dmText}"`
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
        ai_reply: generatedReply
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