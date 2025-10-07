import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  studentEmail: string;
  studentName: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentEmail, studentName, status, rejectionReason }: EmailRequest = await req.json();

    console.log(`Sending ${status} email to ${studentEmail}`);

    let subject: string;
    let html: string;

    if (status === "approved") {
      subject = "Váš účet byl schválen! 🎉";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #22c55e;">Gratulujeme, ${studentName}!</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Váš účet v autoškole byl úspěšně schválen instruktorem.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Nyní můžete začít rezervovat své jízdní lekce a pokračovat v kurzu.
          </p>
          <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #22c55e;">
            <p style="margin: 0; font-weight: bold;">Co dělat dále?</p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Přihlaste se do svého účtu</li>
              <li>Zarezervujte si první jízdní lekci</li>
              <li>Připravte se na začátek kurzu</li>
            </ul>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            S pozdravem,<br>
            Váš tým autoškoly
          </p>
        </div>
      `;
    } else {
      subject = "Aktualizace vašeho účtu v autoškole";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Aktualizace vašeho účtu</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Dobrý den, ${studentName},
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Váš instruktor přezkoumal vaše dokumenty a potřebuje, abyste je znovu nahráli.
          </p>
          <div style="margin: 30px 0; padding: 20px; background-color: #fef2f2; border-left: 4px solid #ef4444;">
            <p style="margin: 0; font-weight: bold;">Důvod:</p>
            <p style="margin: 10px 0 0 0;">${rejectionReason || "Nebyl uveden žádný konkrétní důvod."}</p>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">
            Prosím přihlaste se do svého účtu a nahrajte aktualizované dokumenty. 
            Po přezkoumání vás budeme kontaktovat.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            S pozdravem,<br>
            Váš tým autoškoly
          </p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Autoškola <onboarding@resend.dev>",
      to: [studentEmail],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
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
