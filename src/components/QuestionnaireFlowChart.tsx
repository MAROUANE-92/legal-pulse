import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export function QuestionnaireFlowChart() {
  const downloadSVG = () => {
    const svg = document.getElementById('questionnaire-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'questionnaire-legalpulse-complet.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
    
    toast.success('Diagramme téléchargé');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Diagramme complet du questionnaire LegalPulse</CardTitle>
            <Button onClick={downloadSVG} className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger SVG
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-lg">
            <svg
              id="questionnaire-svg"
              width="1800"
              height="2400"
              viewBox="0 0 1800 2400"
              xmlns="http://www.w3.org/2000/svg"
              className="bg-white"
            >
              <defs>
                <style>
                  {`
                    .step-box { fill: #1e3a8a; stroke: #1e40af; stroke-width: 2; }
                    .conditional-box { fill: #f59e0b; stroke: #f97316; stroke-width: 2; }
                    .document-box { fill: #22c55e; stroke: #16a34a; stroke-width: 2; }
                    .question-box { fill: #e5e7eb; stroke: #6b7280; stroke-width: 1; }
                    .step-text { fill: white; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; }
                    .conditional-text { fill: white; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; }
                    .document-text { fill: white; font-family: Arial, sans-serif; font-size: 10px; }
                    .question-text { fill: #374151; font-family: Arial, sans-serif; font-size: 9px; }
                    .arrow { stroke: #374151; stroke-width: 2; marker-end: url(#arrowhead); }
                    .conditional-arrow { stroke: #f59e0b; stroke-width: 2; marker-end: url(#arrowhead); }
                  `}
                </style>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                </marker>
              </defs>

              {/* Titre principal */}
              <text x="900" y="30" textAnchor="middle" className="step-text" fontSize="16">
                LegalPulse - Questionnaire Client Complet
              </text>
              <text x="900" y="50" textAnchor="middle" className="question-text" fontSize="12">
                Légende: 🔵 Étapes obligatoires | 🟡 Blocs conditionnels | 🟢 Documents attendus
              </text>

              {/* ÉTAPE 1: ACCUEIL */}
              <rect x="50" y="80" width="200" height="60" className="step-box" rx="5" />
              <text x="150" y="100" textAnchor="middle" className="step-text">ÉTAPE 1: ACCUEIL</text>
              <text x="150" y="115" textAnchor="middle" className="step-text">Présentation</text>
              <text x="150" y="130" textAnchor="middle" className="step-text">Token validation</text>

              {/* ÉTAPE 2: IDENTITÉ */}
              <rect x="50" y="170" width="200" height="120" className="step-box" rx="5" />
              <text x="150" y="190" textAnchor="middle" className="step-text">ÉTAPE 2: IDENTITÉ</text>
              <text x="60" y="210" className="question-text">• Nom & prénom *</text>
              <text x="60" y="225" className="question-text">• Date de naissance *</text>
              <text x="60" y="240" className="question-text">• Adresse complète *</text>
              <text x="60" y="255" className="question-text">• Téléphone perso *</text>
              <text x="60" y="270" className="question-text">• Email personnel *</text>
              <text x="60" y="285" className="question-text">• Situation familiale *</text>

              <rect x="280" y="190" width="180" height="80" className="document-box" rx="3" />
              <text x="370" y="210" textAnchor="middle" className="document-text">Documents:</text>
              <text x="290" y="225" className="document-text">• Justificatif domicile</text>
              <text x="290" y="240" className="document-text">  &lt; 3 mois (si adresse)</text>
              <text x="290" y="255" className="document-text">• Pièce d'identité</text>

              {/* ÉTAPE 3: ENTREPRISE */}
              <rect x="50" y="320" width="200" height="100" className="step-box" rx="5" />
              <text x="150" y="340" textAnchor="middle" className="step-text">ÉTAPE 3: ENTREPRISE</text>
              <text x="60" y="360" className="question-text">• Nom employeur *</text>
              <text x="60" y="375" className="question-text">• SIREN *</text>
              <text x="60" y="390" className="question-text">• Secteur d'activité</text>
              <text x="60" y="405" className="question-text">• Effectif entreprise</text>

              {/* ÉTAPE 4: CONTRAT */}
              <rect x="50" y="450" width="200" height="140" className="step-box" rx="5" />
              <text x="150" y="470" textAnchor="middle" className="step-text">ÉTAPE 4: CONTRAT</text>
              <text x="60" y="490" className="question-text">• Type contrat *</text>
              <text x="60" y="505" className="question-text">• Date début *</text>
              <text x="60" y="520" className="question-text">• Date fin (si CDD)</text>
              <text x="60" y="535" className="question-text">• Poste occupé *</text>
              <text x="60" y="550" className="question-text">• IDCC / Convention *</text>
              <text x="60" y="565" className="question-text">• Statut cadre *</text>
              <text x="60" y="580" className="question-text">• Clause forfait</text>

              <rect x="280" y="470" width="180" height="100" className="document-box" rx="3" />
              <text x="370" y="490" textAnchor="middle" className="document-text">Documents:</text>
              <text x="290" y="505" className="document-text">• Contrat travail.pdf *</text>
              <text x="290" y="520" className="document-text">• Avenants.zip</text>
              <text x="290" y="535" className="document-text">• Convention collective</text>
              <text x="290" y="550" className="document-text">• Fiches de poste</text>

              {/* ÉTAPE 5: RÉMUNÉRATION */}
              <rect x="50" y="620" width="200" height="120" className="step-box" rx="5" />
              <text x="150" y="640" textAnchor="middle" className="step-text">ÉTAPE 5: RÉMUNÉRATION</text>
              <text x="60" y="660" className="question-text">• Salaire brut mensuel *</text>
              <text x="60" y="675" className="question-text">• Primes fixes/variables *</text>
              <text x="60" y="690" className="question-text">• Avantages en nature</text>
              <text x="60" y="705" className="question-text">• 13ème mois</text>
              <text x="60" y="720" className="question-text">• Frais remboursés</text>

              <rect x="280" y="640" width="180" height="80" className="document-box" rx="3" />
              <text x="370" y="660" textAnchor="middle" className="document-text">Documents:</text>
              <text x="290" y="675" className="document-text">• Bulletins de paie *</text>
              <text x="290" y="690" className="document-text">• Plan commissions.pdf</text>
              <text x="290" y="705" className="document-text">• Notes frais.pdf</text>

              {/* ÉTAPE 6: TEMPS DE TRAVAIL */}
              <rect x="50" y="770" width="200" height="120" className="step-box" rx="5" />
              <text x="150" y="790" textAnchor="middle" className="step-text">ÉTAPE 6: TEMPS TRAVAIL</text>
              <text x="60" y="810" className="question-text">• Régime horaire *</text>
              <text x="60" y="825" className="question-text">• Horaires réels moyens</text>
              <text x="60" y="840" className="question-text">• Badgeage/pointeuse</text>
              <text x="60" y="855" className="question-text">• Télétravail partiel</text>
              <text x="60" y="870" className="question-text">• Heures supp régulières</text>

              <rect x="280" y="790" width="180" height="80" className="document-box" rx="3" />
              <text x="370" y="810" textAnchor="middle" className="document-text">Documents:</text>
              <text x="290" y="825" className="document-text">• Exports badge.csv</text>
              <text x="290" y="840" className="document-text">• Planning réel.xlsx</text>
              <text x="290" y="855" className="document-text">• Accord temps travail</text>

              {/* ÉTAPE 7: MOTIFS */}
              <rect x="50" y="920" width="200" height="100" className="step-box" rx="5" />
              <text x="150" y="940" textAnchor="middle" className="step-text">ÉTAPE 7: MOTIFS</text>
              <text x="60" y="960" className="question-text">• Heures supplémentaires</text>
              <text x="60" y="975" className="question-text">• Licenciement abusif</text>
              <text x="60" y="990" className="question-text">• Harcèlement</text>
              <text x="60" y="1005" className="question-text">• Autres motifs...</text>

              {/* BLOCS CONDITIONNELS */}
              
              {/* BLOC HEURES SUPPLÉMENTAIRES */}
              <rect x="500" y="920" width="250" height="160" className="conditional-box" rx="5" />
              <text x="625" y="940" textAnchor="middle" className="conditional-text">BLOC HEURES SUPP</text>
              <text x="625" y="955" textAnchor="middle" className="conditional-text">(si motif sélectionné)</text>
              <text x="510" y="975" className="question-text">• Clause forfait-jours ? *</text>
              <text x="510" y="990" className="question-text">• Nb jours forfait/an</text>
              <text x="510" y="1005" className="question-text">• Heures au-delà 35h/sem *</text>
              <text x="510" y="1020" className="question-text">• Système badgeage ? *</text>
              <text x="510" y="1035" className="question-text">• E-mails après 20h ?</text>
              <text x="510" y="1050" className="question-text">• Horaire réel moyen *</text>

              <rect x="780" y="940" width="180" height="120" className="document-box" rx="3" />
              <text x="870" y="960" textAnchor="middle" className="document-text">Documents:</text>
              <text x="790" y="975" className="document-text">• Badge.csv/pointeuse.pdf</text>
              <text x="790" y="990" className="document-text">• Emails tardifs.zip</text>
              <text x="790" y="1005" className="document-text">• Planning excel.xlsx</text>
              <text x="790" y="1020" className="document-text">• Journaux appels.csv</text>
              <text x="790" y="1035" className="document-text">• Teams/Slack logs</text>

              {/* BLOC LICENCIEMENT */}
              <rect x="500" y="1100" width="250" height="140" className="conditional-box" rx="5" />
              <text x="625" y="1120" textAnchor="middle" className="conditional-text">BLOC LICENCIEMENT</text>
              <text x="625" y="1135" textAnchor="middle" className="conditional-text">(si motif sélectionné)</text>
              <text x="510" y="1155" className="question-text">• Date convocation EP *</text>
              <text x="510" y="1170" className="question-text">• Date entretien préalable *</text>
              <text x="510" y="1185" className="question-text">• Date notification *</text>
              <text x="510" y="1200" className="question-text">• Motif invoqué *</text>
              <text x="510" y="1215" className="question-text">• Solde tout compte signé *</text>

              <rect x="780" y="1120" width="180" height="100" className="document-box" rx="3" />
              <text x="870" y="1140" textAnchor="middle" className="document-text">Documents:</text>
              <text x="790" y="1155" className="document-text">• Convocation.pdf *</text>
              <text x="790" y="1170" className="document-text">• PV entretien.pdf *</text>
              <text x="790" y="1185" className="document-text">• Lettre licenciement.pdf *</text>
              <text x="790" y="1200" className="document-text">• Solde tout compte.pdf *</text>

              {/* BLOC HARCÈLEMENT */}
              <rect x="500" y="1260" width="250" height="120" className="conditional-box" rx="5" />
              <text x="625" y="1280" textAnchor="middle" className="conditional-text">BLOC HARCÈLEMENT</text>
              <text x="625" y="1295" textAnchor="middle" className="conditional-text">(si motif sélectionné)</text>
              <text x="510" y="1315" className="question-text">• Nature des faits *</text>
              <text x="510" y="1330" className="question-text">• Description détaillée *</text>
              <text x="510" y="1345" className="question-text">• Nombre témoins *</text>
              <text x="510" y="1360" className="question-text">• Impact médical</text>

              <rect x="780" y="1280" width="180" height="80" className="document-box" rx="3" />
              <text x="870" y="1300" textAnchor="middle" className="document-text">Documents:</text>
              <text x="790" y="1315" className="document-text">• Preuves messages.zip</text>
              <text x="790" y="1330" className="document-text">• Certificats médicaux.pdf</text>
              <text x="790" y="1345" className="document-text">• Rapport CSE.pdf</text>

              {/* AUTRES BLOCS CONDITIONNELS */}
              <rect x="1000" y="920" width="220" height="100" className="conditional-box" rx="5" />
              <text x="1110" y="940" textAnchor="middle" className="conditional-text">BLOC CONGÉS NON PAYÉS</text>
              <text x="1010" y="960" className="question-text">• Jours CP/RTT non payés *</text>
              <text x="1010" y="975" className="question-text">• Refus injustifié ?</text>
              <text x="1010" y="995" className="document-text">Docs: Compteurs RH.pdf</text>

              <rect x="1000" y="1040" width="220" height="100" className="conditional-box" rx="5" />
              <text x="1110" y="1060" textAnchor="middle" className="conditional-text">BLOC DISCRIMINATION</text>
              <text x="1010" y="1080" className="question-text">• Critère protégé *</text>
              <text x="1010" y="1095" className="question-text">• Comparaison salaires</text>
              <text x="1010" y="1115" className="document-text">Docs: Tableau salaires.xlsx</text>

              <rect x="1000" y="1160" width="220" height="100" className="conditional-box" rx="5" />
              <text x="1110" y="1180" textAnchor="middle" className="conditional-text">BLOC ACCIDENT TRAVAIL</text>
              <text x="1010" y="1200" className="question-text">• Date accident *</text>
              <text x="1010" y="1215" className="question-text">• Déclaration CPAM ? *</text>
              <text x="1010" y="1235" className="document-text">Docs: Cerfa 14463.pdf</text>

              {/* ÉTAPE 8: QUESTIONS DYNAMIQUES */}
              <rect x="50" y="1050" width="200" height="80" className="step-box" rx="5" />
              <text x="150" y="1070" textAnchor="middle" className="step-text">ÉTAPE 8: QUESTIONS</text>
              <text x="150" y="1085" textAnchor="middle" className="step-text">DYNAMIQUES</text>
              <text x="60" y="1105" className="question-text">Questions générées selon</text>
              <text x="60" y="1120" className="question-text">les motifs sélectionnés</text>

              {/* ÉTAPE 9: DOMMAGES */}
              <rect x="50" y="1400" width="200" height="100" className="step-box" rx="5" />
              <text x="150" y="1420" textAnchor="middle" className="step-text">ÉTAPE 9: DOMMAGES</text>
              <text x="60" y="1440" className="question-text">• Préjudice financier</text>
              <text x="60" y="1455" className="question-text">• Préjudice moral</text>
              <text x="60" y="1470" className="question-text">• Calculs automatiques</text>
              <text x="60" y="1485" className="question-text">• Barème Macron</text>

              {/* ÉTAPE 10: CANAUX DE PREUVE */}
              <rect x="50" y="1530" width="200" height="100" className="step-box" rx="5" />
              <text x="150" y="1550" textAnchor="middle" className="step-text">ÉTAPE 10: CANAUX</text>
              <text x="150" y="1565" textAnchor="middle" className="step-text">DE PREUVE</text>
              <text x="60" y="1585" className="question-text">• Email, SMS, WhatsApp</text>
              <text x="60" y="1600" className="question-text">• Teams/Slack, Appels</text>
              <text x="60" y="1615" className="question-text">• Badge, Autres</text>

              <rect x="280" y="1550" width="180" height="60" className="document-box" rx="3" />
              <text x="370" y="1570" textAnchor="middle" className="document-text">Exports générés:</text>
              <text x="290" y="1585" className="document-text">• Archives selon canaux</text>
              <text x="290" y="1600" className="document-text">• Formats adaptés</text>

              {/* ÉTAPE 11: UPLOAD */}
              <rect x="50" y="1660" width="200" height="100" className="step-box" rx="5" />
              <text x="150" y="1680" textAnchor="middle" className="step-text">ÉTAPE 11: UPLOAD</text>
              <text x="60" y="1700" className="question-text">• Upload automatique</text>
              <text x="60" y="1715" className="question-text">• Validation pièces</text>
              <text x="60" y="1730" className="question-text">• Checklist dynamique</text>
              <text x="60" y="1745" className="question-text">• Persistance garantie</text>

              {/* ÉTAPE 12: CHRONOLOGIE */}
              <rect x="50" y="1790" width="200" height="80" className="step-box" rx="5" />
              <text x="150" y="1810" textAnchor="middle" className="step-text">ÉTAPE 12: CHRONOLOGIE</text>
              <text x="60" y="1830" className="question-text">• Timeline automatique</text>
              <text x="60" y="1845" className="question-text">• Événements clés</text>
              <text x="60" y="1860" className="question-text">• Validation dates</text>

              {/* ÉTAPE 13: RÉCAPITULATIF */}
              <rect x="50" y="1900" width="200" height="100" className="step-box" rx="5" />
              <text x="150" y="1920" textAnchor="middle" className="step-text">ÉTAPE 13: RÉCAPITULATIF</text>
              <text x="60" y="1940" className="question-text">• Synthèse complète</text>
              <text x="60" y="1955" className="question-text">• Relecture données</text>
              <text x="60" y="1970" className="question-text">• Modifications possibles</text>
              <text x="60" y="1985" className="question-text">• Validation finale</text>

              {/* ÉTAPE 14: SIGNATURE */}
              <rect x="50" y="2030" width="200" height="120" className="step-box" rx="5" />
              <text x="150" y="2050" textAnchor="middle" className="step-text">ÉTAPE 14: SIGNATURE</text>
              <text x="60" y="2070" className="question-text">• Mandat représentation *</text>
              <text x="60" y="2085" className="question-text">• Consentement RGPD *</text>
              <text x="60" y="2100" className="question-text">• Signature électronique *</text>
              <text x="60" y="2115" className="question-text">• Mode notification</text>
              <text x="60" y="2130" className="question-text">• Validation finale</text>

              {/* FLÈCHES DE NAVIGATION */}
              <line x1="150" y1="140" x2="150" y2="170" className="arrow" />
              <line x1="150" y1="290" x2="150" y2="320" className="arrow" />
              <line x1="150" y1="420" x2="150" y2="450" className="arrow" />
              <line x1="150" y1="590" x2="150" y2="620" className="arrow" />
              <line x1="150" y1="740" x2="150" y2="770" className="arrow" />
              <line x1="150" y1="890" x2="150" y2="920" className="arrow" />
              <line x1="150" y1="1020" x2="150" y2="1050" className="arrow" />
              <line x1="150" y1="1130" x2="150" y2="1400" className="arrow" />
              <line x1="150" y1="1500" x2="150" y2="1530" className="arrow" />
              <line x1="150" y1="1630" x2="150" y2="1660" className="arrow" />
              <line x1="150" y1="1760" x2="150" y2="1790" className="arrow" />
              <line x1="150" y1="1870" x2="150" y2="1900" className="arrow" />
              <line x1="150" y1="2000" x2="150" y2="2030" className="arrow" />

              {/* FLÈCHES CONDITIONNELLES */}
              <line x1="250" y1="970" x2="500" y2="970" className="conditional-arrow" />
              <line x1="250" y1="980" x2="500" y2="1170" className="conditional-arrow" />
              <line x1="250" y1="990" x2="500" y2="1320" className="conditional-arrow" />
              <line x1="250" y1="1000" x2="1000" y2="970" className="conditional-arrow" />
              <line x1="250" y1="1010" x2="1000" y2="1100" className="conditional-arrow" />

              {/* LÉGENDE */}
              <rect x="1300" y="80" width="450" height="200" fill="none" stroke="#6b7280" strokeWidth="1" rx="5" />
              <text x="1525" y="105" textAnchor="middle" className="step-text">LÉGENDE & STATISTIQUES</text>
              
              <rect x="1320" y="120" width="15" height="15" className="step-box" />
              <text x="1345" y="132" className="question-text">Étapes obligatoires (14 étapes)</text>
              
              <rect x="1320" y="140" width="15" height="15" className="conditional-box" />
              <text x="1345" y="152" className="question-text">Blocs conditionnels (6 blocs selon motifs)</text>
              
              <rect x="1320" y="160" width="15" height="15" className="document-box" />
              <text x="1345" y="172" className="question-text">Documents attendus (générés dynamiquement)</text>
              
              <text x="1320" y="195" className="question-text">• Questions totales: ~85 questions</text>
              <text x="1320" y="210" className="question-text">• Documents types: ~40 types</text>
              <text x="1320" y="225" className="question-text">• Persistance: Upload & FormData garantis</text>
              <text x="1320" y="240" className="question-text">• Validation: Toutes questions optionnelles (MVP)</text>
              <text x="1320" y="255" className="question-text">• Navigation: Bidirectionnelle avec sauvegarde</text>

              {/* PROCESSUS FINAL */}
              <rect x="1300" y="2030" width="450" height="120" fill="#f3f4f6" stroke="#6b7280" strokeWidth="1" rx="5" />
              <text x="1525" y="2055" textAnchor="middle" className="step-text">PROCESSUS POST-SIGNATURE</text>
              <text x="1320" y="2080" className="question-text">1. Génération automatique du dossier</text>
              <text x="1320" y="2095" className="question-text">2. Création chronologie exhaustive</text>
              <text x="1320" y="2110" className="question-text">3. Calcul dommages (heures supp, barème Macron)</text>
              <text x="1320" y="2125" className="question-text">4. Génération conclusions IA</text>
              <text x="1320" y="2140" className="question-text">5. Préparation dépôt RPVA en 1-clic</text>
            </svg>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Spécifications techniques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Architecture questionnaire</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>14 étapes obligatoires</strong> : Flux linéaire garantissant la collecte complète</li>
              <li><strong>6 blocs conditionnels</strong> : Activés selon les motifs sélectionnés</li>
              <li><strong>~85 questions totales</strong> : Réparties selon la logique métier</li>
              <li><strong>Persistance garantie</strong> : Upload et FormData sauvegardés à chaque étape</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Logique conditionnelle</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Les blocs s'activent dynamiquement selon <code>motifs_selected</code></li>
              <li>Questions dépendantes avec <code>show_if</code> et <code>dependsOn</code></li>
              <li>Documents générés automatiquement selon les réponses</li>
              <li>Navigation bidirectionnelle avec validation progressive</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Gestion des documents</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>~40 types de documents</strong> attendus selon le contexte</li>
              <li>Upload persistant avec <code>submissionId</code> unique</li>
              <li>Checklist dynamique générée selon les réponses</li>
              <li>Validation en temps réel et progression calculée</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}