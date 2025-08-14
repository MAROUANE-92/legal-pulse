import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, Send, Copy, Check, ExternalLink } from 'lucide-react';
import { DossiersAPI } from '@/shared/api/dossiers';
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
      const { data, error } = await DossiersAPI.createDossier(formData.clientEmail);
      
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
        
        // Enregistrer l'invitation dans la table invites existante
        await supabase.from('invites').insert({
          email: formData.clientEmail,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        });
        
        setCreated(true);
        
        toast({
          title: "Dossier créé !",
          description: "Invitation enregistrée pour " + formData.clientEmail,
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

        {/* Lien Client */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Lien pour le client
            </CardTitle>
            <CardDescription>
              Envoyez ce lien à {formData.clientEmail} pour qu'il remplisse son questionnaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL */}
            <div className="flex gap-2">
              <Input 
                value={clientUrl} 
                readOnly 
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={copyToClipboard} variant="outline" size="icon">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a href={`mailto:${formData.clientEmail}?subject=%E2%9A%96%EF%B8%8F%20Votre%20dossier%20prud%27hommes%20-%20LegalPulse&body=Bonjour%2C%0D%0A%0D%0AMa%C3%AEtre%20${encodeURIComponent(formData.clientName || 'votre avocat')}%20vous%20invite%20%C3%A0%20compl%C3%A9ter%20votre%20dossier%20prud%27hommes.%0D%0A%0D%0A%F0%9F%94%97%20Lien%20s%C3%A9curis%C3%A9%20%3A%20${encodeURIComponent(clientUrl)}%0D%0A%0D%0A%E2%8F%B1%EF%B8%8F%20Dur%C3%A9e%20estim%C3%A9e%20%3A%2015-20%20minutes%0D%0A%F0%9F%94%92%20Donn%C3%A9es%20100%25%20s%C3%A9curis%C3%A9es%0D%0A%0D%0ACordialement%2C%0D%0AL%27%C3%A9quipe%20LegalPulse`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer par email
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={clientUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Tester
                </a>
              </Button>
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