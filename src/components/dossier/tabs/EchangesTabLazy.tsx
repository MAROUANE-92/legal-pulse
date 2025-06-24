
import React from 'react';
import { EchangesTab } from '../EchangesTab';
import { useParams } from 'react-router-dom';

const EchangesTabLazy = () => {
  const { id } = useParams<{ id: string }>();
  
  return <EchangesTab dossierId={id || ''} />;
};

export default EchangesTabLazy;
