import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  type: 'signup' | 'login' | 'recovery' | 'invite';
  confirmationUrl?: string;
  magicLinkUrl?: string;
  recoveryUrl?: string;
  inviteUrl?: string;
  userData?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, confirmationUrl, magicLinkUrl, recoveryUrl, inviteUrl, userData }: EmailRequest = await req.json();

    console.log(`Envoi d'email ${type} à ${email}`);

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case 'signup':
        subject = "✅ Confirmez votre inscription - LegalPulse Pro";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">⚖️ LegalPulse Pro</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">Plateforme Avocat - Droit Social</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Bienvenue dans LegalPulse Pro !</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                Merci de vous être inscrit sur notre plateforme dédiée aux avocats spécialisés en droit social.
                Pour finaliser votre inscription, veuillez confirmer votre adresse email.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmationUrl}" 
                   style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                  ✅ Confirmer mon inscription
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                <a href="${confirmationUrl}" style="color: #2563eb; word-break: break-all;">${confirmationUrl}</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                LegalPulse Pro - Simplifiez vos dossiers prud'homaux<br>
                Si vous n'avez pas demandé cette inscription, ignorez cet email.
              </p>
            </div>
          </div>
        `;
        break;

      case 'login':
        subject = "🔐 Votre lien de connexion - LegalPulse Pro";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">⚖️ LegalPulse Pro</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">Connexion sécurisée</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Connexion à votre compte</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                Cliquez sur le bouton ci-dessous pour vous connecter à votre compte LegalPulse Pro.
                Ce lien est valide pendant 1 heure.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLinkUrl}" 
                   style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                  🔓 Se connecter maintenant
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                <a href="${magicLinkUrl}" style="color: #2563eb; word-break: break-all;">${magicLinkUrl}</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                LegalPulse Pro - Plateforme Avocat<br>
                Si vous n'avez pas demandé cette connexion, ignorez cet email.
              </p>
            </div>
          </div>
        `;
        break;

      case 'invite':
        subject = "📨 Invitation - Complétez votre dossier prud'homal";
        const clientName = userData?.clientName || 'Client';
        const lawyerName = userData?.lawyerName || 'Votre avocat';
        const description = userData?.description || 'votre dossier prud\'homal';
        
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">⚖️ LegalPulse</h1>
              <p style="color: #a7f3d0; margin: 10px 0 0 0;">Votre dossier prud'homal</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Bonjour ${clientName},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                ${lawyerName} vous invite à compléter le questionnaire pour préparer ${description}.
                Cette étape nous permettra d'analyser votre situation et de calculer automatiquement vos dommages.
              </p>
              
              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #1e40af; margin: 0; font-weight: 600;">📊 Ce que nous analyserons :</p>
                <ul style="color: #3730a3; margin: 10px 0; padding-left: 20px;">
                  <li>Calcul automatique des heures supplémentaires</li>
                  <li>Barème Macron et indemnités</li>
                  <li>Chronologie automatique des événements</li>
                  <li>Génération des conclusions AI</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteUrl}" 
                   style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                  📝 Commencer le questionnaire
                </a>
              </div>
              
              <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                  ⏱️ <strong>Durée estimée :</strong> 15-20 minutes<br>
                  🔒 <strong>Sécurité :</strong> Vos données sont 100% sécurisées<br>
                  💾 <strong>Sauvegarde :</strong> Vous pouvez reprendre à tout moment
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                <a href="${inviteUrl}" style="color: #2563eb; word-break: break-all;">${inviteUrl}</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                LegalPulse - Simplifiez vos procédures prud'homales<br>
                Cet email a été envoyé par ${lawyerName}.
              </p>
            </div>
          </div>
        `;
        break;

      default:
        throw new Error(`Type d'email non supporté: ${type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "LegalPulse <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email envoyé avec succès:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'email:", error);
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