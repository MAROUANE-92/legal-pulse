import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Mail, User, Shield, ArrowRight } from 'lucide-react';

export const WelcomeStep = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation des mots de passe
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erreur",
          description: "Les mots de passe ne correspondent pas",
          variant: "destructive"
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Erreur", 
          description: "Le mot de passe doit contenir au moins 6 caractères",
          variant: "destructive"
        });
        return;
      }

      // Créer le compte client
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/client/${token}/identity`
        }
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Compte créé !",
          description: "Vous pouvez maintenant commencer le questionnaire",
        });
        
        // Rediriger vers l'étape 0 (identité)
        navigate(`/client/${token}/identity`);
      }
    } catch (error) {
      console.error('Erreur création compte:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipAuth = () => {
    // Permettre de continuer sans création de compte pour le moment
    navigate(`/client/${token}/identity`);
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Bienvenue dans LegalPulse
          </CardTitle>
          <p className="text-muted-foreground">
            Créez votre compte pour suivre l'avancement de votre dossier et commencer le questionnaire
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre-email@exemple.fr"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                <User className="h-4 w-4 mr-2" />
                {loading ? 'Création...' : 'Créer mon compte'}
              </Button>
              <Button type="button" variant="outline" onClick={handleSkipAuth}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Continuer sans compte
              </Button>
            </div>
          </form>

          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <h4 className="font-medium text-blue-900 mb-2">Pourquoi créer un compte ?</h4>
            <ul className="space-y-1 text-blue-800">
              <li>• Suivre l'avancement de votre dossier en temps réel</li>
              <li>• Reprendre le questionnaire plus tard</li>
              <li>• Recevoir des notifications importantes</li>
              <li>• Communiquer avec votre avocat</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};