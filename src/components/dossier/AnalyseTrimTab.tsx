
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Clock, Euro } from 'lucide-react';
import { useOvertimeTrim } from '@/hooks/useOvertimeTrim';
import { useDossier } from '@/components/dossier/DossierLayout';

const BannerKPI = ({ totalDelta, avgWeeklyDelta, estimatedCompensation }: {
  totalDelta: number;
  avgWeeklyDelta: number;
  estimatedCompensation: number;
}) => (
  <div className="grid grid-cols-3 gap-4 mb-6">
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Δh</p>
            <p className="text-2xl font-bold">{totalDelta}h</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Δh moyen / semaine</p>
            <p className="text-2xl font-bold">{avgWeeklyDelta}h</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Euro className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm text-muted-foreground">Indemnités estimées</p>
            <p className="text-2xl font-bold">{estimatedCompensation}€</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const LineChartWeekly = ({ data }: { data: any[] }) => {
  const chartConfig = {
    delta: {
      label: "Heures sup",
      color: "#2563eb",
    },
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Évolution hebdomadaire des heures supplémentaires</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="isoWeek" 
                tickFormatter={(value) => `S${value}`}
              />
              <YAxis 
                tickFormatter={(value) => `${value}h`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="delta" 
                stroke="var(--color-delta)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-delta)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const CalendarHeat = ({ rows }: { rows: any[] }) => {
  const getColorForDelta = (delta: number) => {
    if (delta <= 0.5) return 'bg-gray-200';
    if (delta <= 2) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Calendrier des heures supplémentaires</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-7 gap-2">
            {rows.map((row, index) => (
              <Tooltip key={row.date}>
                <TooltipTrigger>
                  <div 
                    className={`h-8 w-8 rounded ${getColorForDelta(row.delta)} border border-gray-300 flex items-center justify-center text-xs font-medium cursor-pointer hover:scale-110 transition-transform`}
                  >
                    {new Date(row.date).getDate()}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{formatDate(row.date)} - {row.delta}h</p>
                  <p className="text-xs text-muted-foreground">
                    Sources: {row.sources.join(', ')}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

const PivotTable = ({ weekly }: { weekly: any[] }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Tableau pivot par semaine</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Semaine ISO</TableHead>
            <TableHead>Début semaine</TableHead>
            <TableHead>Δh</TableHead>
            <TableHead>Preuves</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weekly.map((week) => (
            <TableRow key={week.isoWeek}>
              <TableCell>S{week.isoWeek}</TableCell>
              <TableCell>{new Date(week.weekStart).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell className="font-medium">{week.delta}h</TableCell>
              <TableCell>{week.proofs}</TableCell>
              <TableCell>
                <Badge variant={week.hasProofs ? "default" : "destructive"}>
                  {week.hasProofs ? "✓" : "✗"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export const AnalyseTrimTab = () => {
  const { dossier } = useDossier();
  const { rows, totalDelta, avgWeeklyDelta, estimatedCompensation, weekly } = useOvertimeTrim();
  
  // Check if overtime motif exists
  const hasOvertimeMotif = true; // Mock - would check motifs in real app
  
  const handleExport = () => {
    console.log('Exporting overtime data to Excel...');
    // This would use python_user_visible to generate Excel file
    alert('Export Excel en cours... (fonctionnalité à implémenter)');
  };

  if (!hasOvertimeMotif) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Pas de motif heures supplémentaires</h3>
          <p className="text-muted-foreground">
            Ce dossier ne contient pas de demande d'heures supplémentaires.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analyse des heures supplémentaires</h2>
          <p className="text-muted-foreground">Q1 2025 - Vision trimestre (13 semaines)</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Exporter trimestre Excel
        </Button>
      </div>

      <BannerKPI 
        totalDelta={totalDelta}
        avgWeeklyDelta={avgWeeklyDelta}
        estimatedCompensation={estimatedCompensation}
      />
      
      <LineChartWeekly data={weekly} />
      
      <CalendarHeat rows={rows} />
      
      <PivotTable weekly={weekly} />
    </div>
  );
};

export default AnalyseTrimTab;
