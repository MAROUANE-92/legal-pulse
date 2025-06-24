
type Item = { 
  label: string; 
  validated: number; 
  required: number; 
};

export function ProgressChips({ items }: { items: Item[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const done = item.validated >= item.required;
        const isPartial = item.validated > 0 && item.validated < item.required;
        
        return (
          <span
            key={item.label}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              done
                ? "bg-justice-green/10 text-justice-green border border-justice-green/20"
                : isPartial
                ? "bg-justice-amber/10 text-justice-amber border border-justice-amber/20"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            {item.label} {item.validated}/{item.required}
          </span>
        );
      })}
    </div>
  );
}
