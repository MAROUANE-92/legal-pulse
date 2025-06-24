
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LawyerLayout from '@/layouts/LawyerLayout';
import { mockDossiers } from '@/lib/mockDossiers';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DossierDemo = () => {
  const { id } = useParams<{ id: string }>();
  const dossier = mockDossiers.find((d) => d.id === id);
  
  if (!dossier) {
    return (
      <LawyerLayout title="Dossier introuvable">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Dossier introuvable.</p>
          <Link to="/clients">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Revenir à la liste
            </Button>
          </Link>
        </div>
      </LawyerLayout>
    );
  }

  return (
    <LawyerLayout title={`${dossier.client} vs ${dossier.adversaire}`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Informations du dossier</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-medium">{dossier.client}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Adversaire</p>
              <p className="font-medium">{dossier.adversaire}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Motifs</p>
              <p className="font-medium">{dossier.motifs.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <span
                className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                  dossier.status === "Collecte en cours"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {dossier.status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-4">
            (Placeholder) - Ici s'afficheront : Synthèse, Chronologie, Pièces, Conclusions…
          </p>
          <p className="text-sm text-gray-500">
            Cette page sera développée avec les onglets détaillés du dossier.
          </p>
        </div>
      </div>
    </LawyerLayout>
  );
};

export default DossierDemo;
