
import { Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Question } from '@/lib/questions.config';

interface CheckboxQuestionProps {
  question: Question;
  control: any;
}

export const CheckboxQuestion = ({ question, control }: CheckboxQuestionProps) => {
  return (
    <Controller
      name={question.id}
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          {question.options?.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}-${option}`}
                checked={field.value?.includes(option) || false}
                onCheckedChange={(checked) => {
                  const currentValue = field.value || [];
                  if (checked) {
                    field.onChange([...currentValue, option]);
                  } else {
                    field.onChange(currentValue.filter((item: string) => item !== option));
                  }
                }}
              />
              <Label htmlFor={`${question.id}-${option}`} className="text-sm font-normal">
                {option}
              </Label>
            </div>
          ))}
        </div>
      )}
    />
  );
};
