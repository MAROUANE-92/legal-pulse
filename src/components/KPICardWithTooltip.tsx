
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardWithTooltipProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  tooltip: string;
  color: 'primary' | 'blue' | 'white' | 'green';
  urgent?: boolean;
  isAmount?: boolean;
}

const colorVariants = {
  primary: 'text-primary bg-primary/10',
  blue: 'text-blue-600 bg-blue-50',
  white: 'text-gray-600 bg-white border border-gray-200',
  green: 'text-green-600 bg-green-50'
};

export const KPICardWithTooltip = ({ 
  icon: Icon, 
  title, 
  value, 
  tooltip,
  color, 
  urgent, 
  isAmount 
}: KPICardWithTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="rounded-2xl shadow-sm border-divider-gray-300 hover:shadow-md transition-all duration-200 cursor-help">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                    colorVariants[color]
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{title}</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    isAmount ? "text-lg" : "text-2xl"
                  )}>
                    {value}
                  </p>
                </div>
                {urgent && (
                  <div className="w-3 h-3 bg-white border-2 border-gray-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
