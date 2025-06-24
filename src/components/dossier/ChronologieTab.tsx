
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TimelineEvent } from '@/types/dossier';

interface ChronologieTabProps {
  dossierId: string;
}

// Mock events data
const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-06-20T14:30:00',
    title: 'Document déposé',
    description: 'Conclusions principales déposées au greffe',
    type: 'docEvent',
    channel: 'Greffe',
    part: 'Avocat',
    tag: 'Document'
  },
  {
    id: '2',
    date: '2024-06-18T22:00:00',
    title: 'Heures supplémentaires nuit',
    description: 'Travail de nuit - 4 heures supplémentaires',
    type: 'overtimeNight',
    channel: 'Employé',
    part: 'Client',
    tag: 'Heures sup'
  },
  {
    id: '3',
    date: '2024-06-15T10:00:00',
    title: 'Travail weekend',
    description: 'Travail samedi - 8 heures',
    type: 'overtimeWE',
    channel: 'Employé',
    part: 'Client',
    tag: 'Weekend'
  },
  {
    id: '4',
    date: '2024-06-12T16:30:00',
    title: 'Incident toxique',
    description: 'Harcèlement moral signalé',
    type: 'toxic',
    channel: 'RH',
    part: 'Employeur',
    tag: 'Harcèlement'
  }
];

const getEventColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'overtimeNight': return 'bg-[#6B4BFF]';
    case 'overtimeWE': return 'bg-[#5139D4]';
    case 'toxic': return 'bg-[#FF5D5D]';
    case 'docEvent': return 'bg-[#00C48C]';
    default: return 'bg-primary';
  }
};

export const ChronologieTab = ({ dossierId }: ChronologieTabProps) => {
  const [selectedFilters, setSelectedFilters] = useState<{
    channel: string[];
    part: string[];
    tag: string[];
  }>({
    channel: [],
    part: [],
    tag: []
  });

  const handleExportPNG = () => {
    console.log('Export PNG functionality would be implemented here');
  };

  const uniqueChannels = [...new Set(mockEvents.map(e => e.channel).filter(Boolean))];
  const uniqueParts = [...new Set(mockEvents.map(e => e.part).filter(Boolean))];
  const uniqueTags = [...new Set(mockEvents.map(e => e.tag).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Filtres</CardTitle>
            <Button onClick={handleExportPNG} variant="outline">
              Exporter PNG
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Channel</label>
              <div className="flex flex-wrap gap-2">
                {uniqueChannels.map(channel => (
                  <Badge key={channel} variant="outline" className="cursor-pointer">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Partie</label>
              <div className="flex flex-wrap gap-2">
                {uniqueParts.map(part => (
                  <Badge key={part} variant="outline" className="cursor-pointer">
                    {part}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tag</label>
              <div className="flex flex-wrap gap-2">
                {uniqueTags.map(tag => (
                  <Badge key={tag} variant="outline" className="cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Chronologie complète</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockEvents.map((event, index) => (
              <div key={event.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${getEventColor(event.type)}`} />
                  {index < mockEvents.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-main">{event.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                  <div className="flex gap-2">
                    {event.channel && (
                      <Badge variant="secondary" className="text-xs">
                        {event.channel}
                      </Badge>
                    )}
                    {event.part && (
                      <Badge variant="outline" className="text-xs">
                        {event.part}
                      </Badge>
                    )}
                    {event.tag && (
                      <Badge variant="outline" className="text-xs">
                        {event.tag}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
