import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const requestBody = await req.json();
    logStep("Request body received", requestBody);
    
    const { sessionId } = requestBody;
    
    if (!sessionId) {
      logStep("ERROR: No session ID provided");
      throw new Error("Session ID is required");
    }

    logStep("Session ID received", { sessionId });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: No Stripe secret key found");
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    logStep("Retrieving Stripe session");
    // Get checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Stripe session retrieved", { 
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      customer_id: session.customer
    });
    
    if (session.payment_status !== "paid") {
      logStep("ERROR: Payment not completed", { payment_status: session.payment_status });
      throw new Error(`Payment not completed. Status: ${session.payment_status}`);
    }

    const email = session.customer_details?.email || session.metadata?.user_email;
    if (!email) {
      logStep("ERROR: No email found", { 
        customer_details: session.customer_details,
        metadata: session.metadata 
      });
      throw new Error("No email found in session");
    }

    logStep("Email extracted", { email });

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create user account with default password
    const defaultPassword = "InstaReply2024!"; // Simple default password for all users
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true, // Skip email verification
      user_metadata: {
        payment_verified: true,
        stripe_customer_id: session.customer,
        subscription_id: session.subscription,
        default_password: true
      }
    });

    let userId = authData?.user?.id;

    if (authError) {
      console.error("Auth error:", authError);
      // If user already exists, get their ID and update subscription
      if (authError.message.includes("already registered")) {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers.users.find(u => u.email === email);
        userId = existingUser?.id;
        console.log("User already exists, updating subscription for:", email);
      } else {
        throw authError;
      }
    }

    // Update subscribers table
    await supabase.from("subscribers").upsert({
      email,
      user_id: userId,
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
      userId: userId,
      defaultPassword: defaultPassword
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