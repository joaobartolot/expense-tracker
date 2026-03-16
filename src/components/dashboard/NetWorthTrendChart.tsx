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
        <Card title="Net Worth Trend">
            <div className="flex h-36 items-end gap-2">
                {points.map((point) => (
                    <div
                        key={point.label}
                        className="flex flex-1 flex-col items-center gap-1"
                    >
                        <div
                            className="w-full rounded-t bg-slate-800"
                            style={{
                                height:
                                    point.value === 0
                                        ? '0%'
                                        : `${Math.max(6, (Math.abs(point.value) / maxValue) * 100)}%`,
                            }}
                        />
                        <span className="text-xs text-slate-500">
                            {point.label}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
