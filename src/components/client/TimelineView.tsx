import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TimelineEvent {
  id: string;
  title: string;
  event_type: string;
  event_date: string;
  details?: any;
}

interface TimelineViewProps {
  submissionId: string;
  events: TimelineEvent[];
}

export default function TimelineView({ submissionId, events }: TimelineViewProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Upload className="h-4 w-4" />;
      case 'fact':
        return <FileText className="h-4 w-4" />;
      case 'deadline':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'fact':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'deadline':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'upload':
        return 'secondary';
      case 'fact':
        return 'default';
      case 'deadline':
        return 'destructive';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Aucun événement dans la chronologie pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`border-l-4 ${getEventColor(event.event_type)}`}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${getEventColor(event.event_type)}`}>
                  {getEventIcon(event.event_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant={getBadgeVariant(event.event_type)} className="text-xs">
                      {event.event_type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.event_date), "dd MMMM yyyy 'à' HH:mm", {
                      locale: fr
                    })}
                  </p>
                  
                  {event.details && (
                    <div className="mt-2 text-sm">
                      {typeof event.details === 'string' ? (
                        <p>{event.details}</p>
                      ) : (
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                          {JSON.stringify(event.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}