import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";

export default function AccessPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const formSlug = new URLSearchParams(window.location.search).get("form") || "test";
  const hasError = new URLSearchParams(window.location.search).get("error");
  const errorDetails = new URLSearchParams(window.location.search).get("details");
  
  console.log('AccessPage loaded with:', { formSlug, hasError, errorDetails, currentUrl: window.location.href });

  const sendMagicLink = async () => {
    if (!email || !formSlug) {
      console.log('Missing email or formSlug:', { email, formSlug });
      return;
    }
    
    console.log('Sending magic link for:', { email, formSlug });
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { 
          data: { formSlug },
          shouldCreateUser: true, // Permet la création d'utilisateur
          emailRedirectTo: `${window.location.origin}/form/redirect`
        }
      });
      
      console.log('Supabase response:', { error });
      
      if (!error) {
        console.log('Magic link sent successfully');
        setSent(true);
      } else {
        console.error('Magic link error:', error);
        alert(`Erreur: ${error.message}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Erreur inattendue lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Accès à votre dossier</CardTitle>
          <CardDescription>
            Saisissez votre adresse e-mail pour recevoir un lien sécurisé
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">E-mail envoyé !</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Consultez votre boîte e-mail et cliquez sur le lien pour accéder à votre dossier.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="votre-email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && email && sendMagicLink()}
                />
              </div>
              
              <Button 
                onClick={sendMagicLink} 
                disabled={!email || loading}
                className="w-full"
              >
                {loading ? "Envoi en cours..." : "Recevoir mon lien magique"}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Formulaire: {formSlug} | Email: {email || 'non saisi'}
                {hasError && (
                  <span className="text-red-500">
                    <br />Erreur: {hasError}
                    {errorDetails && <br />}
                    {errorDetails && <>Détails: {errorDetails}</>}
                  </span>
                )}
              </p>
              
              <p className="text-xs text-muted-foreground text-center">
                Le lien sera valide pendant 60 minutes
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}