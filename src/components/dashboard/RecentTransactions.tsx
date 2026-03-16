import { Card } from '../common/Card';
import { formatDateLabel } from '../../utils/date';
import { formatMoney } from '../../utils/currency';
import type {
    Category,
    Currency,
    NormalizedTransaction,
    RecentTransactionGroups,
} from '../../types/finance';

interface RecentTransactionsProps {
    groups: RecentTransactionGroups;
    categories: Category[];
    defaultCurrency: Currency;
}

export function RecentTransactions({
    groups,
    categories,
    defaultCurrency,
}: RecentTransactionsProps) {
    const entries: [string, NormalizedTransaction[]][] = Object.entries(
        groups,
    ).slice(0, 6);

    return (
        <Card title="Recent Transactions (by date)">
            <div className="space-y-4">
                {entries.map(([date, transactions]) => (
                    <div key={date}>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                            {formatDateLabel(date)}
                        </h3>
                        <div className="space-y-2">
                            {transactions.map((transaction) => {
                                const category = categories.find(
                                    (item) =>
                                        item.id === transaction.categoryId,
                                );
                                const sign =
                                    transaction.type === 'income' ? '+' : '-';

                                return (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {category?.icon}{' '}
                                                {transaction.description}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {transaction.currency}{' '}
                                                {transaction.amount.toFixed(2)}
                                            </p>
                                        </div>
                                        <p
                                            className={`font-semibold ${
                                                transaction.type === 'income'
                                                    ? 'text-emerald-600'
                                                    : 'text-rose-600'
                                            }`}
                                        >
                                            {sign}
                                            {formatMoney(
                                                transaction.converted,
                                                defaultCurrency,
                                            )}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {!entries.length && (
                    <p className="text-sm text-slate-500">
                        No transactions yet.
                    </p>
                )}
            </div>
        </Card>
    );
}
