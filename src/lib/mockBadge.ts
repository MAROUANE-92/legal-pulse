
// src/lib/mockBadge.ts
export const mockBadge = {
  contractualHours: { from: "09:00", to: "17:00", pause: 1 },   // 35 h
  weeks: [
    { isoWeek: "2025-17", in: "08:47", out: "19:32" }, // +2 h 45
    { isoWeek: "2025-18", in: "08:59", out: "20:15" }, // +3 h 16
    { isoWeek: "2025-19", in: "09:05", out: "18:50" }, // +1 h 45
    { isoWeek: "2025-20", in: "09:02", out: "19:40" }  // +2 h 38
  ],
  tauxHorSup25: 19.23,   // € (horaire contractuel)
  tauxHorSup50: 24.04
};
