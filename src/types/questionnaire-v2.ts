// Types pour le nouveau questionnaire simplifié

export interface QuestionnaireFormData {
  // Étape 0 - Coordonnées personnelles
  fullName?: string;
  birthDate?: string;
  address?: string;
  phone?: string;
  email?: string;
  familyStatus?: string;
  children?: number;

  // Étape 1 - Évaluation de l'urgence
  endDate?: string;
  currentSituation?: string;
  criticalSituation?: string[];
  previousActions?: string[];

  // Étape 2 - Récit des faits
  detailedSummary?: string;
  mainProblem?: string;
  procedureObjective?: string;
  startDate?: string;

  // Étape 3 - Informations sur l'entreprise
  companyName?: string;
  siret?: string;
  workforce?: string;
  legalForm?: string;
  collectiveAgreement?: string;
  sector?: string;
  companyAddress?: string;
  csePresent?: string;
  unionPresence?: string;

  // Étape 4 - Analyse approfondie
  analysisData?: string;
  // Champs conditionnels pour heures non payées
  evidenceAvailable?: string[];
  typicalWeek?: string;
  weekendWork?: string;
  // Champs conditionnels pour harcèlement
  harassmentType?: string;
  harassmentFrequency?: string;
  harassmentAuthor?: string;
  witnesses?: string;
  healthImpact?: string[];
  // Champs conditionnels pour licenciement
  dismissalDate?: string;
  dismissalReason?: string;
  dismissalType?: string;
  dismissalDates?: string;
  contestationReasons?: string[];

  // Étape 5 - Situation contractuelle
  contractType?: string;
  contractStartDate?: string;
  position?: string;
  classification?: string;
  grossSalary?: number;
  benefits?: string;
  contractEndDate?: string;
  documentsReceived?: string[];

  // Étape 6 - Inventaire des pièces
  contractualDocs?: string[];
  disputeDocs?: string[];
  evidenceDocs?: string[];
  contextualDocs?: string[];

  // Étape 7 - Téléversement
  uploadedFiles?: File[];

  // Étape 8 - Chronologie
  timelineEvents?: string;

  // Étape 9 - Évaluation des préjudices
  unpaidOvertime?: number;
  unpaidLeave?: number;
  unpaidBonuses?: number;
  sickLeaveDays?: number;
  psychologicalSupport?: string;
  burnoutDiagnosis?: string;
  anxietyLevel?: number;
  familyImpact?: number;
  confidenceLoss?: number;

  // Étape 10 - Situation procédurale
  lawyerAlreadySeized?: string;
  courtAlreadySeized?: string;
  seizureDates?: string;
  hearingScheduled?: string;
  hearingDates?: string;

  // Étape 11 - Synthèse
  autoSummary?: string;
}

export interface StepperContextData {
  currentStep: string;
  formData: QuestionnaireFormData;
  goTo: (step: string) => void;
  goNext: () => void;
  goPrevious: () => void;
  savePartial: (step: string, data: Partial<QuestionnaireFormData>) => void;
  isStepValid: (step: string) => boolean;
  submitQuestionnaire: () => Promise<boolean>;
  totalSteps: number;
  currentStepIndex: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}