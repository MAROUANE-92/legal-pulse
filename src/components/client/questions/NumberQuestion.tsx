
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Question } from '@/lib/questions.config';

interface NumberQuestionProps {
  question: Question;
  control: any;
}

export const NumberQuestion = ({ question, control }: NumberQuestionProps) => {
  return (
    <Controller
      name={question.id}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          type="number"
          min={question.min}
          max={question.max}
          placeholder={`Entre ${question.min || 0} et ${question.max || 999}`}
        />
      )}
    />
  );
};
