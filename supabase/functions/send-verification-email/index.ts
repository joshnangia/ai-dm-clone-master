import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  confirmationUrl: string;
  isSignup?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, isSignup = true }: VerificationEmailRequest = await req.json();

    console.log('Sending verification email to:', email);

    const emailResponse = await resend.emails.send({
      from: "InstaCloser.ai <noreply@yourdomain.com>", // Change this to your verified domain
      to: [email],
      subject: isSignup ? "Verify your InstaCloser.ai account" : "Login to InstaCloser.ai",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #000; color: #fff; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #fff; font-size: 32px; font-weight: bold; margin: 0;">InstaCloser.ai</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 30px; border-radius: 16px; text-align: center;">
            <h2 style="color: #fff; margin: 0 0 20px 0; font-size: 24px;">
              ${isSignup ? 'Verify Your Account' : 'Complete Your Login'}
            </h2>
            <p style="color: rgba(255,255,255,0.8); margin: 0 0 30px 0; font-size: 16px;">
              ${isSignup 
                ? 'Click the button below to verify your email and start using AI-powered DM replies.'
                : 'Click the button below to complete your login to InstaCloser.ai.'
              }
            </p>
            <a href="${confirmationUrl}" 
               style="display: inline-block; background: #fff; color: #000; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              ${isSignup ? 'Verify Email' : 'Complete Login'}
            </a>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">
              If you didn't request this email, you can safely ignore it.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);