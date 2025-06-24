
import React from 'react';
import { DossierLayout } from '@/components/dossier/DossierLayout';
import { DossierHeaderSticky } from '@/components/dossier/DossierHeaderSticky';
import { DossierTabsProvider, TabPanel } from '@/components/dossier/DossierTabsProvider';
import SyntheseTabLazy from '@/components/dossier/tabs/SyntheseTabLazy';

const Dossier = () => {
  return (
    <DossierLayout>
      <DossierHeaderSticky />
      
      <DossierTabsProvider defaultTab="synth">
        <TabPanel name="synth">
          <SyntheseTabLazy />
        </TabPanel>
        
        <TabPanel name="pieces">
          <div className="p-6">
            <p className="text-gray-600">Onglet Pièces - À développer</p>
          </div>
        </TabPanel>
        
        <TabPanel name="chronologie">
          <div className="p-6">
            <p className="text-gray-600">Onglet Chronologie - À développer</p>
          </div>
        </TabPanel>
        
        <TabPanel name="taches">
          <div className="p-6">
            <p className="text-gray-600">Onglet Tâches - À développer</p>
          </div>
        </TabPanel>
        
        <TabPanel name="discussions">
          <div className="p-6">
            <p className="text-gray-600">Onglet Discussions - À développer</p>
          </div>
        </TabPanel>
        
        <TabPanel name="rpva">
          <div className="p-6">
            <p className="text-gray-600">Onglet RPVA - À développer</p>
          </div>
        </TabPanel>
      </DossierTabsProvider>
    </DossierLayout>
  );
};

export default Dossier;
