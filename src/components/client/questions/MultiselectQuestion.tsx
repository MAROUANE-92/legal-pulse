
import { Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Question } from '@/lib/questions.config';

interface MultiselectQuestionProps {
  question: Question;
  control: any;
}

export const MultiselectQuestion = ({ question, control }: MultiselectQuestionProps) => {
  return (
    <Controller
      name={question.id}
      control={control}
      render={({ field }) => (
        <div className="space-y-3">
          {question.options?.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}-${option}`}
                checked={field.value?.includes(option) || false}
                onCheckedChange={(checked) => {
                  const currentValue = field.value || [];
                  const newValue = checked
                    ? [...currentValue, option]
                    : currentValue.filter((v: string) => v !== option);
                  field.onChange(newValue);
                }}
              />
              <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      )}
    />
  );
};
