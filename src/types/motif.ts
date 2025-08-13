// Types pour les motifs - remplace les anciens mock types
export interface MotifDetail {
  motif: string;
  baseLegale: string;
  valid: number;
  required: number;
  statut: 'good' | 'progress' | 'danger';
  details: MotifPieceDetail[];
}

export interface MotifPieceDetail {
  label: string;
  min: number;
  ok: number;
  status: 'complete' | 'partial' | 'missing';
}