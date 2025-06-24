
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { IngestProvider } from "./lib/IngestStore";
import Index from "./pages/Index";
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
    <IngestProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Demo route (no layout) */}
            <Route path="/demo-inbox" element={<InboxDemo />} />
            
            {/* Client Portal Routes (no layout) */}
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
            
            {/* Dossier Demo (no layout) */}
            <Route path="/dossier-demo/:id" element={<DossierDemo />} />
            
            {/* Main App Routes (with layout) */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/calendrier" element={<Calendrier />} />
                  <Route path="/parametres" element={<Parametres />} />
                  <Route path="/dossier/:id" element={<Dossier />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </IngestProvider>
  </QueryClientProvider>
);

export default App;
