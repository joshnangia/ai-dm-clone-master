import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    console.log("Starting cleanup of test accounts");

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }

    console.log(`Found ${users.users.length} users to check`);

    // Delete test accounts (keeping only production emails)
    const testEmails = [
      'joshomenstudios@gmail.com',
      'test@example.com',
      'demo@example.com'
    ];

    let deletedCount = 0;
    
    for (const user of users.users) {
      if (user.email && testEmails.includes(user.email)) {
        console.log(`Deleting test user: ${user.email}`);
        
        // Delete from subscribers table first
        await supabase.from('subscribers').delete().eq('user_id', user.id);
        
        // Delete the auth user
        await supabase.auth.admin.deleteUser(user.id);
        
        deletedCount++;
      }
    }

    console.log(`Cleanup completed. Deleted ${deletedCount} test accounts.`);

    return new Response(JSON.stringify({ 
      success: true,
      deletedCount,
      message: `Deleted ${deletedCount} test accounts`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
