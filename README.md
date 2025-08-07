# 📑 LegalPulse - MVP Dro Socialit

## 🎯 Vision Métier

**LegalPulse transforme n'importe quelle preuve (badge logs, e-mails, chats, scans) en chronologie exhaustive, calcule automatiquement les dommages (heures sup, barème Macron, etc.), génère les conclusions IA et dépose en 1-clic via RPVA.**

### Objectifs 2025
- **MVP**: Réduire de -40% le temps de préparation d'un dossier prud'homal pour un cabinet de droit social
- **Métriques de succès**: 
  - Δh de préparation (cible ≥ –30%)
  - Taux d'erreur pièces manquantes < 2%
  - NPS avocat ≥ +50

## 👥 Personas Utilisateurs

### 🧑‍💼 Mehdi - Avocat collaborateur (28 ans)
- **Pains**: Classement manuel, oublis deadlines, Excel barème
- **Solutions LegalPulse**: Checklist IA, rappels, export auto .docx

### 📋 Julie - Secrétaire juridique
- **Pains**: Scanner/tamponner 200 PDF, bordereaux
- **Solutions LegalPulse**: Ingest OCR → pagination + bordereau auto

### 👤 Karim - Salarié plaignant
- **Pains**: Ne sait pas quelles pièces envoyer
- **Solutions LegalPulse**: Wizard client + uploads typés + relance auto

## 🌊 Flows Principaux

### 1. Flow Magic-Link Client (Nouveau)
```
/access?form=test
    ↓ (Magic-link par email)
/form/redirect 
    ↓ (Création soumission + auth)
/demo-client → /client/abc123demo/welcome
    ↓ (Wizard 11 étapes)
/form/:id (Page récapitulative finale)
```

### 2. Flow Wizard Client Existant
```
/demo-client → /client/:token/welcome
    ↓
/client/:token/identity      (Étape 1: Identité)
/client/:token/contract      (Étape 2: Contrat)
/client/:token/remuneration  (Étape 3: Rémunération)
/client/:token/working_time  (Étape 4: Temps de travail)
/client/:token/motifs        (Étape 5: Motifs réclamation)
/client/:token/questions     (Étape 6: Questions dynamiques)
/client/:token/upload        (Étape 7: Upload pièces)
/client/:token/chronologie   (Étape 8: Timeline)
/client/:token/signature     (Étape 9: Signature)
/client/:token/confirm       (Étape 10: Confirmation)
    ↓
/form/:id (Récapitulatif avec avocat + calculs)
```

### 3. Flow Avocat (Interface Principale)
```
/login → / (Dashboard)
    ↓
/dossier/:id (Gestion dossier)
    ├── Onglet Synthèse
    ├── Onglet Pièces  
    ├── Onglet Chronologie
    ├── Onglet Conclusions
    ├── Onglet Tâches
    └── Onglet Échanges
```

## 🏗️ Architecture Technique

### Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State**: TanStack Query + Context API
- **Backend**: Supabase (Auth + Database + Storage)
- **Database**: PostgreSQL avec RLS

### Structure des Données

#### Tables Principales
```sql
-- Gestion des invitations clients
invites (id, email, status, expires_at, invited_by)

-- Soumissions de formulaires clients  
Soumissions_formulaires_form_clients (id, form_id, status, score)

-- Réponses au questionnaire
answers (submission_id, question_slug, value, uploaded_file_url)

-- Événements de timeline
timeline_events (submission_id, event_type, title, event_date, details)

-- Formulaires (schéma questionnaire)
forms (id, name, definition, version)
```

#### Questionnaire Schema
Le questionnaire utilise un schéma dynamique défini dans `src/lib/questionnaire-schema.ts` :
- **Sections obligatoires**: identity, contract, remuneration, working_time, claim_motifs
- **Blocs conditionnels**: overtime_block, dismissal_block, harassment_block, etc.
- **Questions dynamiques**: Affichage basé sur les réponses précédentes

## 📁 Structure du Code

