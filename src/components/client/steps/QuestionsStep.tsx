
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { StepNavigation } from '../StepNavigation';
import { useClientStepper } from '../ClientStepperProvider';
import { QuestionsFormData } from '@/types/questionnaire';
import { useChecklist } from '@/hooks/useChecklist';
import { getQuestionsForMotifs, getTooltipForQuestion } from '@/hooks/useDynamicQuestions';
import { Question } from '@/lib/questions.config';
import { HelpTooltip } from '@/components/HelpTooltip';
import { NumberQuestion } from '../questions/NumberQuestion';
import { RadioQuestion } from '../questions/RadioQuestion';
import { SliderQuestion } from '../questions/SliderQuestion';
import { MultiselectQuestion } from '../questions/MultiselectQuestion';

export const QuestionsStep = () => {
  const { formData, savePartial } = useClientStepper();
  const selectedMotifs = formData.motifs?.selectedMotifs || [];
  const { generateFromMotifs } = useChecklist('mock-dossier-id');
  
  // Get questions for selected motifs
  const questions = getQuestionsForMotifs(selectedMotifs);
  
  // Dynamically build zod schema
  const schemaShape: any = {};
  questions.forEach(q => {
    let rule: any = z.any();
    switch (q.type) {
      case "number": 
        rule = z.coerce.number().min(q.min ?? 0).max(q.max ?? 1000000); 
        break;
      case "date":   
        rule = z.string().min(10, "Date requise"); 
        break;
      case "slider": 
        rule = z.number().min(q.min ?? 0).max(q.max ?? 30); 
        break;
      case "radio":  
        rule = z.string().min(1, "Sélection requise"); 
        break;
      case "textarea": 
        rule = z.string().min(q.min ?? 10, `Minimum ${q.min ?? 10} caractères`); 
        break;
      case "multiselect": 
        rule = z.array(z.string()).min(1, "Au moins une sélection requise"); 
        break;
      default: 
        rule = z.any();
    }
    if (!q.required) rule = rule.optional();
    schemaShape[q.id] = rule;
  });
  
  const schema = z.object(schemaShape);
  
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: formData.questions || {}
  });

  // Auto-save form data
  useEffect(() => {
    const subscription = form.watch((value) => {
      savePartial('questions', value as QuestionsFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, savePartial]);

  const onSubmit = async (data: any) => {
    savePartial('questions', data);
    
    // Generate checklist from selected motifs and answers
    console.log('Generating checklist from motifs and answers:', { selectedMotifs, answers: data });
    try {
      await generateFromMotifs.mutateAsync({ 
        motifs: selectedMotifs,
        answers: data 
      });
      console.log('Checklist generated successfully');
    } catch (error) {
      console.error('Failed to generate checklist:', error);
    }
  };

  const renderQuestionField = (question: Question) => {
    // Check if question should be visible based on dependencies
    const isVisible = !question.dependsOn || 
      form.watch(question.dependsOn.questionId) === question.dependsOn.value;
    
    if (!isVisible) return null;

    const tooltip = getTooltipForQuestion(question.id);

    return (
      <FormField
        key={question.id}
        control={form.control}
        name={question.id}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              {question.label}
              {question.required && <span className="text-red-500">*</span>}
              {tooltip && <HelpTooltip text={tooltip} />}
            </FormLabel>
            <FormControl>
              <div>
                {question.type === 'number' && <NumberQuestion question={question} control={form.control} />}
                {question.type === 'date' && (
                  <Input {...field} type="date" />
                )}
                {question.type === 'radio' && <RadioQuestion question={question} control={form.control} />}
                {question.type === 'slider' && <SliderQuestion question={question} control={form.control} />}
                {question.type === 'multiselect' && <MultiselectQuestion question={question} control={form.control} />}
                {question.type === 'textarea' && (
                  <Textarea 
                    {...field} 
                    rows={4} 
                    placeholder={`Minimum ${question.min || 10} caractères`}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Questions spécifiques</CardTitle>
            <CardDescription>
              Aucune question spécifique pour les motifs sélectionnés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepNavigation 
              nextLabel="Continuer vers les documents"
              onNext={() => onSubmit({})}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Questions spécifiques</CardTitle>
          <CardDescription>
            Répondez aux questions relatives à votre situation pour générer la checklist personnalisée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {questions.map(renderQuestionField)}
              
              <StepNavigation 
                nextLabel="Générer la checklist et continuer"
                onNext={form.handleSubmit(onSubmit)}
                nextDisabled={!form.formState.isValid}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
