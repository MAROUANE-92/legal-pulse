
import React, { Suspense } from 'react';
import { DossierLayout } from '@/components/dossier/DossierLayout';
import { DossierHeaderSticky } from '@/components/dossier/DossierHeaderSticky';
import { DossierTabsProvider, TabPanel } from '@/components/dossier/DossierTabsProvider';

// Lazy imports for tabs
const SyntheseTabLazy = React.lazy(() => import('@/components/dossier/tabs/SyntheseTabLazy'));
const PiecesTabLazy = React.lazy(() => import('@/components/dossier/tabs/PiecesTabLazy'));
const ChronologieTabLazy = React.lazy(() => import('@/components/dossier/tabs/ChronologieTabLazy'));
const TasksTabLazy = React.lazy(() => import('@/components/dossier/tabs/TasksTabLazy'));
const EchangesTabLazy = React.lazy(() => import('@/components/dossier/tabs/EchangesTabLazy'));
const ConclusionsTabLazy = React.lazy(() => import('@/components/dossier/tabs/ConclusionsTabLazy'));

const Dossier = () => {
  return (
    <DossierLayout>
      <DossierHeaderSticky />
      
      <DossierTabsProvider defaultTab="synth">
        <TabPanel name="synth">
          <SyntheseTabLazy />
        </TabPanel>
        
        <TabPanel name="pieces">
          <PiecesTabLazy />
        </TabPanel>
        
        <TabPanel name="chronologie">
          <ChronologieTabLazy />
        </TabPanel>
        
        <TabPanel name="taches">
          <TasksTabLazy />
        </TabPanel>
        
        <TabPanel name="discussions">
          <EchangesTabLazy />
        </TabPanel>
        
        <TabPanel name="rpva">
          <ConclusionsTabLazy />
        </TabPanel>
      </DossierTabsProvider>
    </DossierLayout>
  );
};

export default Dossier;
