import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthAPI } from '@/shared/api/auth';

// Pages avocat
import Dashboard from './Dashboard';
import DossierView from './DossierView';
import DossierList from './DossierList';
import Login from './Login';

// Layout avocat
import LawyerLayout from './LawyerLayout';

function LawyerApp() {
  const isAuthenticated = AuthAPI.isLawyerAuthenticated();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <LawyerLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="/dossiers" element={<DossierList />} />
        <Route path="/dossier/:id" element={<DossierView />} />
        <Route path="/calendrier" element={<div>Calendrier - Coming Soon</div>} />
        <Route path="/parametres" element={<div>Paramètres - Coming Soon</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LawyerLayout>
  );
}

export default LawyerApp;