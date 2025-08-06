
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { StepNavigation } from '../StepNavigation';
import { useClientStepper } from '../ClientStepperProvider';
import { useChecklist } from '@/hooks/useChecklist';
import { getQuestionsForMotifs, getTooltipForQuestion } from '@/hooks/useDynamicQuestions';
import { Question, GLOBAL_QUESTIONS } from '@/lib/questions.config';
import { useQuestionnaireSchema } from '@/hooks/useQuestionnaireSchema';
import { Question as SchemaQuestion } from '@/lib/questionnaire-schema';
import { HelpTooltip } from '@/components/HelpTooltip';
import { NumberQuestion } from '../questions/NumberQuestion';
import { RadioQuestion } from '../questions/RadioQuestion';
import { SliderQuestion } from '../questions/SliderQuestion';
import { MultiselectQuestion } from '../questions/MultiselectQuestion';
import { TimeRangeQuestion } from '../questions/TimeRangeQuestion';
import { CheckboxQuestion } from '../questions/CheckboxQuestion';

export const QuestionsStep = () => {
  const { formData, savePartial } = useClientStepper();
  const selectedMotifs = formData.motifs?.motifs_selected || [];
  const { generateFromMotifs } = useChecklist('mock-dossier-id');
  
  // Use new schema with conditional sections
  const allAnswers = { ...formData.identity, ...formData.motifs, ...formData.questions };
  const { getConditionalSections, getAllVisibleQuestions } = useQuestionnaireSchema(allAnswers);
  
  // Get conditional sections based on selected motifs
  const conditionalSections = getConditionalSections();
  const questions = getAllVisibleQuestions().filter(q => 
    conditionalSections.some(section => section.questions.some(sq => sq.id === q.id))
  );
  
  // Simplified schema - just check if required fields have values
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  questions.forEach(q => {
    let rule: z.ZodTypeAny = z.any();
    switch (q.type) {
      case "number": 
        rule = z.coerce.number(); 
        break;
      case "date":   
        rule = z.string().min(10, "Date requise"); 
        break;
      case "yes_no":  
        rule = z.string().min(1, "Sélection requise"); 
        break;
      case "select_one":  
        rule = z.string().min(1, "Sélection requise"); 
        break;
      case "select_many": 
        rule = z.array(z.string()).min(1, "Au moins une sélection requise"); 
        break;
      case "text":
      case "email":
      case "tel":
        rule = z.string().min(1, "Champ requis");
        break;
      default: 
        rule = z.any();
    }
    if (!q.required) rule = rule.optional();
    schemaShape[q.id] = rule;
  });
  
  const schema = z.object(schemaShape);
  
  const form = useForm<Record<string, any>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: formData.questions || {}
  });

  // Auto-save form data
  useEffect(() => {
    const subscription = form.watch((value) => {
      savePartial('questions', value);
    });
    return () => subscription.unsubscribe();
  }, [form, savePartial]);

  const onSubmit = async (data: Record<string, any>) => {
    savePartial('questions', data);
    
    // Generate checklist from selected motifs and answers
    console.log('Generating checklist from motifs and answers:', { selectedMotifs, answers: data });
    try {
      await generateFromMotifs.mutateAsync({ 
        motifs: selectedMotifs,
        answers: data,
        identityData: formData.identity 
      });
      console.log('Checklist generated successfully');
    } catch (error) {
      console.error('Failed to generate checklist:', error);
    }
  };

  const renderQuestionField = (question: SchemaQuestion) => {
    // Check if question should be visible based on dependencies
    const currentValues = form.getValues();
    const isVisible = !question.show_if || 
      evaluateCondition(question.show_if, currentValues);
    
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
                {question.type === 'number' && (
                  <Input {...field} type="number" value={field.value || ''} />
                )}
                {question.type === 'date' && (
                  <Input {...field} type="date" value={field.value || ''} />
                )}
                {question.type === 'yes_no' && (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        {...field} 
                        value="Oui"
                        checked={field.value === "Oui"}
                      />
                      Oui
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        {...field} 
                        value="Non"
                        checked={field.value === "Non"}
                      />
                      Non
                    </label>
                  </div>
                )}
                {question.type === 'select_one' && (
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="">Sélectionnez...</option>
                    {question.options?.map(opt => {
                      const value = typeof opt === 'string' ? opt : opt.code;
                      const label = typeof opt === 'string' ? opt : opt.label;
                      return <option key={value} value={value}>{label}</option>;
                    })}
                  </select>
                )}
                {question.type === 'select_many' && (
                  <div className="space-y-2">
                    {question.options?.map(opt => {
                      const value = typeof opt === 'string' ? opt : opt.code;
                      const label = typeof opt === 'string' ? opt : opt.label;
                      return (
                        <label key={value} className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={field.value?.includes(value) || false}
                            onChange={(e) => {
                              const current = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...current, value]);
                              } else {
                                field.onChange(current.filter((v: string) => v !== value));
                              }
                            }}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                )}
                {question.type === 'text' && (
                  <Input {...field} type="text" value={field.value || ''} />
                )}
                {question.type === 'email' && (
                  <Input {...field} type="email" value={field.value || ''} />
                )}
                {question.type === 'tel' && (
                  <Input {...field} type="tel" value={field.value || ''} />
                )}
                {question.type === 'file' && (
                  <Input {...field} type="file" />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  // Helper function to evaluate conditions
  const evaluateCondition = (condition: string, values: Record<string, any>): boolean => {
    if (condition.includes("motifs_selected includes")) {
      const motif = condition.match(/'([^']+)'/)?.[1];
      return motif ? values.motifs_selected?.includes(motif) : false;
    }
    if (condition.includes("==")) {
      const [field, value] = condition.split("==").map(s => s.trim().replace(/'/g, ""));
      return values[field] === value;
    }
    return true;
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
      {conditionalSections.map(section => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>{section.label}</CardTitle>
            <CardDescription>
              Questions spécifiques pour ce motif
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.questions.map(renderQuestionField)}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
