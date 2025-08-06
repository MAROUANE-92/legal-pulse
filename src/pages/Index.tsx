import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Shield, FileText, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleStartDossier = () => {
    navigate('/client/demo/welcome');
  };

  const features = [
    {
      icon: "🧩",
      title: "Formulaire intelligent",
      description: "Les questions s'adaptent à votre situation : zéro paperasse inutile"
    },
    {
      icon: "⚙️", 
      title: "Analyse express des preuves",
      description: "Badgeages, mails, WhatsApp… ingérés et horodatés en quelques sec."
    },
    {
      icon: "🔒",
      title: "Sécurité niveau avocat", 
      description: "Chiffrement AES-256, stockage UE, accès limité à votre conseil"
    },
    {
      icon: "👩‍⚖️",
      title: "Experts à portée de clic",
      description: "Un avocat partenaire vérifie votre dossier avant dépôt"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Répondez au wizard",
      description: "≈ 15 min",
      icon: FileText
    },
    {
      number: 2, 
      title: "Déposez vos documents",
      description: "drag-and-drop sécurisé",
      icon: CheckCircle
    },
    {
      number: 3,
      title: "Recevez un récapitulatif clair", 
      description: "pièces, chronologie, indemnités",
      icon: Clock
    },
    {
      number: 4,
      title: "Votre avocat dépose au greffe",
      description: "via RPVA",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Votre affaire prud'homale, prête en 15 minutes
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Centralisez vos pièces, calculez vos heures sup et générez un dossier complet — 
                100 % sécurisé, 100 % en ligne.
              </p>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                onClick={handleStartDossier}
              >
                Commencer mon dossier
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 border">
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <div className="h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">Interface LegalPulse</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi LegalPulse Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
            Pourquoi LegalPulse ?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <step.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <Badge variant="secondary" className="mb-3">
                    Étape {step.number}
                  </Badge>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 text-center">
            <div>
              <div className="text-5xl lg:text-6xl font-bold text-primary mb-4">
                ⏱️ 40h
              </div>
              <p className="text-xl text-muted-foreground">
                d'administratif économisées (moyenne)
              </p>
            </div>
            <div>
              <div className="text-5xl lg:text-6xl font-bold text-primary mb-4">
                📄 &lt;1%
              </div>
              <p className="text-xl text-muted-foreground">
                de pièces rejetées par le greffe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-24 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Prêt·e à démarrer ?
          </h2>
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              onClick={handleStartDossier}
            >
              Commencer mon dossier
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div>
              <Button variant="link" className="text-primary">
                Je veux en savoir plus ›
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              RGPD & sécurité
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              FAQ
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Assistance chat 9h-19h
            </a>
            <span>© LegalPulse 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;