
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BarreauSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const BarreauSelect = ({ value, onValueChange }: BarreauSelectProps) => {
  const barreaux = [
    { value: 'all', label: 'Tous les barreaux' },
    { value: 'paris', label: 'Barreau de Paris' },
    { value: 'lyon', label: 'Barreau de Lyon' },
    { value: 'marseille', label: 'Barreau de Marseille' }
  ];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sélectionner un barreau" />
      </SelectTrigger>
      <SelectContent>
        {barreaux.map((barreau) => (
          <SelectItem key={barreau.value} value={barreau.value}>
            {barreau.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
