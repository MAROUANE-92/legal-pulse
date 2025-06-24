
// src/lib/overtimeEngine.ts
import { mockBadge } from "@/lib/mockBadge";

export function computeOvertime() {
  const res = mockBadge.weeks.map((w) => {
    const base = 35;
    const worked =
      (parseInt(w.out) - parseInt(w.in)) / 100 - mockBadge.contractualHours.pause;
    const delta = worked - base;
    return { ...w, worked, delta };
  });
  const totalDelta = res.reduce((a, b) => a + b.delta, 0).toFixed(2);
  const montant =
    totalDelta * 0.75 * mockBadge.tauxHorSup25 +
    totalDelta * 0.25 * mockBadge.tauxHorSup50; // 25 % nuit + 50 %
  return { rows: res, totalDelta, montant: montant.toFixed(0) };
}
