
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
  clientName?: string;
  clientRole?: string;
  salaire?: number;
  employerName?: string;
  siren?: string;
  opponentLawyer?: string;
  opponentBar?: string;
  typeContrat?: string;
  dateDebut?: string;
  dateFin?: string;
  clauseHoraire?: string;
  barreau?: {
    name: string;
  };
  token?: string; // Client portal access token
}

export interface PieceRaw {
  id: string;
  dossierId: string;
  originalName: string;
  mimeType: string;
  size: number;
  sha256: string;
  uploadUserId: string;
  status: 'uploaded' | 'ingested' | 'parsed';
  createdAt: string;
}

export interface Piece {
  id: string;
  nom: string;
  typeIA: string;
  typeFinal?: string;
  pages: number;
  status: 'Pending' | 'Processing' | 'Validated' | 'Error';
  mime?: string;
  keyEvidence?: boolean;
  dossierId: string;
  pieceRawId?: string;
  confidence?: number;
  meta?: any;
}

export interface ChecklistItem {
  id: string;
  dossierId: string;
  label: string;
  isRequired: boolean;
  isSatisfied: boolean;
  fileId?: string;
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
  keyEvidence?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  attachments?: string[];
}

export interface Task {
  id: string;
  title: string;
  assigneeId?: string;
  dueAt?: string;
  status: 'Todo' | 'Doing' | 'Done';
  dossierId: string;
}

export interface AuditEntry {
  id: string;
  dossierId: string;
  userId: string;
  action: string;
  payload: any;
  createdAt: string;
}

export interface Simulation {
  id: string;
  dossierId: string;
  montant: number;
  motifs: string[];
  roi: number;
  createdAt: string;
}

export interface RisqueChance {
  successProbability: number;
  deltaTransaction: number;
}

export interface Citation {
  article: string;
  page: number;
  context: string;
}

export interface Jurisprudence {
  quote: string;
  ref: string;
}

export type UserRole = 'lawyer' | 'paralegal' | 'client' | 'confrere_free';
