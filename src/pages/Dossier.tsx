
import React from 'react';
import { DossierLayout } from '@/components/dossier/DossierLayout';
import { DossierHeaderSticky } from '@/components/dossier/DossierHeaderSticky';

const Dossier = () => {
  return (
    <DossierLayout>
      <DossierHeaderSticky />
      
      <div className="container mx-auto p-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-4">
            (Placeholder) - Contenu du dossier à venir
          </p>
          <p className="text-sm text-gray-500">
            Les détails du dossier seront développés ici.
          </p>
        </div>
      </div>
    </DossierLayout>
  );
};

export default Dossier;
