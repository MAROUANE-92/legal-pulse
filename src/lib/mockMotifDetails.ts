
export interface MotifPieceDetail {
  label: string;
  min: number;
  ok: number;
  status: 'complete' | 'partial' | 'missing';
}

export interface MotifDetail {
  motif: string;
  baseLegale: string;
  required: number;
  valid: number;
  statut: 'good' | 'progress' | 'danger';
  details: MotifPieceDetail[];
}

export const motifsDemo: Record<string, MotifDetail> = {
  heures_supp: {
    motif: 'Heures supplémentaires',
    baseLegale: 'Art. L3121-28 C.trav',
    required: 4,
    valid: 3,
    statut: 'progress',
    details: [
      { label: 'Contrat CDI signé', min: 1, ok: 1, status: 'complete' },
      { label: 'Badge logs CSV', min: 1, ok: 1, status: 'complete' },
      { label: 'Bulletins de paie (≥3)', min: 3, ok: 1, status: 'partial' },
      { label: 'E-mails nocturnes', min: 1, ok: 0, status: 'missing' }
    ]
  },
  licenciement: {
    motif: 'Licenciement sans cause réelle',
    baseLegale: 'Art. L1235-1 C.trav',
    required: 3,
    valid: 3,
    statut: 'good',
    details: [
      { label: 'Lettre de licenciement', min: 1, ok: 1, status: 'complete' },
      { label: 'Accusé réception LRAR', min: 1, ok: 1, status: 'complete' },
      { label: 'Convocation entretien', min: 1, ok: 1, status: 'complete' }
    ]
  },
  indemnite_preavis: {
    motif: 'Indemnité préavis',
    baseLegale: 'Art. L1234-1 C.trav',
    required: 2,
    valid: 2,
    statut: 'good',
    details: [
      { label: 'Contrat de travail', min: 1, ok: 1, status: 'complete' },
      { label: 'Lettre de licenciement', min: 1, ok: 1, status: 'complete' }
    ]
  }
};
