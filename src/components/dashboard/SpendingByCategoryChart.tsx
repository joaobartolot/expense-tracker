import { Card } from '../common/Card';
import { formatMoney } from '../../utils/currency';
import type { Currency, SpendingByCategoryEntry } from '../../types/finance';

interface SpendingByCategoryChartProps {
    data: SpendingByCategoryEntry[];
    spent: number;
    defaultCurrency: Currency;
    periodLabel: string;
}

export function SpendingByCategoryChart({
    data,
    spent,
    defaultCurrency,
    periodLabel,
}: SpendingByCategoryChartProps) {
    return (
        <Card
            title="Spending by Category"
            subtitle={`See where your money is going this period. (${periodLabel})`}
        >
            <div className="space-y-4">
                {data.map(([name, value]) => (
                    <div key={name}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">
                                {name}
                            </span>
                            <span className="text-slate-500">
                                {formatMoney(value, defaultCurrency)}
                            </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100">
                            <div
                                className="h-2.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                                style={{
                                    width: `${Math.max(8, (value / (spent || 1)) * 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}

                {!data.length && (
                    <p className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
                        No spending data yet for this period.
                    </p>
                )}
            </div>
        </Card>
    );
}
