
import React from 'react';
import { DossierLayout } from '@/components/dossier/DossierLayout';
import { DossierHeaderSticky } from '@/components/dossier/DossierHeaderSticky';
import { DossierTabsProvider, TabPanel } from '@/components/dossier/DossierTabsProvider';
import { ConstructionPage } from '@/components/dossier/ConstructionPage';
import { TourProvider } from '@/components/dossier/TourProvider';
import { UserTour } from '@/components/dossier/UserTour';

const SynthesisOverview = React.lazy(() => import('@/components/dossier/SynthesisOverview'));
const AnalyseTrimTab = React.lazy(() => import('@/components/dossier/AnalyseTrimTab'));

const Dossier = () => {
  return (
    <TourProvider>
      <DossierLayout>
        <DossierHeaderSticky />
        
        <DossierTabsProvider defaultTab="synth">
          <TabPanel name="synth">
            <div data-tour="synthesis">
              <SynthesisOverview />
            </div>
          </TabPanel>
          
          <TabPanel name="analyse">
            <AnalyseTrimTab />
          </TabPanel>
          
          <TabPanel name="pieces">
            <ConstructionPage 
              title="Pièces du dossier" 
              subtitle="Gestion des documents et pièces justificatives"
            />
          </TabPanel>
          
          <TabPanel name="chronologie">
            <ConstructionPage 
              title="Chronologie du dossier" 
              subtitle="Timeline des événements et procédures"
            />
          </TabPanel>
          
          <TabPanel name="taches">
            <ConstructionPage 
              title="Tâches et suivi" 
              subtitle="Gestion des tâches et échéances"
            />
          </TabPanel>
          
          <TabPanel name="discussions">
            <ConstructionPage 
              title="Discussions" 
              subtitle="Échanges avec le client et correspondance"
            />
          </TabPanel>
          
          <TabPanel name="rpva">
            <ConstructionPage 
              title="RPVA" 
              subtitle="Réseau Privé Virtuel des Avocats"
            />
          </TabPanel>
        </DossierTabsProvider>
        
        <UserTour />
      </DossierLayout>
    </TourProvider>
  );
};

export default Dossier;
