
export interface Dossier {
  id: string;
  name: string;
  stage: 'Découverte' | 'Rédaction' | 'Dépôt' | 'Audience' | 'Clos';
  nextDeadline: string;
  progressPct: number;
  client?: string;
  employeur?: string;
  ccn?: string;
  montantReclame?: number;
  prochaineAudience?: string;
}

export interface Partie {
  id: string;
  nom: string;
  type: 'client' | 'employeur' | 'ccn';
  details: string;
}

export interface Motif {
  id: string;
  motif: string;
  montant: number;
  statut: 'En cours' | 'Validé' | 'Rejeté';
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'overtimeNight' | 'overtimeWE' | 'toxic' | 'docEvent';
  channel?: string;
  part?: string;
  tag?: string;
}

export interface Piece {
  id: string;
  nom: string;
  typeIA: string;
  typeFinal?: string;
  pages: number;
  status: 'Pending' | 'Processing' | 'Validated' | 'Error';
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  attachments?: string[];
}

export type UserRole = 'lawyer' | 'paralegal' | 'client' | 'confrere_free';
