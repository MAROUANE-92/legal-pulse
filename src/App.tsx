
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import Calendrier from "./pages/Calendrier";
import Parametres from "./pages/Parametres";
import Dossier from "./pages/Dossier";
import ClientPortal from "./pages/ClientPortal";
import ClientWizard from "./pages/ClientWizard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Client Portal Routes (no layout) */}
          <Route path="/client/:token" element={<Navigate to="/client/:token/welcome" replace />} />
          <Route path="/client/:token/:step" element={<ClientWizard />} />
          
          {/* Legacy client portal routes - redirect to wizard */}
          <Route path="/client/:token/upload" element={<Navigate to="/client/:token/upload" replace />} />
          <Route path="/client/:token/progress" element={<Navigate to="/client/:token/upload" replace />} />
          
          {/* Main App Routes (with layout) */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/calendrier" element={<Calendrier />} />
                <Route path="/parametres" element={<Parametres />} />
                <Route path="/dossier/:id" element={<Dossier />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
