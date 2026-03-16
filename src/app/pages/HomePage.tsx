import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppHeader } from '../../components/common/AppHeader';
import { Modal } from '../../components/common/Modal';
import { MonthlySummaryCards } from '../../components/dashboard/MonthlySummaryCards';
import { NetWorthTrendChart } from '../../components/dashboard/NetWorthTrendChart';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { SpendingByCategoryChart } from '../../components/dashboard/SpendingByCategoryChart';
import { TransactionEditor } from '../../components/forms/TransactionEditor';
import { TransactionOverviewModal } from '../../components/transactions/TransactionOverviewModal';
import { formatMoney } from '../../utils/currency';
import type {
    Account,
    Category,
    Currency,
    NetWorthPoint,
    NormalizedTransaction,
    RecentTransactionGroups,
    SpendingByCategoryEntry,
    Transaction,
} from '../../types/finance';

interface HomePageProps {
    balance: number;
    defaultCurrency: Currency;
    accounts: Account[];
    categories: Category[];
    currentBudgetCycleLabel: string;
    currentCycleSpent: number;
    currentCycleEarned: number;
    recentTransactionGroups: RecentTransactionGroups;
    spendingByCategory: SpendingByCategoryEntry[];
    netWorthTrend: NetWorthPoint[];
    transactionCount: number;
    recurringCount: number;
    onCreateTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    onUpdateTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transactionId: string) => void;
}

export function HomePage({
    balance,
    defaultCurrency,
    accounts,
    categories,
    currentBudgetCycleLabel,
    currentCycleSpent,
    currentCycleEarned,
    recentTransactionGroups,
    spendingByCategory,
    netWorthTrend,
    transactionCount,
    recurringCount,
    onCreateTransaction,
    onUpdateTransaction,
    onDeleteTransaction,
}: HomePageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeTransaction, setActiveTransaction] =
        useState<NormalizedTransaction | null>(null);
    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);

    return (
        <div className="space-y-6">
            <AppHeader
                eyebrow="Home"
                title="Your finance home"
                description={`The balance stays at the top, with your main budget-cycle signals for ${currentBudgetCycleLabel} and latest activity underneath.`}
                meta={
                    <>
                        <div className="rounded-2xl bg-white/10 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                Total balance
                            </p>
                            <p className="mt-1 text-lg font-semibold text-white">
                                {formatMoney(balance, defaultCurrency)}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                Activity
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">
                                {transactionCount} transactions • {recurringCount} recurring
                            </p>
                        </div>
                    </>
                }
            />

            <MonthlySummaryCards
                spent={currentCycleSpent}
                earned={currentCycleEarned}
                currency={defaultCurrency}
                cycleLabel={currentBudgetCycleLabel}
            />

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                <RecentTransactions
                    groups={recentTransactionGroups}
                    accounts={accounts}
                    categories={categories}
                    defaultCurrency={defaultCurrency}
                    maxGroups={4}
                    subtitle="Click any transaction to open its overview."
                    actions={
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="rounded-2xl border border-app-line bg-white p-2 text-brand-500 transition hover:border-brand-100 hover:bg-brand-50"
                            aria-label="Add transaction"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    }
                    onTransactionClick={(transaction) =>
                        setActiveTransaction(transaction)
                    }
                />
                <div className="space-y-6">
                    <SpendingByCategoryChart
                        data={spendingByCategory}
                        spent={currentCycleSpent}
                        defaultCurrency={defaultCurrency}
                        cycleLabel={currentBudgetCycleLabel}
                    />
                    <NetWorthTrendChart points={netWorthTrend} />
                </div>
            </section>

            <Modal
                open={isCreateOpen}
                title="Add transaction"
                description="Create a new transaction directly from home."
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

            <TransactionOverviewModal
                transaction={activeTransaction}
                accounts={accounts}
                categories={categories}
                defaultCurrency={defaultCurrency}
                onClose={() => setActiveTransaction(null)}
                onEdit={(transaction) => {
                    setActiveTransaction(null);
                    setEditingTransaction(transaction);
                }}
                onDelete={(transactionId) => {
                    onDeleteTransaction(transactionId);
                    setActiveTransaction(null);
                }}
            />

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
        </div>
    );
}
