
import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Import des apps séparées
import LawyerApp from './features/lawyer/LawyerApp';
import ClientWizard from './pages/ClientWizard'; // Keep existing client for now

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Composant qui détermine quelle app afficher
function AppRouter() {
  const location = useLocation();
  
  // Routes client : /client/*, /access, /form/*
  const isClientRoute = location.pathname.startsWith('/client') || 
                       location.pathname === '/access' ||
                       location.pathname.startsWith('/form');

  return isClientRoute ? <ClientWizard /> : <LawyerApp />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <AppRouter />
        <Toaster />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
