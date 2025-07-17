import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const email = session.customer_details?.email;
    if (!email) {
      throw new Error("No email found in session");
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create user account (no email verification needed)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true, // Skip email verification
      user_metadata: {
        payment_verified: true,
        stripe_customer_id: session.customer,
        subscription_id: session.subscription,
      }
    });

    if (authError) {
      console.error("Auth error:", authError);
      // If user already exists, that's fine - just update their subscription
      if (!authError.message.includes("already registered")) {
        throw authError;
      }
    }

    // Update subscribers table
    await supabase.from("subscribers").upsert({
      email,
      user_id: authData?.user?.id,
      stripe_customer_id: session.customer,
      subscribed: true,
      subscription_tier: "premium",
      subscription_end: null, // Active subscription
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    console.log("User account processed successfully for:", email);

    return new Response(JSON.stringify({ 
      success: true, 
      email,
      userId: authData?.user?.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});