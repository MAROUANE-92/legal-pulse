
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const EmptyState = () => {
  return (
    <Card className="rounded-2xl shadow-sm border-divider-gray-300">
      <CardContent className="py-16 px-8 text-center">
        <div className="max-w-md mx-auto">
          {/* Balance scale illustration */}
          <div className="w-24 h-24 mx-auto mb-6 opacity-40">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-full h-full text-muted-foreground"
            >
              <path d="M12 3v18" />
              <path d="M8 6l4-3 4 3" />
              <path d="M8 21l4-3 4 3" />
              <path d="M2 12h20" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="12" r="3" />
              <path d="M6 9v6" />
              <path d="M18 9v6" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-main mb-2">
            Aucun dossier pour le moment
          </h3>
          
          <p className="text-muted-foreground mb-6">
            Commencez par créer votre premier dossier contentieux pour organiser vos affaires juridiques.
          </p>
          
          <Button 
            className="bg-primary hover:bg-primary-dark transition-colors"
            size="lg"
          >
            Créer mon premier dossier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
