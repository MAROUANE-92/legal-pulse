export type QuestionType = 
  | "text" | "date" | "email" | "tel" | "number" 
  | "yes_no" | "select_one" | "select_many" | "file";

export type Question = {
  id: string;
  type: QuestionType;
  label: string;
  required?: boolean;
  required_if?: string;
  show_if?: string;
  options?: string[] | { code: string; label: string }[];
  files_expected?: string | string[];
};

export type Section = {
  id: string;
  label: string;
  always_shown?: boolean;
  show_if?: string;
  questions: Question[];
};

export const QUESTIONNAIRE_SCHEMA: Section[] = [
  {
    id: "identity",
    label: "Identité et coordonnées",
    always_shown: true,
    questions: [
      { id: "full_name", type: "text", label: "Nom & prénom", required: true },
      { id: "birth_date", type: "date", label: "Date de naissance", required: true },
      { id: "postal_address", type: "text", label: "Adresse complète", required: true },
      { id: "address_proof", type: "file", label: "Justificatif < 3 mois", required_if: "postal_address != ''", files_expected: "facture_domicile.pdf" },
      { id: "phone_personal", type: "tel", label: "Téléphone perso", required: true },
      { id: "phone_professional", type: "tel", label: "Téléphone pro (si usage)", required: false },
      { id: "email_personal", type: "email", label: "Email personnel", required: true },
      { id: "email_work", type: "email", label: "Email travail (si différent)", required: false },
      {
        id: "marital_status",
        type: "select_one",
        label: "Situation familiale",
        options: ["Célibataire", "Marié(e)", "Pacsé(e)", "Divorcé(e)"],
        required: true
      }
    ]
  },
  {
    id: "contract",
    label: "Données contrat",
    always_shown: true,
    questions: [
      {
        id: "contract_type",
        type: "select_one",
        label: "Type de contrat",
        options: ["CDI", "CDD", "Stage", "Apprentissage", "Intérim"],
        required: true,
        files_expected: ["contrat_travail.pdf", "avenants.zip"]
      },
      { id: "contract_start", type: "date", label: "Date de début", required: true },
      { id: "contract_end", type: "date", label: "Date de fin / préavis", required_if: "contract_type != 'CDI'" },
      { id: "position_title", type: "text", label: "Poste occupé", required: true },
      { id: "idcc_code", type: "text", label: "IDCC / Convention collective", required: true },
      { id: "trial_period", type: "yes_no", label: "Période d'essai ?", required: true },
      { id: "trial_renewal", type: "yes_no", label: "Renouvelée ?", show_if: "trial_period == 'Yes'" },
      { 
        id: "cadre_status", 
        type: "select_one", 
        label: "Statut", 
        options: ["Cadre", "Non-cadre"], 
        required: true 
      },
      { 
        id: "forfait_clause", 
        type: "select_one", 
        label: "Clause forfait", 
        options: ["Aucune", "Forfait-jours", "Forfait-heures"] 
      },
      { id: "mobility_clause", type: "yes_no", label: "Clause mobilité ?", required: false },
      { id: "non_compete_clause", type: "yes_no", label: "Clause non-concurrence ?", required: false }
    ]
  },
  {
    id: "remuneration",
    label: "Rémunération & avantages",
    always_shown: true,
    questions: [
      { id: "base_salary", type: "number", label: "Salaire brut mensuel (€)", required: true },
      { 
        id: "variable_comp", 
        type: "yes_no", 
        label: "Primes fixes / variables ?", 
        required: true,
        files_expected: ["plan_commissions.pdf", "bulletins_prime.zip"]
      },
      {
        id: "benefits_kind",
        type: "select_many",
        label: "Avantages en nature",
        options: ["Voiture", "Logement", "Téléphone", "Autre"],
        show_if: "variable_comp == 'Yes'"
      },
      { 
        id: "expense_refund", 
        type: "yes_no", 
        label: "Frais remboursés ?", 
        required: false,
        files_expected: "notes_frais.pdf"
      }
    ]
  },
  {
    id: "working_time",
    label: "Temps de travail",
    always_shown: true,
    questions: [
      {
        id: "work_regime",
        type: "select_one",
        label: "Régime horaire contractuel",
        options: ["35h", "39h", "Forfait-jours", "Forfait-heures"],
        required: true
      },
      { id: "actual_schedule", type: "text", label: "Horaires réels moyens (ex. 08:30-18:00)" },
      { 
        id: "badge_system", 
        type: "yes_no", 
        label: "Badgeage / pointeuse ?",
        files_expected: "exports_badge.csv"
      },
      { id: "partial_remote", type: "yes_no", label: "Télétravail partiel ?" },
      { id: "overtime_regular", type: "yes_no", label: "Heures supplémentaires régulières ?" },
      { id: "absences_count", type: "yes_no", label: "Absences ou arrêts maladie ?" }
    ]
  },
  {
    id: "claim_motifs",
    label: "Motif(s) de réclamation",
    always_shown: true,
    questions: [
      {
        id: "motifs_selected",
        type: "select_many",
        label: "Sélectionnez vos motifs",
        options: [
          { code: "overtime", label: "Heures supplémentaires non payées" },
          { code: "dismissal", label: "Licenciement abusif / irrégulier" },
          { code: "harassment", label: "Harcèlement moral / sexuel" },
          { code: "unpaid_leave", label: "Congés non payés / soldes erronés" },
          { code: "discrimination", label: "Discrimination" },
          { code: "accident", label: "Accident du travail / MP" },
          { code: "other", label: "Autre" }
        ]
      }
    ]
  },
  // Blocs conditionnels
  {
    id: "overtime_block",
    show_if: "motifs_selected includes 'overtime'",
    label: "Bloc Heures supplémentaires",
    questions: [
      { id: "weekly_hours_avg", type: "number", label: "Heures hebdo moyennes", required: true },
      { id: "overtime_paid", type: "yes_no", label: "Heures récupérées / payées ?", required: true },
      { id: "overtime_agreement", type: "yes_no", label: "Accord d'entreprise sur HS ?" }
    ]
  },
  {
    id: "dismissal_block",
    show_if: "motifs_selected includes 'dismissal'",
    label: "Bloc Licenciement",
    questions: [
      { id: "convo_date", type: "date", label: "Date convocation EP", required: true },
      { id: "interview_date", type: "date", label: "Date entretien préalable", required: true },
      { id: "notif_date", type: "date", label: "Date notification licenciement", required: true },
      {
        id: "dismissal_reason",
        type: "select_one",
        label: "Motif invoqué",
        options: ["Économique", "Personnel", "Disciplinaire", "Autre"]
      }
    ]
  },
  {
    id: "harassment_block",
    show_if: "motifs_selected includes 'harassment'",
    label: "Bloc Harcèlement",
    questions: [
      { id: "facts_description", type: "text", label: "Description des faits", required: true },
      { id: "medical_impact", type: "yes_no", label: "Arrêts / traitement médical ?" }
    ]
  },
  {
    id: "unpaid_leave_block",
    show_if: "motifs_selected includes 'unpaid_leave'",
    label: "Bloc Congés non payés",
    questions: [
      { id: "days_due", type: "number", label: "Jours CP/RTT non payés", required: true },
      { id: "refus_cp", type: "yes_no", label: "Refus injustifié ?" }
    ]
  },
  {
    id: "discrimination_block",
    show_if: "motifs_selected includes 'discrimination'",
    label: "Bloc Discrimination",
    questions: [
      {
        id: "protected_criteria",
        type: "select_many",
        label: "Critère protégé",
        options: ["Sexe", "Âge", "Origine", "Handicap", "Syndicat", "Autre"]
      }
    ]
  },
  {
    id: "accident_block",
    show_if: "motifs_selected includes 'accident'",
    label: "Bloc Accident du travail / maladie professionnelle",
    questions: [
      { id: "accident_date", type: "date", label: "Date accident", required: true },
      { id: "declaration_cpam", type: "yes_no", label: "Déclaration CPAM faite ?", required: true }
    ]
  },
  {
    id: "other_block",
    show_if: "motifs_selected includes 'other'",
    label: "Bloc Autre",
    questions: [
      { id: "other_description", type: "text", label: "Décrivez votre réclamation", required: true },
      { id: "other_files", type: "file", label: "Joignez toute pièce", required: false }
    ]
  },
  {
    id: "evidence_channels",
    label: "Canaux de preuve disponibles",
    always_shown: true,
    questions: [
      {
        id: "channels",
        type: "select_many",
        label: "Quels canaux contiennent vos preuves ?",
        options: ["Email", "SMS", "WhatsApp", "Teams/Slack", "Téléphone (logs)", "Badge", "Autre"]
      }
    ]
  },
  {
    id: "admin_final",
    label: "Mandats & consentements",
    always_shown: true,
    questions: [
      { id: "representation_mandate", type: "yes_no", label: "Mandat de représentation signé", required: true },
      { id: "rgpd_consent", type: "yes_no", label: "Consentement RGPD", required: true },
      {
        id: "notif_pref",
        type: "select_one",
        label: "Mode de notification préféré",
        options: ["Email", "SMS", "WhatsApp"],
        required: true
      }
    ]
  }
];

// Helper function to get visible sections based on answers
export function getVisibleSections(answers: Record<string, any>): Section[] {
  return QUESTIONNAIRE_SCHEMA.filter(section => {
    if (section.always_shown) return true;
    if (!section.show_if) return true;
    
    // Simple evaluation for now - can be enhanced with a proper parser
    const condition = section.show_if;
    if (condition.includes("motifs_selected includes")) {
      const motif = condition.match(/'([^']+)'/)?.[1];
      return motif && answers.motifs_selected?.includes(motif);
    }
    
    return true;
  });
}

// Helper function to get visible questions within a section
export function getVisibleQuestions(section: Section, answers: Record<string, any>): Question[] {
  return section.questions.filter(question => {
    if (!question.show_if) return true;
    
    // Simple evaluation for now
    const condition = question.show_if;
    if (condition.includes("==")) {
      const [field, value] = condition.split("==").map(s => s.trim().replace(/'/g, ""));
      return answers[field] === value;
    }
    
    return true;
  });
}