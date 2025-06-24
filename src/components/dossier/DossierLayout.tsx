import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dossier } from '@/types/dossier';

interface DossierContextType {
  dossier: Dossier | null;
  loading: boolean;
  error: string | null;
}

const DossierContext = createContext<DossierContextType>({
  dossier: null,
  loading: true,
  error: null
});

export const useDossier = () => useContext(DossierContext);

interface DossierLayoutProps {
  children: React.ReactNode;
}

// Mock data - updated with new name
const mockDossier = {
  id: '1',
  name: 'Marouane vs. Mordor',
  stage: 'Rédaction' as const,
  nextDeadline: '2024-07-15',
  progressPct: 65,
  client: 'Marouane E.',
  employeur: 'Mordor Corporation',
  ccn: 'Convention Collective Métallurgie',
  montantReclame: 45000,
  prochaineAudience: '2024-08-20'
};

export const DossierLayout = ({ children }: DossierLayoutProps) => {
  const { id } = useParams<{ id: string }>();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        console.log(`Fetching dossier ${id}`);
        // Mock API call - replace with real endpoint
        await new Promise(resolve => setTimeout(resolve, 500));
        setDossier(mockDossier as Dossier);
      } catch (err) {
        setError('Erreur lors du chargement du dossier');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDossier();
    }
  }, [id]);

  return (
    <DossierContext.Provider value={{ dossier, loading, error }}>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </DossierContext.Provider>
  );
};
