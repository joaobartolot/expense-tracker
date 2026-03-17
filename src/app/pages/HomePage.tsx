import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { MonthlySummaryCards } from '../../components/dashboard/MonthlySummaryCards';
import { NetWorthTrendChart } from '../../components/dashboard/NetWorthTrendChart';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { SpendingByCategoryChart } from '../../components/dashboard/SpendingByCategoryChart';
import { TransactionEditor } from '../../components/forms/TransactionEditor';
import { TransactionOverviewModal } from '../../components/transactions/TransactionOverviewModal';
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
            <MonthlySummaryCards
                spent={currentCycleSpent}
                earned={currentCycleEarned}
                currency={defaultCurrency}
                periodLabel={currentBudgetCycleLabel}
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
                            className="app-icon-button text-brand-500 hover:border-brand-100 hover:bg-brand-50"
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
                        periodLabel={currentBudgetCycleLabel}
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
