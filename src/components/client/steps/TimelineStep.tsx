import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStepper } from '../NewStepperProvider';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export function TimelineStep() {
  const { formData, savePartial, goTo } = useStepper();
  const [events, setEvents] = useState<TimelineEvent[]>(
    formData.timeline || []
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const addEvent = (event: TimelineEvent) => {
    setEvents(prev => [...prev, event].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
    setShowAddModal(false);
  };

  const handleSubmit = () => {
    savePartial('timeline', events);
    goTo('damages');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Chronologie des faits
        </CardTitle>
        <CardDescription>
          Ajoutez au moins 5 événements clés de votre histoire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={() => setShowAddModal(true)}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un événement
          </Button>

          {events.length > 0 && (
            <div className="space-y-2">
              {events.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Badge variant="outline">
                      {format(new Date(event.date), 'dd/MM/yyyy', { locale: fr })}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {events.length < 5 && (
            <Alert>
              <AlertDescription>
                Ajoutez encore {5 - events.length} événement(s) pour continuer
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={events.length < 5}
          >
            Continuer vers l'évaluation des préjudices
          </Button>
        </div>

        {/* Modal d'ajout */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="font-medium mb-4">Ajouter un événement</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                addEvent({
                  date: formData.get('date') as string,
                  title: formData.get('title') as string,
                  description: formData.get('description') as string
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" name="date" required className="mt-1" />
                  </div>
                  <div>
                    <Label>Titre</Label>
                    <Input name="title" required maxLength={50} className="mt-1" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" maxLength={200} className="mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Ajouter</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}