
import React from 'react';
import { ConclusionsTab } from '../ConclusionsTab';
import { useParams } from 'react-router-dom';

const ConclusionsTabLazy = () => {
  const { id } = useParams<{ id: string }>();
  
  return <ConclusionsTab dossierId={id || ''} />;
};

export default ConclusionsTabLazy;
