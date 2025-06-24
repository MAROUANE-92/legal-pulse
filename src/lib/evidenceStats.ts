
import { motifsDemo } from '@/lib/mockMotifDetails';

export function getEvidenceStats(dossierId: string) {
  // Mock data for demonstration - replace with actual API call later
  const motifKey = 'heures_supp'; // Could be dynamic based on dossier
  const motifData = motifsDemo[motifKey];
  
  if (!motifData) {
    return { valid: 0, required: 0, pct: 0, missing: [] };
  }

  const valid = motifData.valid;
  const required = motifData.required;
  const pct = Math.round((valid / required) * 100);
  
  // Get missing pieces from details
  const missing = motifData.details
    .filter(detail => detail.status === 'missing' || detail.status === 'partial')
    .map(detail => detail.label);

  return { valid, required, pct, missing };
}
