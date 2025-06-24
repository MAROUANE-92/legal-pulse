
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Barreau } from '@/types/dashboard';

interface BarreauSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export const BarreauSelect = ({ value, onValueChange }: BarreauSelectProps) => {
  const [barreaux, setBarreaux] = useState<Barreau[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to /api/barreaux
    const loadBarreaux = async () => {
      try {
        // Mock data for now
        const mockBarreaux: Barreau[] = [
          { id: 'paris', name: 'Barreau de Paris' },
          { id: 'lyon', name: 'Barreau de Lyon' },
          { id: 'marseille', name: 'Barreau de Marseille' },
          { id: 'bordeaux', name: 'Barreau de Bordeaux' },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        setBarreaux(mockBarreaux);
      } catch (error) {
        console.error('Error loading barreaux:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBarreaux();
  }, []);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={loading}>
      <SelectTrigger className="w-48 rounded-xl">
        <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un barreau"} />
      </SelectTrigger>
      <SelectContent>
        {barreaux.map((barreau) => (
          <SelectItem key={barreau.id} value={barreau.id}>
            {barreau.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
