
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useDossier } from './DossierLayout';
import { toast } from '@/hooks/use-toast';

export const DossierHeaderSticky = () => {
  const { dossier, loading } = useDossier();

  const handleDeposerRPVA = () => {
    toast({
      title: "Dépôt RPVA",
      description: "Dépôt simulé OK",
    });
  };

  if (loading || !dossier) {
    return (
      <div className="sticky top-0 bg-white border-b z-50">
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 bg-white border-b z-50 shadow-sm">
      <div className="container mx-auto p-6 space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dossiers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{dossier.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Info */}
        <div className="flex justify-between items-center" data-tour="dossier-name">
          <div>
            <h1 className="text-2xl font-bold text-main">{dossier.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              {dossier.stage}
            </Badge>
            <Button onClick={handleDeposerRPVA} className="bg-primary hover:bg-primary-dark">
              Déposer RPVA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
