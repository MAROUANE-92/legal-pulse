
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Hammer } from 'lucide-react';

interface ConstructionPageProps {
  title: string;
  subtitle?: string;
}

export const ConstructionPage = ({ title, subtitle }: ConstructionPageProps) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="relative inline-block">
              <Hammer className="h-16 w-16 text-amber-600 mx-auto animate-bounce" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">⚖</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {subtitle || "Cette section est en cours de développement"}
          </p>
          
          <div className="text-sm text-gray-500">
            🚧 Bientôt disponible 🚧
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
