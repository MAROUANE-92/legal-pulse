
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Eye, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import LawyerLayout from '@/layouts/LawyerLayout';
import { mockDossiers } from '@/lib/mockDossiers';

const Clients = () => {
  return (
    <LawyerLayout title="Dossiers clients">
      <div className="space-y-6">
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
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                +12% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                +5% par rapport au mois dernier
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

        {/* Dossiers Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Dossiers clients</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDossiers.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border bg-white p-6 flex flex-col gap-3 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-purple-600" />
                  <h2 className="font-medium">
                    {d.client} <span className="text-gray-500">vs</span> {d.adversaire}
                  </h2>
                </div>
                <p className="text-xs text-gray-600">
                  Motifs : {d.motifs.join(", ")}
                </p>
                <p className="text-xs text-gray-500">Mis à jour : {d.updated}</p>
                <span
                  className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                    d.status === "Collecte en cours"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {d.status}
                </span>
                <Link
                  to={`/dossier-demo/${d.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-purple-600 hover:underline text-sm"
                >
                  Ouvrir le dossier
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LawyerLayout>
  );
};

export default Clients;
