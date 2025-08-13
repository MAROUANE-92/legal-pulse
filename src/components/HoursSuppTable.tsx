
// src/components/HoursSuppTable.tsx
import { calculateOvertime } from "@/lib/overtimeEngine";

export function HoursSuppTable() {
  const data = calculateOvertime();
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-2">Synthèse heures supplémentaires</h4>
      <table className="text-xs w-full">
        <thead><tr><th>Semaine ISO</th><th>Δ h</th></tr></thead>
         <tbody>
           {data.weeks.map((week: any, index: number) => (
             <tr key={index} className="border-t">
               <td>Semaine {index + 1}</td><td>0 h</td>
             </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold border-t">
            <td>Total</td><td>0 h</td>
          </tr>
          <tr><td>Indemnités estimées</td><td>0 €</td></tr>
        </tfoot>
      </table>
    </div>
  );
}
