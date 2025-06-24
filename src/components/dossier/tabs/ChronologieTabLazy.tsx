
import React from 'react';
import { ChronologieTab } from '../ChronologieTab';
import { useParams } from 'react-router-dom';

const ChronologieTabLazy = () => {
  const { id } = useParams<{ id: string }>();
  
  return <ChronologieTab dossierId={id || ''} />;
};

export default ChronologieTabLazy;
