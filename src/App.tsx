
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Import des apps séparées
import LawyerApp from './features/lawyer/LawyerApp';
import ClientWizard from './pages/ClientWizard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Composant pour rediriger vers identity (étape 0 - nouveau questionnaire)
function ClientRedirect() {
  const { token } = useParams();
  return <Navigate to={`/client/${token}/welcome`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Routes client avec paramètres */}
          <Route path="/client/:token/:step" element={<ClientWizard />} />
          <Route path="/client/:token" element={<ClientRedirect />} />
          <Route path="/access" element={<div>Access page - Coming Soon</div>} />
          <Route path="/form/*" element={<div>Form page - Coming Soon</div>} />
          
          {/* Routes avocat (toutes les autres) */}
          <Route path="/*" element={<LawyerApp />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
