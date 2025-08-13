
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LawyerLayout from '@/layouts/LawyerLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DossierDemo = () => {
  const { id } = useParams<{ id: string }>();
  
  // Plus de données mockées
  const dossier = null;
  
  // Plus de données mockées - Page simplifiée
  return (
    <LawyerLayout title="Demo Dossier">
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Les données mockées ont été supprimées.</p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Revenir au tableau de bord
          </Button>
        </Link>
      </div>
    </LawyerLayout>
  );

};

export default DossierDemo;
