-- Insertion de données de test pour le questionnaire client
-- Token utilisé: test_token_123

INSERT INTO answers (submission_id, question_slug, answer, metadata) VALUES 
-- Section Identité
('test_token_123', 'identity.full_name', '"Jean Dupont"', '{"step": "identity", "original_key": "full_name"}'),
('test_token_123', 'identity.email', '"jean.dupont@test.com"', '{"step": "identity", "original_key": "email"}'),
('test_token_123', 'identity.phone', '"0123456789"', '{"step": "identity", "original_key": "phone"}'),
('test_token_123', 'identity.birth_date', '"1985-06-15"', '{"step": "identity", "original_key": "birth_date"}'),

-- Section Urgence
('test_token_123', 'urgency.employment_status', '"Licencié"', '{"step": "urgency", "original_key": "employment_status"}'),
('test_token_123', 'urgency.incident_date', '"2024-01-15"', '{"step": "urgency", "original_key": "incident_date"}'),
('test_token_123', 'urgency.critical_situation', 'true', '{"step": "urgency", "original_key": "critical_situation"}'),
('test_token_123', 'urgency.time_sensitivity', '"Très urgent"', '{"step": "urgency", "original_key": "time_sensitivity"}'),

-- Section Histoire
('test_token_123', 'story.main_problem', '"Licenciement sans cause réelle et sérieuse après avoir réclamé mes heures supplémentaires"', '{"step": "story", "original_key": "main_problem"}'),
('test_token_123', 'story.problem_start_date', '"2023-10-01"', '{"step": "story", "original_key": "problem_start_date"}'),
('test_token_123', 'story.narrative', '"J''ai travaillé comme commercial pendant 3 ans. En octobre 2023, j''ai commencé à réclamer le paiement de mes heures supplémentaires non rémunérées. Mon manager a mal réagi et a commencé à me mettre la pression. En janvier 2024, j''ai été licencié pour prétendue insuffisance professionnelle."', '{"step": "story", "original_key": "narrative"}'),
('test_token_123', 'story.expected_outcome', '"Reconnaissance du licenciement sans cause réelle et sérieuse + paiement heures supplémentaires"', '{"step": "story", "original_key": "expected_outcome"}'),
('test_token_123', 'story.witnesses', '"Marie Martin (collègue), Paul Durand (ancien manager)"', '{"step": "story", "original_key": "witnesses"}'),

-- Section Entreprise
('test_token_123', 'company.name', '"TechCorp SARL"', '{"step": "company", "original_key": "name"}'),
('test_token_123', 'company.size', '"50-100 salariés"', '{"step": "company", "original_key": "size"}'),
('test_token_123', 'company.sector', '"Technologies"', '{"step": "company", "original_key": "sector"}'),
('test_token_123', 'company.collective_agreement', '"Syntec"', '{"step": "company", "original_key": "collective_agreement"}'),

-- Section Qualification
('test_token_123', 'qualification.position', '"Commercial sénior"', '{"step": "qualification", "original_key": "position"}'),
('test_token_123', 'qualification.hierarchy_level', '"Cadre"', '{"step": "qualification", "original_key": "hierarchy_level"}'),

-- Section Contrat
('test_token_123', 'contract.contract_type', '"CDI"', '{"step": "contract", "original_key": "contract_type"}'),
('test_token_123', 'contract.start_date', '"2021-03-01"', '{"step": "contract", "original_key": "start_date"}'),
('test_token_123', 'contract.salary', '45000', '{"step": "contract", "original_key": "salary"}'),

-- Section Documents
('test_token_123', 'documents.available_documents', '"Contrat de travail, fiches de paie, emails avec le manager"', '{"step": "documents", "original_key": "available_documents"}'),
('test_token_123', 'documents.missing_documents', '"Certificat de travail, solde de tout compte"', '{"step": "documents", "original_key": "missing_documents"}'),

-- Section Timeline
('test_token_123', 'timeline.key_events', '"Oct 2023: Première réclamation HS, Nov 2023: Entretien avec RH, Jan 2024: Licenciement"', '{"step": "timeline", "original_key": "key_events"}'),

-- Section Préjudices
('test_token_123', 'damages.financial', '{"overtime": 8500, "severance": 15000, "notice": 3750}', '{"step": "damages", "original_key": "financial"}'),
('test_token_123', 'damages.moral', '"Stress, perte de confiance, difficultés à retrouver un emploi"', '{"step": "damages", "original_key": "moral"}'),
('test_token_123', 'damages.career_impact', '"Interruption de carrière, perte d''ancienneté"', '{"step": "damages", "original_key": "career_impact"}');