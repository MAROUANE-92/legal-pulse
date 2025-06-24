
import { Progress } from '@/components/ui/progress';
import { ClientStepBar } from './client/ClientStepBar';

interface LayoutClientProps {
  children: React.ReactNode;
  progressPct?: number;
  dossierName?: string;
  showStepBar?: boolean;
}

export const LayoutClient = ({ 
  children, 
  progressPct = 0, 
  dossierName = "Votre dossier",
  showStepBar = true 
}: LayoutClientProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/52561914-7132-4666-921a-bdf940b22fca.png" 
                alt="LegalPulse" 
                className="w-10 h-10"
              />
              <div>
                <p className="text-xs text-gray-500">Portail Client</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{dossierName}</p>
                <p className="text-xs text-gray-500">{progressPct}% complété</p>
              </div>
              <div className="w-24">
                <Progress value={progressPct} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Step Navigation Bar */}
      {showStepBar && <ClientStepBar />}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
