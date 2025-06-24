
import { MOTIF_QUESTIONS, Question } from "@/lib/questions.config";

export function getQuestionsForMotifs(motifs: string[]): Question[] {
  return MOTIF_QUESTIONS
    .filter(block => motifs.includes(block.motifKey))
    .flatMap(block => block.questions);
}

export function getTooltipForQuestion(id: string): string {
  const tooltips: Record<string, string> = {
    "H1": "Le forfait-jours s'applique aux cadres autonomes (L3121-58)",
    "H2": "Entre 120 et 235 jours selon les conventions collectives",
    "H3": "Temps de travail effectif au-delà de la durée légale",
    "H6": "Système de contrôle des horaires obligatoire pour justifier les heures",
    "H7": "Les emails tardifs peuvent prouver l'amplitude horaire",
    "L1": "Étape obligatoire avant tout licenciement (L1232-2)",
    "L3": "La lettre fixe les limites du litige (Art L1232-6)",
    "L4": "Reproduction exacte du motif invoqué par l'employeur",
    "HM1": "Qualification juridique des faits de harcèlement",
    "HM3": "Les témoignages renforcent la crédibilité des faits",
    "CP1": "Congés acquis non pris ou refusés abusivement",
    "AT1": "Date déterminante pour les délais de prescription",
    "AT2": "La déclaration Cerfa 60-3951 doit être envoyée sous 48h",
    "O1": "Description précise pour qualifier juridiquement le litige"
  };
  return tooltips[id] || "";
}
