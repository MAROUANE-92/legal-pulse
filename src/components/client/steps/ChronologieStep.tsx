import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Plus, Edit, Trash2, Download, ExternalLink, Pin, FileText, Scale, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  event_date: string;
  event_type: string;
  title: string;
  details: any;
}

const eventTypeConfig = {
  fact: { icon: Pin, color: 'text-blue-500', label: 'Fait' },
  upload: { icon: FileText, color: 'text-green-500', label: 'Pièce' },
  procedure: { icon: Scale, color: 'text-amber-500', label: 'Procédure' },
  reminder: { icon: Clock, color: 'text-red-500', label: 'Rappel' }
};

export function ChronologieStep() {
  const { goTo, formData } = useStepper();
  const { toast } = useToast();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    date: new Date(),
    title: '',
    type: 'fact' as const
  });

  // Get submission ID from localStorage
  const submissionId = localStorage.getItem('legalpulse_submission_id');

  useEffect(() => {
    if (submissionId) {
      loadEvents();
    }
  }, [submissionId]);

  const loadEvents = async () => {
    if (!submissionId) return;

    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('submission_id', submissionId)
      .order('event_date', { ascending: true });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements",
        variant: "destructive"
      });
      return;
    }

    setEvents(data || []);
  };

  const handleAddEvent = async () => {
    if (!submissionId || !newEvent.title.trim() || newEvent.title.length < 5) {
      toast({
        title: "Erreur",
        description: "Le titre doit contenir au moins 5 caractères",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('timeline_events')
      .insert({
        submission_id: submissionId,
        event_date: newEvent.date.toISOString(),
        event_type: newEvent.type,
        title: newEvent.title
      });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'événement",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Événement ajouté avec succès"
    });

    setNewEvent({ date: new Date(), title: '', type: 'fact' });
    setIsAddModalOpen(false);
    loadEvents();
  };

  const handleEditEvent = async () => {
    if (!editingEvent || !editingEvent.title.trim() || editingEvent.title.length < 5) {
      toast({
        title: "Erreur",
        description: "Le titre doit contenir au moins 5 caractères",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('timeline_events')
      .update({
        event_date: new Date(editingEvent.event_date).toISOString(),
        title: editingEvent.title
      })
      .eq('id', editingEvent.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'événement",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Événement modifié avec succès"
    });

    setEditingEvent(null);
    loadEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('timeline_events')
      .delete()
      .eq('id', eventId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Événement supprimé avec succès"
    });

    loadEvents();
  };

  const handleExportCSV = async () => {
    if (!submissionId) return;

    const { data, error } = await supabase.rpc('export_timeline_csv', {
      p_submission_id: submissionId
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter la chronologie",
        variant: "destructive"
      });
      return;
    }

    // Create and download CSV file
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timeline_${submissionId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.event_type === filter;
  });

  const onNext = () => {
    goTo('signature');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chronologie du dossier</CardTitle>
          <CardDescription>
            Ajoutez les faits marquants et consultez l'historique de votre dossier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header avec statistiques et actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {events.length} événement{events.length > 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un fait
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un événement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newEvent.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(newEvent.date, "dd/MM/yyyy", { locale: fr })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newEvent.date}
                            onSelect={(date) => date && setNewEvent({...newEvent, date})}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Décrivez l'événement..."
                      />
                    </div>
                    <Button onClick={handleAddEvent} className="w-full">
                      Ajouter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filtres */}
          <RadioGroup value={filter} onValueChange={setFilter} className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Tous</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fact" id="fact" />
              <Label htmlFor="fact">Faits</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="procedure" id="procedure" />
              <Label htmlFor="procedure">Procédure</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upload" id="upload" />
              <Label htmlFor="upload">Pièces</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reminder" id="reminder" />
              <Label htmlFor="reminder">Rappels</Label>
            </div>
          </RadioGroup>

          {/* Timeline */}
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun événement trouvé
              </p>
            ) : (
              filteredEvents.map((event) => {
                const config = eventTypeConfig[event.event_type];
                const IconComponent = config.icon;
                const canEdit = ['fact', 'upload'].includes(event.event_type);

                return (
                  <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={cn("flex-shrink-0", config.color)}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.event_date), "dd/MM/yyyy à HH:mm", { locale: fr })}
                          </p>
                          {event.details?.file_url && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto"
                              onClick={() => window.open(event.details.file_url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Voir pièce
                            </Button>
                          )}
                        </div>
                        {canEdit && (
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingEvent(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Modifier l'événement</DialogTitle>
                                </DialogHeader>
                                {editingEvent && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Date</Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {format(new Date(editingEvent.event_date), "dd/MM/yyyy", { locale: fr })}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            mode="single"
                                            selected={new Date(editingEvent.event_date)}
                                            onSelect={(date) => date && setEditingEvent({
                                              ...editingEvent,
                                              event_date: date.toISOString()
                                            })}
                                            initialFocus
                                            className="pointer-events-auto"
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-title">Titre</Label>
                                      <Input
                                        id="edit-title"
                                        value={editingEvent.title}
                                        onChange={(e) => setEditingEvent({
                                          ...editingEvent,
                                          title: e.target.value
                                        })}
                                      />
                                    </div>
                                    <Button onClick={handleEditEvent} className="w-full">
                                      Modifier
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <StepNavigation 
            onNext={onNext}
            onBack={() => goTo('upload')}
            nextLabel="Continuer"
          />
        </CardContent>
      </Card>
    </div>
  );
}