
import { Controller } from 'react-hook-form';
import { Slider } from '@/components/ui/slider';
import { Question } from '@/lib/questions.config';

interface SliderQuestionProps {
  question: Question;
  control: any;
}

export const SliderQuestion = ({ question, control }: SliderQuestionProps) => {
  return (
    <Controller
      name={question.id}
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <Slider
            value={[field.value || question.min || 0]}
            onValueChange={(values) => field.onChange(values[0])}
            min={question.min || 0}
            max={question.max || 30}
            step={1}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600">
            {field.value || question.min || 0} heures
          </div>
        </div>
      )}
    />
  );
};
