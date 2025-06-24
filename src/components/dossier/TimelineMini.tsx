
import { TimelineEvent } from '@/types/dossier';

// Mock data for last 7 events
const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-06-20',
    title: 'Document déposé',
    description: 'Conclusions principales',
    type: 'docEvent'
  },
  {
    id: '2',
    date: '2024-06-18',
    title: 'Heures supplémentaires',
    description: 'Travail de nuit - 4h',
    type: 'overtimeNight'
  },
  {
    id: '3',
    date: '2024-06-15',
    title: 'Heures weekend',
    description: 'Travail samedi - 8h',
    type: 'overtimeWE'
  },
  {
    id: '4',
    date: '2024-06-12',
    title: 'Incident signalé',
    description: 'Harcèlement moral',
    type: 'toxic'
  },
  {
    id: '5',
    date: '2024-06-10',
    title: 'Pièce validée',
    description: 'Contrat de travail',
    type: 'docEvent'
  }
];

const getEventColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'overtimeNight': return '#6B4BFF';
    case 'overtimeWE': return '#5139D4';
    case 'toxic': return '#FF5D5D';
    case 'docEvent': return '#00C48C';
    default: return '#6B4BFF';
  }
};

export const TimelineMini = () => {
  return (
    <div className="space-y-4">
      {mockEvents.map((event, index) => (
        <div key={event.id} className="flex items-start gap-3">
          <div 
            className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
            style={{ backgroundColor: getEventColor(event.type) }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-main truncate">{event.title}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
