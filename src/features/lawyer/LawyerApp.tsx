import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import DossierList from './DossierList';
import DossierView from './DossierView';
import NewDossier from './NewDossier';
import Login from './Login';
import LawyerLayout from './LawyerLayout';
import { LawyerAuthProvider, useLawyerAuth } from '@/contexts/LawyerAuthContext';

function LawyerAppContent() {
  const { user, loading } = useLawyerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <LawyerLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="/nouveau" element={<NewDossier />} />
        <Route path="/dossiers" element={<DossierList />} />
        <Route path="/dossier/:id" element={<DossierView />} />
        <Route path="/calendrier" element={<div>Calendrier - Coming Soon</div>} />
        <Route path="/parametres" element={<div>Paramètres - Coming Soon</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LawyerLayout>
  );
}

function LawyerApp() {
  return (
    <LawyerAuthProvider>
      <LawyerAppContent />
    </LawyerAuthProvider>
  );
}

export default LawyerApp;