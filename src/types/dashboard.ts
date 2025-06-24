
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
}

export interface Barreau {
  id: string;
  name: string;
}

export interface DossiersListParams {
  page?: number;
  size?: number;
  barreau?: string;
  search?: string;
}

export type SortField = 'name' | 'nextDeadline';
export type SortDirection = 'asc' | 'desc';
