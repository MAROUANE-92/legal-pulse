
import React from 'react';
import { TourProvider as ReactTourProvider } from '@reactour/tour';

const tourSteps = [
  {
    selector: '[data-tour="dossier-name"]',
    content: (
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">Nom du dossier</h3>
        <p className="text-sm text-gray-600">
          Ici vous trouvez le nom du dossier et son statut actuel. Vous pouvez également déposer des documents via RPVA.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="tabs"]',
    content: (
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">Navigation par onglets</h3>
        <p className="text-sm text-gray-600">
          Naviguez entre les différentes sections : Synthèse, Analyse, Pièces, Chronologie, Tâches, Discussions et RPVA.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="synthesis"]',
    content: (
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">Synthèse du dossier</h3>
        <p className="text-sm text-gray-600">
          Vue d'ensemble avec les informations clés : cadre contractuel, motifs de réclamation, risques et chances.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="analyse-tab"]',
    content: (
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">Analyse détaillée</h3>
        <p className="text-sm text-gray-600">
          Cliquez sur l'onglet Analyse pour accéder aux calculs détaillés et à l'analyse juridique du dossier.
        </p>
      </div>
    ),
  },
];

interface TourProviderProps {
  children: React.ReactNode;
}

export const TourProvider = ({ children }: TourProviderProps) => {
  return (
    <ReactTourProvider
      steps={tourSteps}
      defaultOpen={false}
      className="max-w-sm"
      styles={{
        popover: (base) => ({
          ...base,
          '--reactour-accent': '#8b5cf6',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        }),
        maskArea: (base) => ({ ...base, rx: 8 }),
        badge: (base) => ({
          ...base,
          backgroundColor: '#8b5cf6',
        }),
      }}
      onClickMask={({ setIsOpen }) => setIsOpen(false)}
    >
      {children}
    </ReactTourProvider>
  );
};
