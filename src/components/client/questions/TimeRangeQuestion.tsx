
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Question } from '@/lib/questions.config';

interface TimeRangeQuestionProps {
  question: Question;
  control: any;
}

export const TimeRangeQuestion = ({ question, control }: TimeRangeQuestionProps) => {
  return (
    <Controller
      name={question.id}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          type="text"
          placeholder="08:30-18:00"
          pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
        />
      )}
    />
  );
};
