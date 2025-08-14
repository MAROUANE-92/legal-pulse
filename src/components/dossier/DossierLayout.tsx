import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dossier } from '@/types/dossier';
import { supabase } from '@/integrations/supabase/client';

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

// Plus de données mockées - on utilise les vraies données de la base

export const DossierLayout = ({ children }: DossierLayoutProps) => {
  const { id } = useParams<{ id: string }>();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        console.log(`Fetching dossier ${id}`);
        
        // Récupérer le vrai dossier depuis la base de données
        const { data: dossierData, error } = await supabase
          .from('dossiers')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!dossierData) {
          setError('Dossier non trouvé');
          return;
        }

        // Transformer les données pour correspondre au type Dossier
        const transformedDossier: Dossier = {
          id: dossierData.id,
          name: `Dossier ${dossierData.client_name || dossierData.client_email}`,
          client: dossierData.client_name || dossierData.client_email,
          employeur: 'À compléter', // Sera rempli par les données du formulaire
          stage: dossierData.status === 'pending' ? 'Découverte' : 'Rédaction',
          nextDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          progressPct: dossierData.status === 'pending' ? 10 : 50,
          ccn: 'À compléter',
          montantReclame: 0, // Calculé depuis les motifs
          prochaineAudience: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };

        setDossier(transformedDossier);
      } catch (err) {
        console.error('Error fetching dossier:', err);
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
