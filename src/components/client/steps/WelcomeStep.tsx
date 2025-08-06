import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, CheckCircle, FileText, Scale, Shield, Clock, Users, Gavel, FileCheck } from 'lucide-react';
import { useStepper } from '../StepperProvider';

export function WelcomeStep() {
  const { goTo, formData } = useStepper();
  const [activeTimelineStep, setActiveTimelineStep] = useState<number | null>(null);

  // Get firstName from formData if available, otherwise use default
  const firstName = formData.identity?.full_name?.split(' ')[0] || 'cher utilisateur';

  const procedureSteps = [
    {
      number: 1,
      title: "Saisine & conciliation",
      delai: "2 – 3 mois",
      description: "Dépôt RPVA, audience de conciliation (tentative d'accord).",
      icon: FileText
    },
    {
      number: 2,
      title: "Mise en état", 
      delai: "4 – 8 mois",
      description: "Échanges de conclusions et pièces entre parties.",
      icon: Users
    },
    {
      number: 3,
      title: "Audience de jugement",
      delai: "10 – 14 mois", 
      description: "Plaidoiries devant le Conseil de prud'hommes.",
      icon: Gavel
    },
    {
      number: 4,
      title: "Délibéré & notification",
      delai: "1 – 3 mois",
      description: "Réception du jugement. Voies de recours possibles.",
      icon: FileCheck
    }
  ];

  const bonnesPratiques = [
    "Centralisez vos preuves : badgeages, e-mails tardifs, WhatsApp, journaux d'appel…",
    "Respectez la confidentialité : ne partagez vos pièces qu'au travers de LegalPulse.",
    "Restez factuel : évitez tout message agressif à votre ex-employeur.",
    "Conservez les originaux : le greffe peut les demander."
  ];

  const legalPulseHelp = [
    {
      icon: "📂",
      title: "Dossier intelligent",
      description: "Questions qui s'adaptent à votre cas."
    },
    {
      icon: "⚖️", 
      title: "Algorithme prud'homal",
      description: "Calcule heures sup & indemnités barème Macron."
    },
    {
      icon: "🔒",
      title: "Sécurité avocat", 
      description: "Stockage chiffré, accès limité à votre conseil."
    }
  ];

  const timelineDetails = {
    1: "Préparez : contrat de travail, fiches de paie, preuves du litige, correspondances avec l'employeur.",
    2: "Rassemblez : témoignages, expertises, pièces complémentaires demandées par l'adversaire.",
    3: "Finalisez : dossier complet, arguments juridiques, calculs d'indemnités actualisés.",
    4: "Attendez : notification du jugement, évaluation des voies de recours si nécessaire."
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-gradient-to-br from-background to-muted/20 rounded-lg p-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Bienvenue, {firstName} – commençons votre parcours prud&apos;homal
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Vous trouverez ici le déroulé complet de la procédure, les conseils essentiels 
          et le point de départ pour constituer votre dossier.
        </p>
        <Button 
          size="lg" 
          className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
          onClick={() => goTo('identity')}
        >
          Démarrer mon questionnaire
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Aperçu de la procédure prud'homale */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-2">
          Aperçu de la procédure prud&apos;homale
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          *Délais observés à Paris 2024 – indicatifs.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {procedureSteps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <Badge variant="secondary" className="mb-2">
                  Étape {step.number}
                </Badge>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <div className="text-sm font-medium text-primary">
                  {step.delai}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bonnes pratiques */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Bonnes pratiques</h2>
        <div className="space-y-4">
          {bonnesPratiques.map((pratique, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground leading-relaxed">{pratique}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment LegalPulse vous aide */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">
          Comment LegalPulse vous aide
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {legalPulseHelp.map((item, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline interactive */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">
          Timeline de votre procédure
        </h2>
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-muted hidden md:block">
            <div className="h-full bg-primary w-0 transition-all duration-500" />
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center relative">
              <div className="relative z-10">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold">VOUS</span>
                </div>
                <Badge className="mb-3 bg-green-500">
                  Vous êtes ici
                </Badge>
                <h3 className="text-lg font-bold mb-2">Préparation</h3>
                <p className="text-muted-foreground text-sm">Constitution du dossier</p>
              </div>
            </div>

            {procedureSteps.map((step, index) => (
              <div 
                key={index} 
                className="text-center relative cursor-pointer"
                onClick={() => setActiveTimelineStep(activeTimelineStep === index ? null : index)}
              >
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:bg-primary/10 transition-colors">
                    <step.icon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <Badge variant="outline" className="mb-3">
                    {step.delai}
                  </Badge>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  {activeTimelineStep === index && (
                    <Card className="mt-4 text-left">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">
                          {timelineDetails[step.number as keyof typeof timelineDetails]}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ express */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">FAQ express</h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>Puis-je interrompre et reprendre ?</AccordionTrigger>
            <AccordionContent>
              Oui, le questionnaire se sauvegarde automatiquement.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Mes données sont-elles partagées ?</AccordionTrigger>
            <AccordionContent>
              Uniquement avec l&apos;avocat chargé de votre dossier.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA final */}
      <section className="text-center mt-16">
        <Button 
          size="lg" 
          className="text-lg px-12 py-6 bg-primary hover:bg-primary/90"
          onClick={() => goTo('identity')}
        >
          Commencer mon questionnaire
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  );
}