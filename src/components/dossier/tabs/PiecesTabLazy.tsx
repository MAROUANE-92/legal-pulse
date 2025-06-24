
import React from 'react';
import { PiecesTab } from '../PiecesTab';
import { useParams } from 'react-router-dom';

const PiecesTabLazy = () => {
  const { id } = useParams<{ id: string }>();
  
  return <PiecesTab dossierId={id || ''} />;
};

export default PiecesTabLazy;
