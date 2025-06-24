
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold text-main mb-4">404</h1>
      <p className="text-muted-foreground mb-6">Page non trouvée</p>
      <Link to="/">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  );
};

export default NotFound;
