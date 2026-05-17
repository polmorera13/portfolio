import { Resend } from "npm:resend@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "re_iYsDTmU2_BRZestnXFxXqtXSr2GkbcQNz";
const DESTINATION_EMAIL = Deno.env.get("CONTACT_DESTINATION_EMAIL") ?? "hello@polmorera.es";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "invalid" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: "Portfolio <noreply@polmorera.es>",
      to: DESTINATION_EMAIL,
      reply_to: email,
      subject: `Nuevo contacto: ${name}`,
      text: `De: ${name} <${email}>\n\n${message?.trim() || "(sin mensaje)"}`,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("contact-form error:", err);
    return new Response(JSON.stringify({ error: "server_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
