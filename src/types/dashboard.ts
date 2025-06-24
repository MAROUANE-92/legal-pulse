
export interface DashboardSummary {
  countActive: number;
  countPendingPieces: number;
  countUpcoming: number;
  totalClaim: number;
}

export interface Dossier {
  id: string;
  name: string;
  stage: 'Découverte' | 'Rédaction' | 'Dépôt' | 'Audience' | 'Clos';
  nextDeadline: string;
  progressPct: number;
  typeLitige?: string;
  client?: string;
  employeur?: string;
  ccn?: string;
  montantReclame?: number;
  prochaineAudience?: string;
}

export type SortField = 'name' | 'nextDeadline';
export type SortDirection = 'asc' | 'desc';
