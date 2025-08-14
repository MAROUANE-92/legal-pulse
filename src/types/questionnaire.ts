

export interface QuestionnaireAnswer {
  id: string;
  dossierId: string;
  step: 'identity' | 'motifs' | 'questions';
  answers: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityFormData {
  fullName: string;
  email: string;
  phone?: string;
  employerName: string;
  employerSiren: string;
  contractType: 'CDI' | 'CDD' | 'Intérim' | 'Stage' | 'Autre';
  startDate: string;
  endDate?: string;
  salaryBrut: number;
  ccn?: string;
  workingRegime: '35h' | '39h' | 'forfait_jours' | 'forfait_heures';
  forfaitDays?: number;
  contractualHours?: string;
  actualHours: string;
}

export interface MotifsFormData {
  motifs_selected: string[];
  other_description?: string;
}

// Updated to support dynamic questions
export interface QuestionsFormData {
  [questionId: string]: any;
}

export interface UploadFormData {
  submissionId?: string;
  uploadedFiles?: Record<string, string>;
  lastUpdate?: string;
  files: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    validated?: boolean;
  }>;
}

export interface SignatureFormData {
  acceptedTerms: boolean;
  acceptedData: boolean;
  signature: string;
  signatureDate: string;
}

export interface ChecklistItem {
  id: string;
  dossierId: string;
  label: string;
  required: boolean;
  satisfied: boolean;
  generatedBy?: string;
  createdAt: string;
}

export interface StepperContextData {
  currentStep: string;
  formData: {
    // Nouvelles étapes optimisées
    urgency?: any;
    story?: any;
    qualification?: any;
    proof_inventory?: any;
    documents?: any;
    timeline?: any;
    
    // Étapes existantes (conservées pour compatibilité)
    identity?: any;
    company?: any;
    contract?: any;
    remuneration?: any;
    working_time?: any;
    motifs?: MotifsFormData;
    questions?: QuestionsFormData;
    damages?: any;
    upload?: UploadFormData;
    signature?: SignatureFormData;
  };
  goTo: (step: string) => void;
  savePartial: (step: string, data: any) => void;
  isStepValid: (step: string) => boolean;
  submitQuestionnaire: () => Promise<boolean>;
}

export interface CCNOption {
  idcc: string;
  name: string;
}
