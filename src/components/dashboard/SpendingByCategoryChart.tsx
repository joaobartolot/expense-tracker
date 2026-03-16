import { Card } from '../common/Card';
import { formatMoney } from '../../utils/currency';
import type { Currency, SpendingByCategoryEntry } from '../../types/finance';

interface SpendingByCategoryChartProps {
    data: SpendingByCategoryEntry[];
    spent: number;
    defaultCurrency: Currency;
}

export function SpendingByCategoryChart({
    data,
    spent,
    defaultCurrency,
}: SpendingByCategoryChartProps) {
    return (
        <Card title="Spent by Category">
            <div className="space-y-2">
                {data.map(([name, value]) => (
                    <div key={name}>
                        <div className="mb-1 flex justify-between text-sm">
                            <span>{name}</span>
                            <span>{formatMoney(value, defaultCurrency)}</span>
                        </div>
                        <div className="h-2 rounded bg-slate-200">
                            <div
                                className="h-2 rounded bg-brand-500"
                                style={{
                                    width: `${Math.max(8, (value / (spent || 1)) * 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}

                {!data.length && (
                    <p className="text-sm text-slate-500">
                        No spending data this month.
                    </p>
                )}
            </div>
        </Card>
    );
}
