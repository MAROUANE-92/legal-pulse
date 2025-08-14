import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, Send, Copy, Check, ExternalLink } from 'lucide-react';
import { DossiersAPI } from '@/shared/api/dossiers';
import { AuthAPI } from '@/shared/api/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

function NewDossier() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [clientUrl, setClientUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    clientEmail: '',
    clientName: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔥 Création dossier pour:', formData.clientEmail);
      const { data, error } = await DossiersAPI.createDossier(formData.clientEmail, formData.clientName, formData.description);
      
      if (error) {
        toast({
          title: "Erreur",
          description: error,
          variant: "destructive"
        });
        return;
      }

      if (data?.token) {
        // Construire l'URL pour le client
        const url = `${window.location.origin}/client/${data.token}/welcome`;
        setClientUrl(url);
        
        // Envoyer uniquement notre email d'invitation personnalisé (pas de magic link Supabase)
        try {
          const { error: emailError } = await supabase.functions.invoke('send-email', {
            body: {
              email: formData.clientEmail,
              type: 'invite',
              inviteUrl: url,
              userData: {
                clientName: formData.clientName || 'Client',
                lawyerName: 'Votre avocat',
                description: formData.description || 'Dossier prud\'homal'
              }
            }
          });
          
          if (emailError) {
            throw new Error(`Erreur envoi email: ${emailError.message}`);
          }
          
          console.log('✅ Email d\'invitation personnalisé envoyé avec succès');
        } catch (emailError) {
          console.error('❌ Erreur email invitation:', emailError);
          toast({
            title: "Erreur",
            description: `Impossible d'envoyer l'email d'invitation: ${(emailError as Error).message}`,
            variant: "destructive"
          });
          return;
        }

        // Enregistrer l'invitation dans la table invites avec le lien vers le dossier
        await supabase.from('invites').insert({
          email: formData.clientEmail,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          dossier_id: data.dossierId
        });
        
        setCreated(true);
        
        toast({
          title: "Dossier créé !",
          description: `Email d'invitation envoyé à ${formData.clientEmail}`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le dossier",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(clientUrl);
      setCopied(true);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans le presse-papiers"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  if (created) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-green-600">✅ Dossier créé !</h1>
            <p className="text-muted-foreground">Le questionnaire client est prêt</p>
          </div>
        </div>

        {/* Confirmation */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Email d'invitation envoyé !
            </CardTitle>
            <CardDescription>
              {formData.clientEmail} a reçu l'email d'invitation pour compléter son dossier
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL de secours */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Lien de secours :</p>
              <div className="flex gap-2">
                <Input 
                  value={clientUrl} 
                  readOnly 
                  className="flex-1 font-mono text-xs"
                />
                <Button onClick={copyToClipboard} variant="outline" size="icon">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-2">
          <Button onClick={() => navigate('/dossiers')} className="flex-1">
            Voir les dossiers
          </Button>
          <Button variant="outline" onClick={() => {
            setCreated(false);
            setFormData({ clientEmail: '', clientName: '', description: '' });
          }}>
            Nouveau dossier
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nouveau Dossier</h1>
          <p className="text-muted-foreground">Créer un questionnaire client</p>
        </div>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informations Client
          </CardTitle>
          <CardDescription>
            Le client recevra un lien sécurisé pour remplir son questionnaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email du client *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                placeholder="client@exemple.fr"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Nom du client (optionnel)</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Jean Dupont"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du dossier (optionnel)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Licenciement abusif, rupture conventionnelle..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Création...' : 'Créer le dossier'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="font-semibold">📧 Étapes suivantes</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>1. Le client recevra un lien sécurisé par email</p>
              <p>2. Il remplira le questionnaire (11 étapes)</p>
              <p>3. Vous recevrez une notification à la fin</p>
              <p>4. L'IA calculera automatiquement les dommages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewDossier;