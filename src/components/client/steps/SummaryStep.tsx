import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';

export function SummaryStep() {
  const { formData, goTo } = useStepper();

  // Score basique du dossier (on affinera plus tard)
  const calculateDossierScore = () => {
    let score = 0;
    
    // Points pour les preuves disponibles
    if (formData.working_time?.evidence_available?.length > 0) score += 20;
    if (formData.working_time?.evidence_available?.includes('Badges/pointeuse')) score += 15;
    if (formData.working_time?.evidence_available?.includes('Emails tardifs')) score += 10;
    
    // Points pour les préjudices documentés
    if (formData.damages?.unpaid_overtime_hours && parseInt(formData.damages.unpaid_overtime_hours) > 0) score += 25;
    if (formData.damages?.psychological_support === 'Yes') score += 15;
    if (formData.damages?.burnout_diagnosed === 'Yes') score += 20;
    
    // Points pour la durée du contrat
    if (formData.contract?.contract_type === 'CDI') score += 10;
    
    return Math.min(score, 100);
  };

  const dossierScore = calculateDossierScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Synthèse de votre dossier</CardTitle>
          <CardDescription>
            Récapitulatif complet de vos informations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Score du dossier */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Force estimée du dossier</h3>
            <div className="flex items-center justify-center space-x-3">
              <div className={`w-16 h-16 rounded-full ${getScoreColor(dossierScore)} flex items-center justify-center text-white font-bold text-xl`}>
                {dossierScore}%
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {getScoreLabel(dossierScore)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Informations client */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Vos informations</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nom :</span> {formData.identity?.full_name || '-'}
              </div>
              <div>
                <span className="font-medium">Email :</span> {formData.identity?.email_personal || '-'}
              </div>
              <div>
                <span className="font-medium">Téléphone :</span> {formData.identity?.phone_personal || '-'}
              </div>
              <div>
                <span className="font-medium">Situation :</span> {formData.identity?.marital_status || '-'}
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations entreprise */}
          {formData.company && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Votre entreprise</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Nom :</span> {formData.company.company_name || '-'}
                  </div>
                  <div>
                    <span className="font-medium">SIRET :</span> {formData.company.siret || '-'}
                  </div>
                  <div>
                    <span className="font-medium">Effectif :</span> {formData.company.employee_count || '-'}
                  </div>
                  <div>
                    <span className="font-medium">Convention :</span> {formData.company.collective_agreement || '-'}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Contrat */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Votre contrat</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type :</span> {formData.contract?.contract_type || '-'}
              </div>
              <div>
                <span className="font-medium">Poste :</span> {formData.contract?.position_title || '-'}
              </div>
              <div>
                <span className="font-medium">Début :</span> {formData.contract?.contract_start || '-'}
              </div>
              <div>
                <span className="font-medium">Statut :</span> {formData.contract?.cadre_status || '-'}
              </div>
            </div>
          </div>

          <Separator />

          {/* Motifs sélectionnés */}
          {formData.motifs?.motifs_selected && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Motifs de votre demande</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.motifs.motifs_selected.map((motif: string) => (
                    <Badge key={motif} variant="secondary">
                      {motif.replace('_', ' ').toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Estimation préjudices */}
          {formData.damages && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Préjudices estimés</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Heures sup non payées :</span> {formData.damages.unpaid_overtime_hours || '0'}h
                </div>
                <div>
                  <span className="font-medium">Congés perdus :</span> {formData.damages.lost_vacation_days || '0'} jours
                </div>
                <div>
                  <span className="font-medium">Primes non versées :</span> {formData.damages.unpaid_bonuses || '0'}€
                </div>
                <div>
                  <span className="font-medium">Arrêts maladie :</span> {formData.damages.sick_leave_days || '0'} jours
                </div>
              </div>
              
              {/* Impact moral */}
              <div className="mt-4">
                <span className="font-medium">Impact personnel :</span>
                <div className="flex space-x-4 mt-2">
                  <Badge variant="outline">Anxiété: {formData.damages.anxiety_level || 5}/10</Badge>
                  <Badge variant="outline">Impact famille: {formData.damages.family_impact_level || 5}/10</Badge>
                  <Badge variant="outline">Confiance: {formData.damages.confidence_loss_level || 5}/10</Badge>
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Cette synthèse servira de base pour constituer votre dossier. L'avocat pourra affiner l'estimation des préjudices lors de l'analyse détaillée.
            </p>
          </div>

          <StepNavigation 
            onNext={() => goTo('signature')}
            onBack={() => goTo('chronologie')}
            nextLabel="Finaliser le questionnaire"
          />
        </CardContent>
      </Card>
    </div>
  );
}