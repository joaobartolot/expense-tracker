import { useMemo, useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { AppHeader } from '../../components/common/AppHeader';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { TransactionEditor } from '../../components/forms/TransactionEditor';
import { formatMoney } from '../../utils/currency';
import type {
    Account,
    Category,
    Currency,
    NormalizedTransaction,
    Transaction,
} from '../../types/finance';

interface TransactionsPageProps {
    accounts: Account[];
    categories: Category[];
    defaultCurrency: Currency;
    transactions: NormalizedTransaction[];
    onCreateTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    onUpdateTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transactionId: string) => void;
}

export function TransactionsPage({
    accounts,
    categories,
    defaultCurrency,
    transactions,
    onCreateTransaction,
    onUpdateTransaction,
    onDeleteTransaction,
}: TransactionsPageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);
    const [viewingTransaction, setViewingTransaction] =
        useState<NormalizedTransaction | null>(null);

    const sortedTransactions = useMemo(
        () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)),
        [transactions],
    );

    return (
        <div className="space-y-6">
            <AppHeader
                eyebrow="Transactions"
                title="Review and manage every movement"
                description="Create new entries from a modal and edit or remove existing transactions directly from the activity list."
                meta={
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="app-button-primary"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add transaction
                    </button>
                }
            />

            <Card
                title="All Transactions"
                subtitle="Each row can be viewed, edited, or deleted."
            >
                <div className="space-y-3">
                    {sortedTransactions.map((transaction) => {
                        const category = categories.find(
                            (item) => item.id === transaction.categoryId,
                        );
                        const account = accounts.find(
                            (item) => item.id === transaction.accountId,
                        );

                        return (
                            <div
                                key={transaction.id}
                                className="flex flex-col gap-4 rounded-[24px] border border-app-line bg-slate-50/90 p-4 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="rounded-2xl bg-white p-3 text-brand-500 shadow-sm">
                                        <CategoryIcon
                                            iconKey={category?.icon}
                                            className="h-5 w-5"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {transaction.description}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {category?.name ?? 'Uncategorized'} •{' '}
                                            {account?.name ?? 'Unknown account'} •{' '}
                                            {transaction.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 lg:items-end">
                                    <p
                                        className={`text-lg font-semibold ${
                                            transaction.type === 'income'
                                                ? 'text-emerald-600'
                                                : 'text-rose-500'
                                        }`}
                                    >
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatMoney(
                                            transaction.converted,
                                            defaultCurrency,
                                        )}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setViewingTransaction(transaction)
                                            }
                                            className="app-icon-button"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingTransaction(transaction)
                                            }
                                            className="app-icon-button"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDeleteTransaction(transaction.id)
                                            }
                                            className="app-icon-button text-rose-500 hover:bg-rose-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {!sortedTransactions.length ? (
                        <p className="rounded-2xl bg-slate-50 px-4 py-8 text-sm text-slate-500">
                            No transactions yet.
                        </p>
                    ) : null}
                </div>
            </Card>

            <Modal
                open={isCreateOpen}
                title="Add transaction"
                description="Create a new entry without leaving the page."
                onClose={() => setIsCreateOpen(false)}
            >
                <TransactionEditor
                    accounts={accounts}
                    categories={categories}
                    defaultCurrency={defaultCurrency}
                    submitLabel="Create transaction"
                    onCancel={() => setIsCreateOpen(false)}
                    onSubmit={(transaction) => {
                        onCreateTransaction(transaction);
                        setIsCreateOpen(false);
                    }}
                />
            </Modal>

            <Modal
                open={Boolean(editingTransaction)}
                title="Edit transaction"
                description="Update the details of this transaction."
                onClose={() => setEditingTransaction(null)}
            >
                {editingTransaction ? (
                    <TransactionEditor
                        accounts={accounts}
                        categories={categories}
                        defaultCurrency={defaultCurrency}
                        initialValue={editingTransaction}
                        submitLabel="Save changes"
                        onCancel={() => setEditingTransaction(null)}
                        onSubmit={(transaction) => {
                            onUpdateTransaction({
                                ...editingTransaction,
                                ...transaction,
                            });
                            setEditingTransaction(null);
                        }}
                    />
                ) : null}
            </Modal>

            <Modal
                open={Boolean(viewingTransaction)}
                title="Transaction details"
                description="A read-only summary of the selected transaction."
                onClose={() => setViewingTransaction(null)}
            >
                {viewingTransaction ? (
                    <div className="space-y-3 text-sm text-slate-600">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                Description
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                                {viewingTransaction.description}
                            </p>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                    Amount
                                </p>
                                <p className="mt-2 font-semibold text-slate-900">
                                    {formatMoney(
                                        viewingTransaction.converted,
                                        defaultCurrency,
                                    )}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                    Date
                                </p>
                                <p className="mt-2 font-semibold text-slate-900">
                                    {viewingTransaction.date}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
}
