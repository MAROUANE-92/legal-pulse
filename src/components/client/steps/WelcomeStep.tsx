import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, Users, Clock } from 'lucide-react';
import { useStepper } from '../StepperProvider';

export function WelcomeStep() {
  const { goTo } = useStepper();

  const features = [
    {
      icon: FileText,
      title: "Formulaire guidé",
      description: "Répondez aux questions étape par étape pour constituer votre dossier"
    },
    {
      icon: Shield,
      title: "Données sécurisées",
      description: "Vos informations sont protégées et confidentielles"
    },
    {
      icon: Users,
      title: "Accompagnement expert",
      description: "Nos avocats analysent votre situation"
    },
    {
      icon: Clock,
      title: "Gain de temps",
      description: "Préparez votre dossier en quelques minutes"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">
          Bienvenue sur LegalPulse
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Constituez votre dossier prud'homal en quelques étapes simples. 
          Nos experts vous accompagnent pour défendre vos droits.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-muted">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Prêt à commencer ?</CardTitle>
          <CardDescription className="text-center text-base">
            Le questionnaire prend environ 10-15 minutes à remplir.
            Vous pouvez le sauvegarder et y revenir à tout moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            size="lg" 
            onClick={() => goTo('identity')}
            className="px-8"
          >
            Commencer le questionnaire
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}