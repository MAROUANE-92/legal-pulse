// Types centralisés pour toute l'app
export interface Dossier {
  id: string;
  name: string;
  client: string;
  employeur: string;
  stage: 'Découverte' | 'Rédaction' | 'Dépôt' | 'Audience' | 'Clos';
  nextDeadline: string;
  progressPct: number;
  typeLitige: string;
  ccn?: string;
  montantReclame?: number;
  prochaineAudience?: string;
  token?: string; // Client portal access token
}

export interface Submission {
  id: string;
  token: string;
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  clientEmail?: string;
  answers: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  component: React.ComponentType<any>;
}

export interface Answer {
  id: string;
  submissionId: string;
  questionSlug: string;
  value: any;
  createdAt: string;
}

export interface MagicLink {
  token: string;
  email: string;
  dossierId: string;
  expiresAt: string;
}

// Enums pour consistency
export type DossierStage = 'Découverte' | 'Rédaction' | 'Dépôt' | 'Audience' | 'Clos';
export type UserRole = 'lawyer' | 'client';

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface DashboardMetrics {
  totalDossiers: number;
  dossiersEnCours: number;
  tempsMoyenPreparation: string;
  tempsPourcentageReduction: number;
}