import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowUpDown,
    Flag,
    LayoutDashboard,
    Repeat,
    Settings,
    Tags,
} from 'lucide-react';
import { financeActions } from '../state/actions';
import { todayISO } from '../utils/date';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useFinanceState } from '../hooks/useFinanceState';
import { useDashboardData } from '../hooks/useDashboardData';
import { formatMoney } from '../utils/currency';
import type {
    Category,
    Goal,
    RecurringRule,
    Transaction,
} from '../types/finance';
import { HomePage } from './pages/HomePage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { RecurringPage } from './pages/RecurringPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';

type ViewId =
    | 'home'
    | 'transactions'
    | 'categories'
    | 'recurring'
    | 'goals'
    | 'settings';

interface ViewDefinition {
    id: ViewId;
    label: string;
    Icon: LucideIcon;
}

const views: ViewDefinition[] = [
    { id: 'home', label: 'Home', Icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', Icon: ArrowUpDown },
    { id: 'categories', label: 'Categories', Icon: Tags },
    { id: 'recurring', label: 'Recurring', Icon: Repeat },
    { id: 'goals', label: 'Goals', Icon: Flag },
    { id: 'settings', label: 'Settings', Icon: Settings },
];

export function DashboardPage() {
    const { rates, status: exchangeRateStatus } = useExchangeRates();
    const { state, dispatch } = useFinanceState();
    const [activeView, setActiveView] = useState<ViewId>('home');

    const {
        defaultCurrency,
        normalizedTransactions,
        monthlySpent,
        monthlyEarned,
        spendingByCategory,
        recentTransactionGroups,
        netWorthTrend,
    } = useDashboardData(state, rates);

    const totalBalance = useMemo(
        () =>
            normalizedTransactions.reduce(
                (sum, transaction) =>
                    sum +
                    (transaction.type === 'income'
                        ? transaction.converted
                        : -transaction.converted),
                0,
            ),
        [normalizedTransactions],
    );

    function addTransaction(transaction: Omit<Transaction, 'id'>) {
        dispatch({
            type: financeActions.addTransaction,
            payload: { id: crypto.randomUUID(), ...transaction },
        });
    }

    function updateTransaction(transaction: Transaction) {
        dispatch({
            type: financeActions.updateTransaction,
            payload: transaction,
        });
    }

    function deleteTransaction(transactionId: string) {
        dispatch({
            type: financeActions.deleteTransaction,
            payload: transactionId,
        });
    }

    function addAccount(accountName: string) {
        dispatch({
            type: financeActions.addAccount,
            payload: {
                id: crypto.randomUUID(),
                name: accountName,
                type: 'bank',
            },
        });
    }

    function addCategory(category: Omit<Category, 'id'>) {
        dispatch({
            type: financeActions.addCategory,
            payload: { id: crypto.randomUUID(), ...category },
        });
    }

    function updateCategory(category: Category) {
        dispatch({
            type: financeActions.updateCategory,
            payload: category,
        });
    }

    function deleteCategory(categoryId: string) {
        dispatch({
            type: financeActions.deleteCategory,
            payload: categoryId,
        });
    }

    function addGoal(goal: Omit<Goal, 'id'>) {
        dispatch({
            type: financeActions.addGoal,
            payload: { id: crypto.randomUUID(), ...goal },
        });
    }

    function contributeToGoal(goalId: string, amount: number) {
        const expenseCategoryId =
            state.categories.find((category) => category.type === 'expense')
                ?.id ?? state.categories[0]?.id;
        const accountId = state.accounts[0]?.id;

        if (!expenseCategoryId || !accountId) {
            return;
        }

        dispatch({
            type: financeActions.contributeGoal,
            payload: {
                goalId,
                amount,
                transaction: {
                    id: crypto.randomUUID(),
                    description: 'Goal contribution',
                    amount,
                    currency: defaultCurrency,
                    type: 'expense',
                    date: todayISO(),
                    categoryId: expenseCategoryId,
                    accountId,
                },
            },
        });
    }

    function addRecurringRule(rule: Omit<RecurringRule, 'id'>) {
        dispatch({
            type: financeActions.addRecurringRule,
            payload: { id: crypto.randomUUID(), ...rule },
        });
    }

    function updateRecurringRule(rule: RecurringRule) {
        dispatch({
            type: financeActions.updateRecurringRule,
            payload: rule,
        });
    }

    function deleteRecurringRule(ruleId: string) {
        dispatch({
            type: financeActions.deleteRecurringRule,
            payload: ruleId,
        });
    }

    function renderPage() {
        if (activeView === 'home') {
            return (
                <HomePage
                    balance={totalBalance}
                    defaultCurrency={defaultCurrency}
                    accounts={state.accounts}
                    categories={state.categories}
                    monthlySpent={monthlySpent}
                    monthlyEarned={monthlyEarned}
                    recentTransactionGroups={recentTransactionGroups}
                    spendingByCategory={spendingByCategory}
                    netWorthTrend={netWorthTrend}
                    transactionCount={state.transactions.length}
                    recurringCount={state.recurringRules.length}
                    onCreateTransaction={addTransaction}
                    onUpdateTransaction={updateTransaction}
                    onDeleteTransaction={deleteTransaction}
                />
            );
        }

        if (activeView === 'transactions') {
            return (
                <TransactionsPage
                    accounts={state.accounts}
                    categories={state.categories}
                    defaultCurrency={defaultCurrency}
                    transactions={normalizedTransactions}
                    onCreateTransaction={addTransaction}
                    onUpdateTransaction={updateTransaction}
                    onDeleteTransaction={deleteTransaction}
                />
            );
        }

        if (activeView === 'categories') {
            return (
                <CategoriesPage
                    accounts={state.accounts}
                    categories={state.categories}
                    defaultCurrency={defaultCurrency}
                    transactions={state.transactions}
                    normalizedTransactions={normalizedTransactions}
                    recurringRules={state.recurringRules}
                    spendingByCategory={spendingByCategory}
                    onAddAccount={addAccount}
                    onCreateCategory={addCategory}
                    onUpdateCategory={updateCategory}
                    onDeleteCategory={deleteCategory}
                />
            );
        }

        if (activeView === 'recurring') {
            return (
                <RecurringPage
                    accounts={state.accounts}
                    categories={state.categories}
                    defaultCurrency={defaultCurrency}
                    recurringRules={state.recurringRules}
                    onCreateRecurringRule={addRecurringRule}
                    onUpdateRecurringRule={updateRecurringRule}
                    onDeleteRecurringRule={deleteRecurringRule}
                    onRunDueEntries={() =>
                        dispatch({ type: financeActions.applyRecurringDue })
                    }
                />
            );
        }

        if (activeView === 'goals') {
            return (
                <GoalsPage
                    goals={state.goals}
                    currency={defaultCurrency}
                    onAddGoal={addGoal}
                    onContributeGoal={contributeToGoal}
                />
            );
        }

        return (
            <SettingsPage
                defaultCurrency={defaultCurrency}
                exchangeRateStatus={exchangeRateStatus}
                onChangeDefaultCurrency={(currency) =>
                    dispatch({
                        type: financeActions.setDefaultCurrency,
                        payload: currency,
                    })
                }
            />
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 sm:px-6 sm:py-6">
                <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 lg:flex lg:flex-col">
                    <div className="app-card flex h-full flex-col bg-slate-950 p-6 text-white">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-100">
                                Expense Tracker
                            </p>
                            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                                Finance, split into clear pages.
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                Each area now has its own page component, with the
                                main balance surfaced near the top instead of at
                                the bottom.
                            </p>
                        </div>

                        <div className="mt-6 rounded-[24px] bg-white/10 p-4">
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                Total balance
                            </p>
                            <p className="mt-2 text-2xl font-semibold">
                                {formatMoney(totalBalance, defaultCurrency)}
                            </p>
                        </div>

                        <nav className="mt-8 space-y-2">
                            {views.map(({ id, label, Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setActiveView(id)}
                                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                                        activeView === id
                                            ? 'bg-white text-slate-950'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-auto grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                    Accounts
                                </p>
                                <p className="mt-2 text-lg font-semibold text-white">
                                    {state.accounts.length}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                    Categories
                                </p>
                                <p className="mt-2 text-lg font-semibold text-white">
                                    {state.categories.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="min-w-0 flex-1 pb-24 lg:pb-0">{renderPage()}</main>
            </div>

            <nav className="fixed inset-x-0 bottom-4 z-20 px-4 lg:hidden">
                <div className="mx-auto flex max-w-2xl items-center justify-between rounded-[28px] border border-app-line bg-white/95 p-2 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
                    {views.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveView(id)}
                            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[20px] px-3 py-2 text-[11px] font-medium transition ${
                                activeView === id
                                    ? 'bg-brand-50 text-brand-600'
                                    : 'text-slate-500'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="truncate">{label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}
