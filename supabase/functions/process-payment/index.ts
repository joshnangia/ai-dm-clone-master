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

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: No Stripe secret key found");
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    logStep("Retrieving Stripe session");
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

    // Find existing user by email - users must sign up first
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(u => u.email === email);
    
    if (!existingUser) {
      logStep("ERROR: No existing user found", { email });
      throw new Error(`No account found for ${email}. Please create a free account first, then upgrade to premium.`);
    }

    logStep("Found existing user", { userId: existingUser.id, email });

    // Update subscribers table to mark as premium
    const { error: upsertError } = await supabase.from("subscribers").upsert({
      email,
      user_id: existingUser.id,
      stripe_customer_id: session.customer,
      subscribed: true,
      subscription_tier: "premium",
      subscription_end: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    if (upsertError) {
      logStep("ERROR: Failed to update subscription", { error: upsertError.message });
      throw new Error(`Failed to update subscription: ${upsertError.message}`);
    }

    logStep("Subscription updated successfully", { userId: existingUser.id });

    return new Response(JSON.stringify({ 
      success: true, 
      email,
      userId: existingUser.id,
      message: "Your account has been upgraded to premium!"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});