
export const overtimeTrim = {
  contractHours: { from: "09:00", to: "17:00", pause: 1 },
  rows: [
    // Semaine 1 (5-11 jan 2025)
    { date: "2025-01-05", in: "08:48", out: "19:54", sources: ["badge", "email"], delta: 2.60 },
    { date: "2025-01-06", in: "09:12", out: "18:45", sources: ["badge"], delta: 1.55 },
    { date: "2025-01-07", in: "08:35", out: "20:10", sources: ["badge", "whatsapp"], delta: 3.58 },
    { date: "2025-01-08", in: "09:05", out: "19:20", sources: ["email"], delta: 2.25 },
    { date: "2025-01-09", in: "08:50", out: "18:30", sources: ["badge"], delta: 1.67 },
    
    // Semaine 2 (12-18 jan 2025)
    { date: "2025-01-12", in: "08:42", out: "19:30", sources: ["badge", "email"], delta: 2.80 },
    { date: "2025-01-13", in: "09:08", out: "18:55", sources: ["badge"], delta: 1.78 },
    { date: "2025-01-14", in: "08:55", out: "20:05", sources: ["whatsapp", "email"], delta: 3.17 },
    { date: "2025-01-15", in: "09:15", out: "19:10", sources: ["badge"], delta: 1.92 },
    { date: "2025-01-16", in: "08:40", out: "18:45", sources: ["email"], delta: 2.08 },
    
    // Semaine 3 (19-25 jan 2025)
    { date: "2025-01-19", in: "08:35", out: "19:45", sources: ["badge", "skype"], delta: 3.17 },
    { date: "2025-01-20", in: "09:20", out: "18:40", sources: ["badge"], delta: 1.33 },
    { date: "2025-01-21", in: "08:50", out: "20:15", sources: ["email", "whatsapp"], delta: 3.42 },
    { date: "2025-01-22", in: "09:00", out: "19:05", sources: ["badge"], delta: 2.08 },
    { date: "2025-01-23", in: "08:45", out: "18:50", sources: ["email"], delta: 2.08 },
    
    // Semaine 4 (26 jan - 1 fév 2025)
    { date: "2025-01-26", in: "08:52", out: "19:25", sources: ["badge", "email"], delta: 2.55 },
    { date: "2025-01-27", in: "09:10", out: "18:35", sources: ["badge"], delta: 1.42 },
    { date: "2025-01-28", in: "08:40", out: "20:20", sources: ["whatsapp", "email"], delta: 3.67 },
    { date: "2025-01-29", in: "09:05", out: "19:15", sources: ["badge"], delta: 2.17 },
    { date: "2025-01-30", in: "08:55", out: "18:40", sources: ["email"], delta: 1.75 },
    { date: "2025-01-31", in: "08:45", out: "19:30", sources: ["badge"], delta: 2.75 },
    
    // Semaine 5 (2-8 fév 2025)
    { date: "2025-02-02", in: "08:50", out: "19:40", sources: ["badge", "email"], delta: 2.83 },
    { date: "2025-02-03", in: "09:15", out: "18:30", sources: ["badge"], delta: 1.25 },
    { date: "2025-02-04", in: "08:35", out: "20:10", sources: ["whatsapp"], delta: 3.58 },
    { date: "2025-02-05", in: "09:00", out: "19:20", sources: ["badge", "email"], delta: 2.33 },
    { date: "2025-02-06", in: "08:48", out: "18:55", sources: ["email"], delta: 2.12 },
    { date: "2025-02-07", in: "08:40", out: "19:35", sources: ["badge"], delta: 2.92 },
    
    // Continue with more weeks... (abbreviated for space)
    // Semaine 6-13 with similar patterns
    { date: "2025-02-09", in: "08:45", out: "19:50", sources: ["badge", "email"], delta: 3.08 },
    { date: "2025-02-10", in: "09:20", out: "18:45", sources: ["badge"], delta: 1.42 },
    { date: "2025-02-11", in: "08:52", out: "20:05", sources: ["whatsapp", "email"], delta: 3.22 },
    { date: "2025-02-12", in: "09:05", out: "19:10", sources: ["badge"], delta: 2.08 },
    { date: "2025-02-13", in: "08:40", out: "18:50", sources: ["email"], delta: 2.17 },
    { date: "2025-02-14", in: "08:55", out: "19:25", sources: ["badge"], delta: 2.50 },
    
    // Semaine 7
    { date: "2025-02-16", in: "08:38", out: "19:55", sources: ["badge", "email"], delta: 3.28 },
    { date: "2025-02-17", in: "09:12", out: "18:40", sources: ["badge"], delta: 1.47 },
    { date: "2025-02-18", in: "08:50", out: "20:15", sources: ["whatsapp"], delta: 3.42 },
    { date: "2025-02-19", in: "09:08", out: "19:05", sources: ["badge", "email"], delta: 1.95 },
    { date: "2025-02-20", in: "08:42", out: "18:48", sources: ["email"], delta: 2.10 },
    { date: "2025-02-21", in: "08:55", out: "19:40", sources: ["badge"], delta: 2.75 },
    
    // Semaine 8
    { date: "2025-02-23", in: "08:45", out: "19:48", sources: ["badge", "email"], delta: 3.05 },
    { date: "2025-02-24", in: "09:18", out: "18:35", sources: ["badge"], delta: 1.28 },
    { date: "2025-02-25", in: "08:48", out: "20:12", sources: ["whatsapp", "email"], delta: 3.40 },
    { date: "2025-02-26", in: "09:02", out: "19:15", sources: ["badge"], delta: 2.22 },
    { date: "2025-02-27", in: "08:35", out: "18:45", sources: ["email"], delta: 2.17 },
    { date: "2025-02-28", in: "08:52", out: "19:30", sources: ["badge"], delta: 2.63 },
    
    // Mars - Semaines 9-13
    { date: "2025-03-02", in: "08:40", out: "19:52", sources: ["badge", "email"], delta: 3.20 },
    { date: "2025-03-03", in: "09:15", out: "18:42", sources: ["badge"], delta: 1.45 },
    { date: "2025-03-04", in: "08:55", out: "20:08", sources: ["whatsapp"], delta: 3.22 },
    { date: "2025-03-05", in: "09:00", out: "19:12", sources: ["badge", "email"], delta: 2.20 },
    { date: "2025-03-06", in: "08:48", out: "18:50", sources: ["email"], delta: 2.03 },
    { date: "2025-03-07", in: "08:42", out: "19:35", sources: ["badge"], delta: 2.88 },
    
    // Final weeks continue with similar pattern...
    { date: "2025-03-09", in: "08:50", out: "19:45", sources: ["badge", "email"], delta: 2.92 },
    { date: "2025-03-10", in: "09:12", out: "18:38", sources: ["badge"], delta: 1.43 },
    { date: "2025-03-11", in: "08:45", out: "20:10", sources: ["whatsapp", "email"], delta: 3.42 },
    { date: "2025-03-12", in: "09:05", out: "19:08", sources: ["badge"], delta: 2.05 },
    { date: "2025-03-13", in: "08:40", out: "18:55", sources: ["email"], delta: 2.25 },
    { date: "2025-03-14", in: "08:58", out: "19:28", sources: ["badge"], delta: 2.50 },
    
    // Week 11
    { date: "2025-03-16", in: "08:42", out: "19:50", sources: ["badge", "email"], delta: 3.13 },
    { date: "2025-03-17", in: "09:20", out: "18:45", sources: ["badge"], delta: 1.42 },
    { date: "2025-03-18", in: "08:52", out: "20:05", sources: ["whatsapp"], delta: 3.22 },
    { date: "2025-03-19", in: "09:08", out: "19:15", sources: ["badge", "email"], delta: 2.12 },
    { date: "2025-03-20", in: "08:45", out: "18:48", sources: ["email"], delta: 2.05 },
    { date: "2025-03-21", in: "08:55", out: "19:32", sources: ["badge"], delta: 2.62 },
    
    // Week 12
    { date: "2025-03-23", in: "08:48", out: "19:48", sources: ["badge", "email"], delta: 3.00 },
    { date: "2025-03-24", in: "09:15", out: "18:40", sources: ["badge"], delta: 1.42 },
    { date: "2025-03-25", in: "08:50", out: "20:12", sources: ["whatsapp", "email"], delta: 3.37 },
    { date: "2025-03-26", in: "09:02", out: "19:18", sources: ["badge"], delta: 2.27 },
    { date: "2025-03-27", in: "08:40", out: "18:52", sources: ["email"], delta: 2.20 },
    { date: "2025-03-28", in: "08:58", out: "19:35", sources: ["badge"], delta: 2.62 },
    
    // Week 13 (final)
    { date: "2025-03-30", in: "08:45", out: "19:42", sources: ["badge", "email"], delta: 2.95 }
  ]
};
