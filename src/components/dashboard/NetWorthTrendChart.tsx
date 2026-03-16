import { Card } from '../common/Card';
import type { NetWorthPoint } from '../../types/finance';

interface NetWorthTrendChartProps {
    points: NetWorthPoint[];
}

export function NetWorthTrendChart({ points }: NetWorthTrendChartProps) {
    const maxValue = Math.max(
        ...points.map((point) => Math.abs(point.value)),
        1,
    );

    return (
        <Card
            title="Net Worth Trend"
            subtitle="Last six budget cycles in your default currency."
        >
            <div className="flex h-44 items-end gap-3">
                {points.map((point) => (
                    <div
                        key={point.label}
                        className="flex flex-1 flex-col items-center gap-2"
                    >
                        <div
                            className="w-full rounded-t-[18px] bg-gradient-to-t from-slate-900 via-brand-600 to-brand-500"
                            style={{
                                height:
                                    point.value === 0
                                        ? '0%'
                                        : `${Math.max(6, (Math.abs(point.value) / maxValue) * 100)}%`,
                            }}
                        />
                        <span className="text-xs font-medium text-slate-500">
                            {point.label}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
