import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { Card } from '../common/Card';
import { formatMoney } from '../../utils/currency';
import type { Currency } from '../../types/finance';

interface MonthlySummaryCardsProps {
    spent: number;
    earned: number;
    currency: Currency;
    cycleLabel: string;
}

export function MonthlySummaryCards({
    spent,
    earned,
    currency,
    cycleLabel,
}: MonthlySummaryCardsProps) {
    const cards = [
        {
            title: 'Spent This Cycle',
            value: formatMoney(spent, currency),
            Icon: ArrowUpRight,
            valueClassName: 'text-rose-500',
            iconClassName: 'bg-rose-50 text-rose-500',
        },
        {
            title: 'Earned This Cycle',
            value: formatMoney(earned, currency),
            Icon: ArrowDownRight,
            valueClassName: 'text-emerald-600',
            iconClassName: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Cycle Net',
            value: formatMoney(earned - spent, currency),
            Icon: Wallet,
            valueClassName: 'text-slate-900',
            iconClassName: 'bg-brand-50 text-brand-500',
        },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-3">
            {cards.map(({ title, value, Icon, valueClassName, iconClassName }) => (
                <Card key={title} title={title} subtitle={cycleLabel}>
                    <div className="flex items-end justify-between gap-4">
                        <p className={`text-3xl font-semibold tracking-tight ${valueClassName}`}>
                            {value}
                        </p>
                        <div className={`rounded-2xl p-3 ${iconClassName}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                </Card>
            ))}
        </section>
    );
}
