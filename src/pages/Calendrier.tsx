
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mockEvents = [
  {
    id: 1,
    title: 'Audience - Dossier Dupont',
    date: '2024-06-26',
    time: '14:00',
    type: 'Audience',
    location: 'Tribunal de Paris - Salle 12',
    urgent: true
  },
  {
    id: 2,
    title: 'Dépôt mémoire - Martin vs Tech Corp',
    date: '2024-06-27',
    time: '17:00',
    type: 'Échéance',
    location: 'Greffe',
    urgent: false
  },
  {
    id: 3,
    title: 'Rendez-vous client - Pierre Durand',
    date: '2024-06-28',
    time: '10:30',
    type: 'Rendez-vous',
    location: 'Cabinet',
    urgent: false
  },
  {
    id: 4,
    title: 'Formation - Nouveau droit du travail',
    date: '2024-06-30',
    time: '09:00',
    type: 'Formation',
    location: 'Barreau de Paris',
    urgent: false
  }
];

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Audience': return 'bg-red-100 text-red-800';
    case 'Échéance': return 'bg-amber-100 text-amber-800';
    case 'Rendez-vous': return 'bg-blue-100 text-blue-800';
    case 'Formation': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const Calendrier = () => {
  const [selectedDate, setSelectedDate] = useState('2024-06-26');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isUpcoming = (dateStr: string) => {
    const today = new Date();
    const eventDate = new Date(dateStr);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
            <p className="text-gray-600 mt-1">Suivez vos échéances et rendez-vous</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Nouvel événement
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockEvents.filter(e => isToday(e.date)).length}
                  </p>
                </div>
                <span className="text-2xl">📅</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cette semaine</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockEvents.filter(e => isUpcoming(e.date)).length}
                  </p>
                </div>
                <span className="text-2xl">📊</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Audiences</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockEvents.filter(e => e.type === 'Audience').length}
                  </p>
                </div>
                <span className="text-2xl">⚖️</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgents</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {mockEvents.filter(e => e.urgent).length}
                  </p>
                </div>
                <span className="text-2xl">⚠️</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Événements à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      {event.urgent && (
                        <Badge className="bg-red-100 text-red-800">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">{formatDate(event.date)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{event.time}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Voir détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendrier;
