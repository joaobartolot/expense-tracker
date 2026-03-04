import { Card } from '../common/Card';

export function NetWorthTrendChart({ points }) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <Card title="Net Worth Trend">
      <div className="flex h-36 items-end gap-2">
        {points.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full rounded-t bg-slate-800" style={{ height: `${Math.max(6, (point.value / maxValue) * 100)}%` }} />
            <span className="text-xs text-slate-500">{point.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
