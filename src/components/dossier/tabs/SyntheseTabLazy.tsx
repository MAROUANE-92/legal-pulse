
import React from 'react';
import { SyntheseTab } from '../SyntheseTab';
import { useDossier } from '../DossierLayout';

const SyntheseTabLazy = () => {
  const { dossier } = useDossier();
  
  if (!dossier) return null;
  
  return <SyntheseTab dossier={dossier} />;
};

export default SyntheseTabLazy;
