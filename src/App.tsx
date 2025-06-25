
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { IngestProvider } from "./lib/IngestStore";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Calendrier from "./pages/Calendrier";
import Parametres from "./pages/Parametres";
import Dossier from "./pages/Dossier";
import DossierDemo from "./pages/DossierDemo";
import ClientPortal from "./pages/ClientPortal";
import ClientWizard from "./pages/ClientWizard";
import InboxDemo from "./pages/InboxDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <IngestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Page de connexion */}
              <Route path="/login" element={<Login />} />
              
              {/* Demo route (no auth required) */}
              <Route path="/demo-inbox" element={<InboxDemo />} />
              
              {/* Client Portal Routes (no auth required for clients) */}
              <Route path="/client/:token" element={<Navigate to="/client/:token/welcome" replace />} />
              <Route path="/client/:token/welcome" element={<ClientWizard />} />
              <Route path="/client/:token/identity" element={<ClientWizard />} />
              <Route path="/client/:token/motifs" element={<ClientWizard />} />
              <Route path="/client/:token/questions" element={<ClientWizard />} />
              <Route path="/client/:token/upload" element={<ClientWizard />} />
              <Route path="/client/:token/signature" element={<ClientWizard />} />
              <Route path="/client/:token/confirm" element={<ClientWizard />} />
              
              {/* Legacy client portal */}
              <Route path="/client/:token/portal" element={<ClientPortal />} />
              
              {/* Dossier Demo (no auth required) */}
              <Route path="/dossier-demo/:id" element={<DossierDemo />} />
              
              {/* Protected Main App Routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/calendrier" element={<Calendrier />} />
                      <Route path="/parametres" element={<Parametres />} />
                      <Route path="/dossier/:id" element={<Dossier />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </IngestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
