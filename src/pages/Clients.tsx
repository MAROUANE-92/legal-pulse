
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchBar } from '@/components/SearchBar';

const mockClients = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '01.23.45.67.89',
    company: 'SARL Dupont & Fils',
    activeFiles: 3,
    status: 'Actif'
  },
  {
    id: 2,
    name: 'Marie Martin',
    email: 'marie.martin@entreprise.fr',
    phone: '01.98.76.54.32',
    company: 'SAS Martin Industries',
    activeFiles: 1,
    status: 'Actif'
  },
  {
    id: 3,
    name: 'Pierre Durand',
    email: 'p.durand@gmail.com',
    phone: '06.12.34.56.78',
    company: 'Particulier',
    activeFiles: 0,
    status: 'Inactif'
  }
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Gérez votre base de données clients</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Nouveau client
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher un client..."
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total clients</p>
                  <p className="text-2xl font-bold text-gray-900">{mockClients.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Clients actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockClients.filter(c => c.status === 'Actif').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dossiers ouverts</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockClients.reduce((sum, c) => sum + c.activeFiles, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📁</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <Badge 
                        variant={client.status === 'Actif' ? 'default' : 'secondary'}
                        className={client.status === 'Actif' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {client.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1">{client.company}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                      <span>{client.email}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{client.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Dossiers actifs</p>
                      <p className="font-semibold text-gray-900">{client.activeFiles}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun client trouvé pour "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
