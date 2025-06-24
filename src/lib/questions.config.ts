
export type Piece = { 
  label: string; 
  required?: boolean 
};

export type Question = {
  id: string;
  label: string;
  type: "number" | "date" | "slider" | "radio" | "checkbox" | "textarea" | "multiselect" | "timerange";
  required: boolean;
  options?: string[];            // radio / select
  min?: number; 
  max?: number;                  // sliders / numbers
  dependsOn?: { questionId: string; value: any };
  triggerPieces?: Piece[];       // pièces à créer si réponse présente ou true
  piecesMap?: Record<string, string>; // for checkbox options mapping to pieces
};

export type MotifBlock = { 
  motifKey: string; 
  questions: Question[] 
};

export const MOTIF_QUESTIONS: MotifBlock[] = [
  {
    motifKey: "heures_supp",
    questions: [
      {
        id: "H1", 
        required: true, 
        type: "radio",
        label: "Votre contrat contient-il une clause forfait-jours ?",
        options: ["Oui", "Non"],
      },
      {
        id: "H2", 
        required: false, 
        type: "number", 
        min: 120, 
        max: 235,
        label: "Nombre de jours travaillés/an prévus au forfait",
        dependsOn: { questionId: "H1", value: "Oui" }
      },
      {
        id: "H3", 
        required: true, 
        type: "slider", 
        min: 0, 
        max: 30,
        label: "Heures au-delà de 35 h/semaine (moyenne)",
        dependsOn: { questionId: "H1", value: "Non" },
        triggerPieces: [
          { label: "Badge logs CSV" }, 
          { label: "Planning PDF" }
        ]
      },
      {
        id: "H6", 
        required: true, 
        type: "radio", 
        options: ["Oui", "Non"],
        label: "Système de badgeage/pointeuse ?",
        triggerPieces: [{ label: "Badge logs CSV", required: true }]
      },
      {
        id: "H7", 
        required: false, 
        type: "radio", 
        options: ["Oui", "Non"],
        label: "E-mails envoyés après 20h enregistrés ?",
        triggerPieces: [{ label: "Archive e-mails PST" }]
      },
      {
        id: "H10_actualHours",
        required: true,
        type: "timerange",
        label: "Horaire réel moyen",
        triggerPieces: [{ label: "Planning réel" }]
      }
    ]
  },
  {
    motifKey: "licenciement",
    questions: [
      { 
        id: "L1", 
        required: true, 
        type: "date", 
        label: "Date convocation entretien préalable", 
        triggerPieces: [{ label: "Lettre convocation" }]
      },
      { 
        id: "L3", 
        required: true, 
        type: "date", 
        label: "Date lettre de licenciement", 
        triggerPieces: [
          { label: "Lettre licenciement" }, 
          { label: "Accusé réception LRAR" }
        ]
      },
      { 
        id: "L4", 
        required: true, 
        type: "textarea", 
        label: "Motif indiqué dans la lettre (copier-coller)", 
        min: 30 
      },
      {
        id: "L9_STC",
        required: true,
        type: "radio",
        options: ["Oui", "Non"],
        label: "Solde tout compte signé ?",
        triggerPieces: [{ label: "STC scan" }]
      }
    ]
  },
  {
    motifKey: "harcelement",
    questions: [
      { 
        id: "HM1", 
        required: true, 
        type: "multiselect", 
        options: ["Moral", "Sexuel", "Discrimination"], 
        label: "Nature des faits" 
      },
      { 
        id: "HM3", 
        required: true, 
        type: "number", 
        min: 0, 
        max: 20, 
        label: "Nombre de témoins identifiés", 
        triggerPieces: [{ label: "Attestations témoins" }] 
      }
    ]
  },
  {
    motifKey: "conges_impayes",
    questions: [
      { 
        id: "CP1", 
        required: true, 
        type: "number", 
        min: 1, 
        max: 120, 
        label: "Jours de congé non réglés", 
        triggerPieces: [{ label: "Compteurs RH" }] 
      }
    ]
  },
  {
    motifKey: "accident",
    questions: [
      { 
        id: "AT1", 
        required: true, 
        type: "date", 
        label: "Date accident ou 1er symptôme MP", 
        triggerPieces: [{ label: "Déclaration AT" }]
      },
      { 
        id: "AT2", 
        required: true, 
        type: "radio", 
        options: ["Oui", "Non"], 
        label: "Déclaration AT transmise CPAM ?", 
        triggerPieces: [{ label: "Déclaration AT" }]
      }
    ]
  },
  {
    motifKey: "autre",
    questions: [
      { 
        id: "O1", 
        required: true, 
        type: "textarea", 
        label: "Décrivez votre litige", 
        min: 50 
      }
    ]
  }
];

// Global questions that appear regardless of motifs
export const GLOBAL_QUESTIONS: Question[] = [
  {
    id: "E1_channels",
    required: true,
    type: "checkbox",
    label: "Canaux de preuve disponibles",
    options: ["email", "sms", "whatsapp", "teams", "calls", "autre"],
    piecesMap: {
      email: "Archive PST/EML",
      sms: "Export SMS",
      whatsapp: "Export chat ZIP",
      teams: "Export Teams",
      calls: "CSV appels"
    }
  }
];
