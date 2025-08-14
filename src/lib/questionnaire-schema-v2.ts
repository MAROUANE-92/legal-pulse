// Nouveau schéma de questionnaire simplifié en 12 étapes
export interface QuestionField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  multiple?: boolean;
  minLength?: number;
  validation?: (value: any) => boolean;
}

export interface QuestionnaireStep {
  id: string;
  title: string;
  description: string;
  fields: QuestionField[];
}

export const QUESTIONNAIRE_STEPS: QuestionnaireStep[] = [
  {
    id: 'step0-identity',
    title: 'Coordonnées personnelles',
    description: 'Identification du demandeur, obligatoire pour constituer le dossier.',
    fields: [
      { id: 'fullName', label: 'Nom et prénom', type: 'text', required: true },
      { id: 'birthDate', label: 'Date de naissance', type: 'date', required: true },
      { id: 'address', label: 'Adresse complète', type: 'textarea', required: true },
      { id: 'phone', label: 'Téléphone', type: 'tel', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { 
        id: 'familyStatus', 
        label: 'Situation familiale', 
        type: 'select', 
        required: true,
        options: [
          { value: 'single', label: 'Célibataire' },
          { value: 'married', label: 'Marié(e)/Pacsé(e)' },
          { value: 'separated', label: 'Séparé(e)' }
        ]
      },
      { id: 'children', label: 'Nombre d\'enfants à charge', type: 'number' }
    ]
  },
  {
    id: 'step1-urgency',
    title: 'Évaluation de l\'urgence',
    description: 'Permet de vérifier la recevabilité et le risque d\'action immédiate.',
    fields: [
      { id: 'endDate', label: 'Date de fin des faits', type: 'date', required: true },
      {
        id: 'currentSituation',
        label: 'Situation actuelle',
        type: 'radio',
        required: true,
        options: [
          { value: 'still_employed', label: 'Toujours salarié(e)' },
          { value: 'contract_ended', label: 'Contrat terminé (licenciement, rupture conventionnelle, CDD terminé)' },
          { value: 'resignation', label: 'Démission' },
          { value: 'sick_leave', label: 'Arrêt maladie' }
        ]
      },
      {
        id: 'criticalSituation',
        label: 'Situation critique',
        type: 'checkbox',
        multiple: true,
        options: [
          { value: 'harassment', label: 'Harcèlement en cours' },
          { value: 'dismissal_threat', label: 'Menace de licenciement imminent' },
          { value: 'burnout', label: 'Burn-out ou détresse psychologique' },
          { value: 'none', label: 'Aucune situation critique' }
        ]
      },
      {
        id: 'previousActions',
        label: 'Démarches déjà entreprises',
        type: 'checkbox',
        multiple: true,
        options: [
          { value: 'manager_discussion', label: 'Discussion avec manager' },
          { value: 'hr_letter', label: 'Courrier au service RH' },
          { value: 'union_contact', label: 'Contact avec syndicat / CSE' },
          { value: 'labor_inspection', label: 'Inspection du travail' },
          { value: 'occupational_doctor', label: 'Médecin du travail' },
          { value: 'none', label: 'Aucune démarche' }
        ]
      }
    ]
  },
  {
    id: 'step2-facts',
    title: 'Récit des faits',
    description: 'Le cœur factuel du dossier.',
    fields: [
      { 
        id: 'detailedSummary', 
        label: 'Résumé détaillé', 
        type: 'textarea', 
        required: true, 
        minLength: 200,
        placeholder: 'Inclure les dates et personnes impliquées (minimum 200 caractères)'
      },
      {
        id: 'mainProblem',
        label: 'Problème principal',
        type: 'radio',
        required: true,
        options: [
          { value: 'unpaid_hours', label: 'Heures supplémentaires / primes / congés non payés' },
          { value: 'harassment', label: 'Harcèlement ou discrimination' },
          { value: 'abusive_dismissal', label: 'Licenciement abusif' },
          { value: 'working_conditions', label: 'Conditions de travail dangereuses ou illégales' },
          { value: 'other', label: 'Autre' }
        ]
      },
      {
        id: 'procedureObjective',
        label: 'Objectif de la procédure',
        type: 'radio',
        required: true,
        options: [
          { value: 'obtain_amounts', label: 'Obtenir des sommes dues' },
          { value: 'compensation', label: 'Être indemnisé(e)' },
          { value: 'reinstatement', label: 'Réintégration au poste' },
          { value: 'employer_condemnation', label: 'Condamnation de l\'employeur' },
          { value: 'amicable_departure', label: 'Négociation d\'un départ amiable' }
        ]
      },
      { id: 'startDate', label: 'Date de début des difficultés', type: 'date', required: true }
    ]
  },
  {
    id: 'step3-company',
    title: 'Informations sur l\'entreprise',
    description: 'Pour identifier la partie adverse et sa structure.',
    fields: [
      { id: 'companyName', label: 'Nom de l\'entreprise', type: 'text', required: true },
      { id: 'siret', label: 'SIRET (14 chiffres)', type: 'text', required: true },
      {
        id: 'workforce',
        label: 'Effectif',
        type: 'select',
        required: true,
        options: [
          { value: 'less_11', label: '< 11 salariés' },
          { value: '11_50', label: '11-50 salariés' },
          { value: '50_250', label: '50-250 salariés' },
          { value: 'more_250', label: '> 250 salariés' }
        ]
      },
      {
        id: 'legalForm',
        label: 'Forme juridique',
        type: 'select',
        required: true,
        options: [
          { value: 'sarl', label: 'SARL' },
          { value: 'sas', label: 'SAS' },
          { value: 'sa', label: 'SA' },
          { value: 'eurl', label: 'EURL' },
          { value: 'snc', label: 'SNC' },
          { value: 'other', label: 'Autre' }
        ]
      },
      { id: 'collectiveAgreement', label: 'Convention collective', type: 'text', required: true },
      { id: 'sector', label: 'Secteur d\'activité', type: 'text' },
      { id: 'companyAddress', label: 'Adresse complète', type: 'textarea', required: true },
      {
        id: 'csePresent',
        label: 'CSE présent ?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Oui' },
          { value: 'no', label: 'Non' },
          { value: 'unknown', label: 'Je ne sais pas' }
        ]
      },
      {
        id: 'unionPresence',
        label: 'Présence syndicale ?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Oui' },
          { value: 'no', label: 'Non' },
          { value: 'unknown', label: 'Je ne sais pas' }
        ]
      }
    ]
  },
  {
    id: 'step4-analysis',
    title: 'Analyse approfondie',
    description: 'Questions adaptées selon le litige principal.',
    fields: [
      // Champs conditionnels selon mainProblem - sera géré dans le composant
      { id: 'analysisData', label: 'Données d\'analyse', type: 'textarea' }
    ]
  },
  {
    id: 'step5-contract',
    title: 'Situation contractuelle',
    description: 'Pour déterminer vos droits et indemnités.',
    fields: [
      {
        id: 'contractType',
        label: 'Type de contrat',
        type: 'select',
        required: true,
        options: [
          { value: 'cdi', label: 'CDI' },
          { value: 'cdd', label: 'CDD' },
          { value: 'interim', label: 'Intérim' },
          { value: 'internship', label: 'Stage' },
          { value: 'apprenticeship', label: 'Alternance' }
        ]
      },
      { id: 'contractStartDate', label: 'Date de début', type: 'date', required: true },
      { id: 'position', label: 'Poste occupé', type: 'text', required: true },
      { id: 'classification', label: 'Classification (ex. Cadre, Niveau 3.2)', type: 'text' },
      { id: 'grossSalary', label: 'Salaire mensuel brut', type: 'number', required: true },
      { id: 'benefits', label: 'Avantages et primes', type: 'textarea', placeholder: 'Variable, véhicule, tickets resto, logement...' },
      { id: 'contractEndDate', label: 'Date de fin (si plus en poste)', type: 'date' },
      {
        id: 'documentsReceived',
        label: 'Documents reçus (si plus en poste)',
        type: 'checkbox',
        multiple: true,
        options: [
          { value: 'work_certificate', label: 'Certificat de travail' },
          { value: 'settlement', label: 'Solde de tout compte' },
          { value: 'pole_emploi', label: 'Attestation Pôle emploi' }
        ]
      }
    ]
  },
  {
    id: 'step6-documents',
    title: 'Inventaire des pièces',
    description: 'Base du futur bordereau de communication de pièces.',
    fields: [
      {
        id: 'contractualDocs',
        label: 'Documents contractuels',
        type: 'checkbox',
        multiple: true,
        options: [
          { value: 'signed_contract', label: 'Contrat de travail signé' },
          { value: 'amendments', label: 'Avenants' },
          { value: 'payslips', label: 'Fiches de paie (12 derniers mois)' },
          { value: 'work_certificate', label: 'Certificat de travail' },
          { value: 'pole_emploi_cert', label: 'Attestation Pôle emploi' },
          { value: 'settlement_account', label: 'Solde de tout compte' }
        ]
      },
      {
        id: 'disputeDocs',
        label: 'Documents liés au litige',
        type: 'checkbox',
        multiple: true,
        options: [
          { value: 'warning_letters', label: 'Courrier(s) d\'avertissement' },
          { value: 'interview_summons', label: 'Convocation(s) à entretien' },
          { value: 'dismissal_letter', label: 'Lettre de licenciement' },
          { value: 'hr_exchanges', label: 'Échanges avec RH' },
          { value: 'cse_reports', label: 'Compte-rendus CSE' }
        ]
      },
      {
        id: 'evidenceDocs',
        label: 'Preuves et témoignages',
        type: 'checkbox',
        multiple: true,
        options: [
          { value: 'professional_emails', label: 'Emails professionnels' },
          { value: 'sms_whatsapp', label: 'SMS / WhatsApp' },
          { value: 'audio_recordings', label: 'Enregistrements audio' },
          { value: 'photos', label: 'Photos' },
          { value: 'colleague_statements', label: 'Attestations collègues' },
          { value: 'medical_certificates', label: 'Certificats médicaux' },
          { value: 'police_report', label: 'Main courante / plainte' }
        ]
      },
      {
        id: 'contextualDocs',
        label: 'Documents contextuels',
        type: 'checkbox',
        multiple: true,
        options: [
          { value: 'collective_agreement', label: 'Convention collective' },
          { value: 'internal_rules', label: 'Règlement intérieur' },
          { value: 'org_chart', label: 'Organigramme' },
          { value: 'job_description', label: 'Fiche de poste' }
        ]
      }
    ]
  },
  {
    id: 'step7-upload',
    title: 'Téléversement des documents',
    description: 'Interface regroupant tous les fichiers déjà cochés à l\'étape 6.',
    fields: [
      { id: 'uploadedFiles', label: 'Fichiers téléversés', type: 'file', multiple: true }
    ]
  },
  {
    id: 'step8-timeline',
    title: 'Chronologie des faits',
    description: 'Construction de la ligne du temps.',
    fields: [
      { id: 'timelineEvents', label: 'Événements chronologiques', type: 'textarea', placeholder: 'Minimum 5 événements avec dates, titres et descriptions' }
    ]
  },
  {
    id: 'step9-damages',
    title: 'Évaluation des préjudices',
    description: 'Pour chiffrer la demande.',
    fields: [
      { id: 'unpaidOvertime', label: 'Heures supplémentaires non payées (montant estimé)', type: 'number' },
      { id: 'unpaidLeave', label: 'Congés payés non pris (jours)', type: 'number' },
      { id: 'unpaidBonuses', label: 'Primes non versées (montant en €)', type: 'number' },
      { id: 'sickLeaveDays', label: 'Arrêts maladie liés au travail (jours)', type: 'number' },
      {
        id: 'psychologicalSupport',
        label: 'Suivi psychologique ?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Oui' },
          { value: 'no', label: 'Non' }
        ]
      },
      {
        id: 'burnoutDiagnosis',
        label: 'Burn-out diagnostiqué ?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Oui' },
          { value: 'no', label: 'Non' }
        ]
      },
      { id: 'anxietyLevel', label: 'Niveau d\'anxiété (1-10)', type: 'number', placeholder: '1 à 10' },
      { id: 'familyImpact', label: 'Impact sur vie familiale (1-10)', type: 'number', placeholder: '1 à 10' },
      { id: 'confidenceLoss', label: 'Perte de confiance en soi (1-10)', type: 'number', placeholder: '1 à 10' }
    ]
  },
  {
    id: 'step10-procedure',
    title: 'Situation procédurale',
    description: 'Pour savoir où en est le dossier.',
    fields: [
      {
        id: 'lawyerAlreadySeized',
        label: 'Avocat déjà saisi ?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Oui' },
          { value: 'no', label: 'Non' }
        ]
      },
      {
        id: 'courtAlreadySeized',
        label: 'Conseil de prud\'hommes ou médiateur déjà saisi ?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Oui' },
          { value: 'no', label: 'Non' }
        ]
      },
      { id: 'seizureDates', label: 'Date(s) de saisine (si oui)', type: 'text' },
      {
        id: 'hearingScheduled',
        label: 'Audience programmée ?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Oui' },
          { value: 'no', label: 'Non' }
        ]
      },
      { id: 'hearingDates', label: 'Date(s) d\'audience (si oui)', type: 'text' }
    ]
  },
  {
    id: 'step11-summary',
    title: 'Synthèse',
    description: 'Générée automatiquement par LegalPulse.',
    fields: [
      { id: 'autoSummary', label: 'Synthèse automatique', type: 'textarea' }
    ]
  }
];

export const getStepById = (stepId: string): QuestionnaireStep | undefined => {
  return QUESTIONNAIRE_STEPS.find(step => step.id === stepId);
};

export const getStepIndex = (stepId: string): number => {
  return QUESTIONNAIRE_STEPS.findIndex(step => step.id === stepId);
};

export const getTotalSteps = (): number => {
  return QUESTIONNAIRE_STEPS.length;
};

export const getNextStep = (currentStepId: string): string | null => {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex === -1 || currentIndex >= QUESTIONNAIRE_STEPS.length - 1) {
    return null;
  }
  return QUESTIONNAIRE_STEPS[currentIndex + 1].id;
};

export const getPreviousStep = (currentStepId: string): string | null => {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex <= 0) {
    return null;
  }
  return QUESTIONNAIRE_STEPS[currentIndex - 1].id;
};