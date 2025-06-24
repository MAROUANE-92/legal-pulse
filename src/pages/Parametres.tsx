
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const Parametres = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Configurez votre application</p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Profil utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <Input defaultValue="Maître Example" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input defaultValue="maitre.example@barreau.fr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barreau
                  </label>
                  <Input defaultValue="Barreau de Paris" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro TOQUE
                  </label>
                  <Input defaultValue="T0123" />
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notifications push</h4>
                  <p className="text-sm text-gray-600">Recevez des alertes pour les échéances</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Sauvegarde automatique</h4>
                  <p className="text-sm text-gray-600">Sauvegarde vos modifications automatiquement</p>
                </div>
                <Switch 
                  checked={autoSave} 
                  onCheckedChange={setAutoSave}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Mode sombre</h4>
                  <p className="text-sm text-gray-600">Utilisez le thème sombre</p>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Version</span>
                <Badge variant="secondary">1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Dernière mise à jour</span>
                <span className="text-sm text-gray-900">24 juin 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Statut</span>
                <Badge className="bg-green-100 text-green-800">Connecté</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  Exporter les données
                </Button>
                <Button variant="outline">
                  Importer des dossiers
                </Button>
                <Button variant="outline">
                  Sauvegarder
                </Button>
                <Button variant="destructive">
                  Réinitialiser l'application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
