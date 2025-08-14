import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Clock, User, Building, FileText, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { useQuestionnaireSubmission } from '@/hooks/useQuestionnaireSubmission';

interface QuestionnaireSectionProps {
  dossierId: string;
}

export function QuestionnaireSection({ dossierId }: QuestionnaireSectionProps) {
  const { submission, isLoading, organizeAnswersByCategory } = useQuestionnaireSubmission(dossierId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Questionnaire Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!submission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Questionnaire Client
            <Badge variant="outline" className="ml-auto">
              <Clock className="h-3 w-3 mr-1" />
              En attente
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Le client n'a pas encore complété le questionnaire.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const answers = organizeAnswersByCategory;

  // Fonction pour formater les valeurs avec traitement spécial de la timeline
  const formatValue = (value: any, key: string): string => {
    if (value === null || value === undefined) return 'Non renseigné';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    
    // Traitement spécial pour la timeline (événements)
    if (key === 'events' && Array.isArray(value)) {
      return `${value.length} événement(s) dans la chronologie`;
    }
    
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Fonction pour rendre la timeline de manière visuelle
  const renderTimeline = (events: any[]) => {
    if (!Array.isArray(events)) return null;
    
    return (
      <div className="space-y-4 mt-4">
        <h4 className="font-medium text-sm text-muted-foreground mb-3">Chronologie des événements</h4>
        <div className="relative">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-start space-x-3 pb-4">
              {/* Ligne verticale */}
              {index < events.length - 1 && (
                <div className="absolute left-2 top-6 h-full w-0.5 bg-border"></div>
              )}
              
              {/* Point sur la timeline */}
              <div className="relative flex h-4 w-4 flex-none items-center justify-center bg-background">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
              
              {/* Contenu de l'événement */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Fonction pour obtenir les labels lisibles
  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      // Identity
      'full_name': 'Nom complet',
      'email': 'Email',
      'phone': 'Téléphone',
      'address': 'Adresse',
      'birth_date': 'Date de naissance',
      
      // Urgency
      'employment_status': 'Statut d\'emploi',
      'incident_date': 'Date des faits',
      'critical_situation': 'Situation critique',
      'time_sensitivity': 'Urgence',
      
      // Story
      'main_problem': 'Problème principal',
      'problem_start_date': 'Date de début du problème',
      'narrative': 'Récit détaillé',
      'expected_outcome': 'Résultat attendu',
      'witnesses': 'Témoins',
      
      // Company
      'name': 'Nom de l\'entreprise',
      'size': 'Taille',
      'sector': 'Secteur',
      'collective_agreement': 'Convention collective',
      'management_style': 'Style de management',
      
      // Contract
      'position': 'Poste',
      'contract_type': 'Type de contrat',
      'start_date': 'Date de début',
      'salary': 'Salaire',
      'hierarchy_level': 'Niveau hiérarchique',
      
      // Documents
      'available_documents': 'Documents disponibles',
      'missing_documents': 'Documents manquants',
      
      // Timeline
      'key_events': 'Événements clés',
      'event_sequence': 'Chronologie',
      
      // Damages
      'financial': 'Préjudices financiers',
      'moral': 'Préjudice moral',
      'career_impact': 'Impact sur la carrière',
      'health_impact': 'Impact sur la santé'
    };
    
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Configuration des sections avec icônes
  const sectionConfig = {
    identity: { title: 'Identité', icon: User, color: 'text-blue-600' },
    urgency: { title: 'Urgence', icon: AlertTriangle, color: 'text-red-600' },
    story: { title: 'Histoire', icon: FileText, color: 'text-green-600' },
    company: { title: 'Entreprise', icon: Building, color: 'text-purple-600' },
    qualification: { title: 'Qualification', icon: User, color: 'text-orange-600' },
    contract: { title: 'Contrat', icon: FileText, color: 'text-cyan-600' },
    proof_inventory: { title: 'Inventaire des preuves', icon: FileText, color: 'text-gray-600' },
    documents: { title: 'Documents', icon: FileText, color: 'text-indigo-600' },
    timeline: { title: 'Chronologie', icon: Calendar, color: 'text-pink-600' },
    damages: { title: 'Préjudices', icon: DollarSign, color: 'text-emerald-600' }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Questionnaire Client
          <Badge variant="default" className="ml-auto">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complété
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Questionnaire complété le {new Date(submission.submitted_at).toLocaleDateString('fr-FR')}
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {Object.entries(answers).map(([sectionKey, sectionData]) => {
            const config = sectionConfig[sectionKey as keyof typeof sectionConfig];
            if (!config || !sectionData || Object.keys(sectionData).length === 0) return null;
            
            const Icon = config.icon;
            
            return (
              <AccordionItem key={sectionKey} value={sectionKey}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <span className="font-medium">{config.title}</span>
                    <Badge variant="outline" className="ml-2">
                      {Object.keys(sectionData).length} réponse(s)
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {Object.entries(sectionData).map(([key, value]) => (
                      <div key={key}>
                        {/* Traitement spécial pour la timeline */}
                        {key === 'events' && Array.isArray(value) ? (
                          renderTimeline(value)
                        ) : (
                          <div className="flex justify-between items-start border-b pb-2">
                            <span className="text-sm font-medium text-muted-foreground min-w-0 flex-1">
                              {getFieldLabel(key)}
                            </span>
                            <span className="text-sm text-right ml-4 max-w-md">
                              {formatValue(value, key)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        
        {Object.keys(answers).length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            <p>Aucune réponse trouvée dans le questionnaire.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}