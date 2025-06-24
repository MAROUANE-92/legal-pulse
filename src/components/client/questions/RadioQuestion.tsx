
import { Controller } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question } from '@/lib/questions.config';

interface RadioQuestionProps {
  question: Question;
  control: any;
}

export const RadioQuestion = ({ question, control }: RadioQuestionProps) => {
  return (
    <Controller
      name={question.id}
      control={control}
      render={({ field }) => (
        <RadioGroup value={field.value} onValueChange={field.onChange}>
          {question.options?.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
              <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
    />
  );
};
