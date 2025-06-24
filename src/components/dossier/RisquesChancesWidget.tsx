
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { RisqueChance } from '@/types/dossier';
import { TransactionModal } from './TransactionModal';

interface RisquesChancesWidgetProps {
  dossierId: string;
}

export const RisquesChancesWidget = ({ dossierId }: RisquesChancesWidgetProps) => {
  const [data, setData] = useState<RisqueChance | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Mock API call - replace with real endpoint
    const fetchRisques = async () => {
      // GET /ai/score/:dossierId
      const mockData: RisqueChance = {
        successProbability: 75,
        deltaTransaction: 12000
      };
      setData(mockData);
    };
    
    fetchRisques();
  }, [dossierId]);

  const getColor = (probability: number) => {
    if (probability > 60) return 'text-green-600';
    if (probability >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBackgroundColor = (probability: number) => {
    if (probability > 60) return 'bg-green-100';
    if (probability >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (!data) return null;

  return (
    <>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Risques & Chances</CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center mb-4">
                  <div className={`relative w-24 h-24 rounded-full ${getBackgroundColor(data.successProbability)} flex items-center justify-center`}>
                    <span className={`text-2xl font-bold ${getColor(data.successProbability)}`}>
                      {data.successProbability}%
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimation basée sur motifs, CCN et historique</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setShowModal(true)}
            className="w-full"
          >
            Simuler transaction
          </Button>
        </CardContent>
      </Card>

      <TransactionModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        dossierId={dossierId}
        totalClaim={45000} // Mock value - should come from dossier data
      />
    </>
  );
};
