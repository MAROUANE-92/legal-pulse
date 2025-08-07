import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { useTimeline } from "@/hooks/useTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User, Building2 } from "lucide-react";
import QuestionnaireForm from "@/components/client/QuestionnaireForm";
import TimelineView from "@/components/client/TimelineView";

interface LawyerInfo {
  name: string;
  firm: string;
  photo_url?: string;
  email: string;
}

export default function FormPage() {
  const { id } = useParams<{ id: string }>();
  const [lawyer, setLawyer] = useState<LawyerInfo | null>(null);
  const [overtimeResult, setOvertimeResult] = useState<{ hours: number; euros: number } | null>(null);
  
  const { questionnaire, isLoading: questionnaireLoading } = useQuestionnaire(id || '');
  const { data: timeline, isLoading: timelineLoading } = useTimeline(id || '');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      // Simulation de données avocat - à adapter selon votre structure
      setLawyer({
        name: "Maître Julie Dubois",
        firm: "Cabinet Dubois & Associés",
        photo_url: "/lovable-uploads/52561914-7132-4666-921a-bdf940b22fca.png",
        email: "j.dubois@cabinet-dubois.fr"
      });

      // Récupérer le calcul d'heures sup s'il existe
      const { data: answer } = await supabase
        .from('answers')
        .select('*')
        .eq('submission_id', id)
        .eq('question_slug', 'overtime_calc')
        .maybeSingle();
        
      if (answer?.value) {
        setOvertimeResult(answer.value as { hours: number; euros: number });
      }
    };

    fetchData();
  }, [id]);

  if (!id) {
    return <div>ID de formulaire manquant</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header avec info avocat */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={lawyer?.photo_url} alt={lawyer?.name} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl">{lawyer?.name}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{lawyer?.firm}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{lawyer?.email}</p>
              </div>
              <Badge variant="outline" className="ml-auto">
                Dossier actif
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Résultat heures sup si disponible */}
        {overtimeResult && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Clock className="h-5 w-5" />
                Calcul heures supplémentaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div>
                  <span className="text-2xl font-bold text-green-900">{overtimeResult.hours}h</span>
                  <p className="text-sm text-green-700">Heures supplémentaires</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-green-900">{overtimeResult.euros}€</span>
                  <p className="text-sm text-green-700">Montant estimé</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questionnaire */}
        <Card>
          <CardHeader>
            <CardTitle>Questionnaire</CardTitle>
          </CardHeader>
          <CardContent>
            {questionnaireLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <QuestionnaireForm submissionId={id} />
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Chronologie du dossier</CardTitle>
          </CardHeader>
          <CardContent>
            {timelineLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <TimelineView 
                submissionId={id} 
                events={(timeline || []).map(event => ({
                  id: event.id,
                  title: event.title,
                  event_type: event.type,
                  event_date: event.date,
                  details: event.description
                }))} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}