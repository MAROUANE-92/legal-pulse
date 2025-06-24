
// src/components/HoursSuppTable.tsx
import { computeOvertime } from "@/lib/overtimeEngine";

export function HoursSuppTable() {
  const { rows, totalDelta, montant } = computeOvertime();
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-2">Synthèse heures supplémentaires</h4>
      <table className="text-xs w-full">
        <thead><tr><th>Semaine ISO</th><th>Δ h</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.isoWeek} className="border-t">
              <td>{r.isoWeek}</td><td>{r.delta.toFixed(2)} h</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold border-t">
            <td>Total</td><td>{totalDelta} h</td>
          </tr>
          <tr><td>Indemnités estimées</td><td>{montant} €</td></tr>
        </tfoot>
      </table>
    </div>
  );
}
