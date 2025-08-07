import { useState, useEffect } from "react";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { useQuestionnaireSchema } from "@/hooks/useQuestionnaireSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, CheckCircle } from "lucide-react";

interface QuestionnaireFormProps {
  submissionId: string;
}

export default function QuestionnaireForm({ submissionId }: QuestionnaireFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [savedFields, setSavedFields] = useState<Set<string>>(new Set());
  
  const { questionnaire, saveAnswers } = useQuestionnaire(submissionId);
  const { sections, getQuestionsForSection } = useQuestionnaireSchema(answers);

  useEffect(() => {
    // Charger les réponses existantes depuis la base
    if (questionnaire) {
      // Simuler le chargement des réponses existantes
      // À adapter selon la structure de vos données
    }
  }, [questionnaire]);

  const handleAnswerChange = (questionId: string, value: any, sectionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSaveField = async (questionId: string, sectionId: string) => {
    const value = answers[questionId];
    if (value !== undefined) {
      await saveAnswers.mutateAsync({
        step: sectionId,
        answers: { [questionId]: value }
      });
      
      setSavedFields(prev => new Set([...prev, questionId]));
      
      // Retirer l'indicateur après 2 secondes
      setTimeout(() => {
        setSavedFields(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
      }, 2000);
    }
  };

  const renderQuestion = (question: any, sectionId: string) => {
    const value = answers[question.id] || '';
    const isSaved = savedFields.has(question.id);

    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>{question.label}</Label>
            <div className="flex gap-2">
              <Input
                id={question.id}
                type={question.type}
                value={value}
                onChange={(e) => handleAnswerChange(question.id, e.target.value, sectionId)}
                placeholder={question.placeholder}
              />
              <Button
                size="sm"
                variant={isSaved ? "default" : "outline"}
                onClick={() => handleSaveField(question.id, sectionId)}
                disabled={saveAnswers.isPending}
              >
                {isSaved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>{question.label}</Label>
            <div className="flex gap-2">
              <Textarea
                id={question.id}
                value={value}
                onChange={(e) => handleAnswerChange(question.id, e.target.value, sectionId)}
                placeholder={question.placeholder}
                rows={4}
              />
              <Button
                size="sm"
                variant={isSaved ? "default" : "outline"}
                onClick={() => handleSaveField(question.id, sectionId)}
                disabled={saveAnswers.isPending}
              >
                {isSaved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div key={question.id} className="space-y-3">
            <Label>{question.label}</Label>
            <RadioGroup
              value={value}
              onValueChange={(newValue) => {
                handleAnswerChange(question.id, newValue, sectionId);
                handleSaveField(question.id, sectionId);
              }}
            >
              {question.options?.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'checkbox':
        return (
          <div key={question.id} className="space-y-3">
            <Label>{question.label}</Label>
            <div className="space-y-2">
              {question.options?.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option.value}`}
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v: any) => v !== option.value);
                      handleAnswerChange(question.id, newValues, sectionId);
                      handleSaveField(question.id, sectionId);
                    }}
                  />
                  <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const questions = getQuestionsForSection(section.id);
        
        if (questions.length === 0) return null;
        
        return (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question) => renderQuestion(question, section.id))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}