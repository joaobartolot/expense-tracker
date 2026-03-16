import type { ReactNode } from 'react';
import { Landmark, Wallet } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { Card } from '../common/Card';
import { formatDateLabel } from '../../utils/date';
import { formatMoney } from '../../utils/currency';
import type {
    Account,
    Category,
    Currency,
    NormalizedTransaction,
    RecentTransactionGroups,
} from '../../types/finance';

interface RecentTransactionsProps {
    groups: RecentTransactionGroups;
    accounts: Account[];
    categories: Category[];
    defaultCurrency: Currency;
    title?: string;
    subtitle?: string;
    maxGroups?: number;
    actions?: ReactNode;
    onTransactionClick?: (transaction: NormalizedTransaction) => void;
}

export function RecentTransactions({
    groups,
    accounts,
    categories,
    defaultCurrency,
    title = 'Recent Transactions',
    subtitle = 'Grouped by date for faster scanning.',
    maxGroups = 6,
    actions,
    onTransactionClick,
}: RecentTransactionsProps) {
    const entries: [string, NormalizedTransaction[]][] = Object.entries(
        groups,
    ).slice(0, maxGroups);

    return (
        <Card title={title} subtitle={subtitle} actions={actions}>
            <div className="space-y-5">
                {entries.map(([date, transactions]) => (
                    <div key={date}>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                            {formatDateLabel(date)}
                        </h3>
                        <div className="space-y-3">
                            {transactions.map((transaction) => {
                                const category = categories.find(
                                    (item) =>
                                        item.id === transaction.categoryId,
                                );
                                const account = accounts.find(
                                    (item) => item.id === transaction.accountId,
                                );
                                const sign =
                                    transaction.type === 'income' ? '+' : '-';

                                return (
                                    <button
                                        key={transaction.id}
                                        type="button"
                                        onClick={() => onTransactionClick?.(transaction)}
                                        className="flex w-full items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 text-left transition hover:border-brand-100 hover:bg-white"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="rounded-2xl bg-white p-3 text-brand-500 shadow-sm">
                                                <CategoryIcon
                                                    iconKey={category?.icon}
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-slate-900">
                                                    {transaction.description}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                    <span>{category?.name ?? 'Uncategorized'}</span>
                                                    <span className="inline-flex items-center gap-1">
                                                        {account?.type === 'bank' ? (
                                                            <Landmark className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Wallet className="h-3.5 w-3.5" />
                                                        )}
                                                        {account?.name ?? 'Unknown account'}
                                                    </span>
                                                    <span>
                                                        {transaction.currency}{' '}
                                                        {transaction.amount.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p
                                            className={`whitespace-nowrap text-base font-semibold ${
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
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {!entries.length && (
                    <p className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
                        No transactions yet.
                    </p>
                )}
            </div>
        </Card>
    );
}
