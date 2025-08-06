import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useStepper } from '../StepperProvider';
import { StepNavigation } from '../StepNavigation';
import { useQuestionnaireSchema } from '@/hooks/useQuestionnaireSchema';

export function QuestionsStep() {
  const { formData, savePartial, goTo } = useStepper();
  
  // Get current answers from all steps
  const allAnswers = {
    ...formData.identity,
    ...formData.contract,
    ...formData.remuneration,
    ...formData.working_time,
    ...formData.motifs,
    ...formData.questions
  };

  const { getConditionalSections } = useQuestionnaireSchema(allAnswers);
  const conditionalSections = getConditionalSections();

  const form = useForm({
    defaultValues: formData.questions || {}
  });

  const onSubmit = (data: any) => {
    savePartial('questions', data);
    goTo('upload');
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            rules={question.required ? { required: `${question.label} requis` } : {}}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label} {question.required && '*'}</FormLabel>
                <FormControl>
                  {question.id === 'facts_description' || question.id === 'other_description' ? (
                    <Textarea 
                      placeholder="Décrivez en détail..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  ) : (
                    <Input placeholder="Votre réponse..." {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'date':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            rules={question.required ? { required: `${question.label} requis` } : {}}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label} {question.required && '*'}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'number':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            rules={question.required ? { required: `${question.label} requis` } : {}}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label} {question.required && '*'}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'yes_no':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            rules={question.required ? { required: `${question.label} requis` } : {}}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label} {question.required && '*'}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Oui/Non" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Yes">Oui</SelectItem>
                    <SelectItem value="No">Non</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select_one':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            rules={question.required ? { required: `${question.label} requis` } : {}}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label} {question.required && '*'}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {question.options?.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select_many':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question.label} {question.required && '*'}</FormLabel>
                <div className="space-y-2 mt-2">
                  {question.options?.map((option: string) => (
                    <FormItem
                      key={option}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option) || false}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...(field.value || []), option]
                              : field.value?.filter((value: string) => value !== option) || [];
                            field.onChange(updatedValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {option}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  if (conditionalSections.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Questions spécifiques</CardTitle>
            <CardDescription>
              Aucune question spécifique pour les motifs sélectionnés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepNavigation 
              onNext={() => goTo('upload')}
              onBack={() => goTo('motifs')}
              nextLabel="Continuer vers documents"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {conditionalSections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
                <CardDescription>
                  Questions spécifiques à ce motif
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.questions.map(renderQuestion)}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="pt-6">
              <StepNavigation 
                onNext={form.handleSubmit(onSubmit)}
                onBack={() => goTo('motifs')}
                nextLabel="Continuer vers documents"
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}