
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
}

export interface MotifsFormData {
  selectedMotifs: string[];
  detailAutre?: string;
}

export interface QuestionsFormData {
  heures_supp?: {
    weeklyOvertime: number;
    nightWork: boolean;
    badgeExists: boolean;
  };
  licenciement?: {
    notifDate: string;
    motifLettre: string;
  };
  harcelement?: {
    facts: string;
    witnesses: boolean;
  };
  accident?: {
    accidentDate: string;
    declarationSent: boolean;
  };
}

export interface UploadFormData {
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
    identity?: IdentityFormData;
    motifs?: MotifsFormData;
    questions?: QuestionsFormData;
    upload?: UploadFormData;
    signature?: SignatureFormData;
  };
  goTo: (step: string) => void;
  savePartial: (step: string, data: any) => void;
  isStepValid: (step: string) => boolean;
}

export interface CCNOption {
  idcc: string;
  name: string;
}
