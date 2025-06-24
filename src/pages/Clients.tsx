
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Eye, UserPlus, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Clients = () => {
  // Mock clients data (different from dossiers)
  const mockClients = [
    {
      id: "marouane-e",
      nom: "Marouane E.",
      email: "marouane.e@email.com",
      telephone: "06 12 34 56 78",
      dossiersCount: 1,
      status: "Actif"
    },
    {
      id: "martin-d",
      nom: "Martin D.",
      email: "martin.d@email.com",
      telephone: "06 87 65 43 21",
      dossiersCount: 1,
      status: "Actif"
    },
    {
      id: "sophie-l",
      nom: "Sophie L.",
      email: "sophie.l@email.com",
      telephone: "06 11 22 33 44",
      dossiersCount: 2,
      status: "Inactif"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Gérez votre base de données clients</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClients.length}</div>
            <p className="text-xs text-muted-foreground">
              Clients actifs et inactifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClients.filter(c => c.status === "Actif").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Avec dossiers en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Portail Client</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Tester l'interface client
            </p>
            <Link to="/client/test-token/welcome">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Voir portail client
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Liste des clients</h2>
        <div className="grid gap-4">
          {mockClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {client.nom.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{client.nom}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {client.telephone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        client.status === "Actif"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {client.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {client.dossiersCount} dossier{client.dossiersCount > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clients;