```
src/
├── components/
│   ├── client/                    # Wizard client
│   │   ├── steps/                # Étapes du questionnaire
│   │   ├── QuestionnaireForm.tsx # Form adaptative
│   │   └── TimelineView.tsx      # Affichage timeline
│   ├── dossier/                  # Interface avocat
│   └── ui/                       # shadcn components
├── hooks/
│   ├── useQuestionnaire.ts       # Gestion questionnaire
│   ├── useTimeline.ts           # Gestion timeline  
│   └── useQuestionnaireSchema.ts # Schema dynamique
├── pages/
│   ├── AccessPage.tsx           # Magic-link landing
│   ├── FormRedirect.tsx         # Redirection post-auth
│   ├── FormPage.tsx             # Récapitulatif final
│   ├── ClientWizard.tsx         # Wizard principal
│   └── Dossier.tsx              # Interface avocat
└── lib/
    ├── questionnaire-schema.ts  # Définition questionnaire
    └── mockData.ts             # Données de test
```

## 🧪 Comment Tester

### 1. Flow Magic-Link
```bash
# 1. Accéder à la page d'invitation
http://localhost:8080/access?form=test

# 2. Saisir email → recevoir magic-link
# 3. Cliquer magic-link → redirection automatique vers wizard
```

### 2. Flow Demo Direct
```bash
# Accès direct au wizard demo
http://localhost:8080/demo-client
```

### 3. Interface Avocat
```bash
# Demo dossier avocat
http://localhost:8080/dossier-demo/123
```

## 🔐 Authentification & Sécurité

### Magic-Link Flow
1. **OTP Supabase**: Email magic-link avec token temporaire
2. **Création automatique**: User + Soumission si n'existe pas
3. **RLS Policies**: Accès sécurisé par user_id

### Row Level Security
```sql
-- Exemple politique: utilisateurs voient leurs données uniquement
CREATE POLICY "Users can view their own answers" 
ON answers FOR SELECT 
USING (submission_id IN (
  SELECT id FROM Soumissions_formulaires_form_clients 
  WHERE form_id = auth.uid()
));
```

## 🚀 Features Implémentées

### ✅ MVP Core
- [x] Magic-link client invitation
- [x] Questionnaire adaptatif 11 étapes
- [x] Upload et gestion de pièces (interface front-end uniquement)
- [x] Timeline automatique
- [x] Interface avocat avec onglets
- [x] Calculs heures supplémentaires (front-end avec données mockées)
- [x] Export données CSV timeline (front-end uniquement)

### 🚧 En Développement
- [ ] Moteur IA conclusions
- [ ] Intégration RPVA
- [ ] OCR automatique
- [ ] Notifications automatiques
- [ ] Barème Macron auto

## 🎨 Design System

Le projet utilise un design system cohérent :
- **Couleurs**: justice-primary #1E3A8A, justice-green #22C55E
- **Typography**: Inter, 16-24-32px (Tailwind scale)
- **Components**: shadcn/ui customisés avec variants métier

## 📊 Données de Test

Le projet inclut des données mock pour tester :
- **Mock Timeline**: `src/lib/mockTimeline.ts`
- **Mock Dossiers**: `src/lib/mockDossiers.ts`
- **Mock Overtime**: `src/lib/mockOvertimeTrim.ts`

## 🛠️ Commandes Utiles

```bash
# Développement
npm run dev

# Build
npm run build

# Types check
npm run type-check

# Tests (à implémenter)
npm run test
```

## 📈 Prochaines Étapes

1. **Finaliser calculs**: Barème Macron, indemnités
2. **IA Conclusions**: GPT-4 génération automatique
3. **RPVA Integration**: Dépôt automatique Conseil Prudhommes
4. **Analytics**: Tracking performance temps avocat
5. **Mobile**: Version responsive optimisée

---

## 🔧 Informations Techniques (Lovable)

**URL du projet**: https://lovable.dev/projects/fa7ed0fd-5766-4146-8a09-e04ee15b6450

### Technologies utilisées
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn-ui
- Supabase (Backend as a Service)
- TanStack Query (State management)

### Déploiement
Ouvrir [Lovable](https://lovable.dev/projects/fa7ed0fd-5766-4146-8a09-e04ee15b6450) → Share → Publish

### Domaine personnalisé  
Project > Settings > Domains → Connect Domain
[Guide détaillé](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

*Ce README sera mis à jour au fur et à mesure du développement des nouvelles features.*
