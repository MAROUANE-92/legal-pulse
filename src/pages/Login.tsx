
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans LegalPulse",
        });
        navigate('/');
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Nom d'utilisateur ou mot de passe incorrect",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Logo and citation */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/52561914-7132-4666-921a-bdf940b22fca.png" 
              alt="LegalPulse" 
              className="mx-auto h-48 w-48 mb-8"
            />
          </div>
          <h1 className="text-6xl font-bold mb-8 text-gray-900">LegalPulse</h1>
          <div className="border-t border-gray-300 pt-8 mt-8">
            <p className="text-3xl font-light italic tracking-wide text-gray-700">Refacere ius</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-800">Se connecter</CardTitle>
              <CardDescription className="text-gray-600">
                Entrez vos identifiants pour accéder à l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="username" className="text-gray-700 font-medium">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-2 h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-2 h-12"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
