// Données fictives pour le wizard client
export const mockClientFormData = {
  identity: {
    full_name: "Marie Dupont",
    birth_date: "1985-03-15",
    postal_address: "12 rue de la Paix, 75001 Paris",
    phone_personal: "06 12 34 56 78",
    phone_work: "01 23 45 67 89",
    email_personal: "marie.dupont@email.com",
    email_work: "m.dupont@company.com",
    marital_status: "célibataire"
  },
  contract: {
    company_name: "Tech Solutions SARL",
    contract_type: "CDI",
    start_date: "2020-01-15",
    end_date: null,
    position: "Développeuse Senior",
    salary: 45000,
    working_hours: 35
  },
  remuneration: {
    base_salary: 45000,
    bonuses: 5000,
    benefits: ["Tickets restaurant", "Mutuelle", "13ème mois"],
    overtime_rate: 1.25
  },
  working_time: {
    schedule_type: "fixed",
    start_time: "09:00",
    end_time: "17:30",
    break_duration: 60,
    saturday_work: false,
    sunday_work: false
  },
  motifs: {
    motifs_selected: ["heures_supplementaires", "licenciement_abusif", "harcelement"]
  }
};

export const mockQuestionnaires = [
  {
    id: "demo-client-1",
    token: "abc123demo",
    client_name: "Marie Dupont",
    status: "completed",
    created_at: "2024-12-20T10:00:00Z",
    form_data: mockClientFormData
  },
  {
    id: "demo-client-2", 
    token: "def456demo",
    client_name: "Pierre Martin",
    status: "in_progress",
    created_at: "2024-12-21T14:30:00Z",
    form_data: {
      identity: {
        full_name: "Pierre Martin",
        birth_date: "1978-07-22",
        postal_address: "45 avenue des Champs, 69000 Lyon",
        phone_personal: "06 98 76 54 32"
      },
      motifs: {
        motifs_selected: ["heures_supplementaires"]
      }
    }
  },
  {
    id: "demo-client-3",
    token: "ghi789demo", 
    client_name: "Sophie Bernard",
    status: "draft",
    created_at: "2024-12-22T09:15:00Z",
    form_data: {
      identity: {
        full_name: "Sophie Bernard",
        email_personal: "sophie.bernard@email.com"
      }
    }
  }
];

export const mockDocuments = [
  {
    id: "doc-1",
    questionnaire_id: "demo-client-1",
    name: "Contrat de travail.pdf",
    type: "contract",
    size: 245000,
    uploaded_at: "2024-12-20T11:00:00Z"
  },
  {
    id: "doc-2", 
    questionnaire_id: "demo-client-1",
    name: "Fiches de paie 2024.zip",
    type: "payslips",
    size: 1200000,
    uploaded_at: "2024-12-20T11:15:00Z"
  },
  {
    id: "doc-3",
    questionnaire_id: "demo-client-1", 
    name: "Emails RH.pdf",
    type: "correspondence",
    size: 890000,
    uploaded_at: "2024-12-20T11:30:00Z"
  }
];

export const mockTimeline = [
  {
    id: "event-1",
    questionnaire_id: "demo-client-1",
    date: "2024-12-20T10:00:00Z",
    type: "questionnaire_started",
    description: "Questionnaire démarré"
  },
  {
    id: "event-2", 
    questionnaire_id: "demo-client-1",
    date: "2024-12-20T10:45:00Z",
    type: "identity_completed",
    description: "Informations personnelles complétées"
  },
  {
    id: "event-3",
    questionnaire_id: "demo-client-1", 
    date: "2024-12-20T11:00:00Z",
    type: "documents_uploaded",
    description: "3 documents téléchargés"
  },
  {
    id: "event-4",
    questionnaire_id: "demo-client-1",
    date: "2024-12-20T12:00:00Z", 
    type: "questionnaire_completed",
    description: "Questionnaire finalisé et signé"
  }
];