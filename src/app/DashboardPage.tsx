import type { LucideIcon } from 'lucide-react';
import {
	ArrowUpDown,
	Flag,
	LayoutDashboard,
	Repeat,
	Settings,
	Tags,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useDashboardData } from '../hooks/useDashboardData';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useFinanceState } from '../hooks/useFinanceState';
import { useTheme } from '../hooks/useTheme';
import { financeActions } from '../state/actions';
import type {
	Category,
	Goal,
	RecurringRule,
	Transaction,
} from '../types/finance';
import { formatMoney } from '../utils/currency';
import { todayISO } from '../utils/date';
import { CategoriesPage } from './pages/CategoriesPage';
import { GoalsPage } from './pages/GoalsPage';
import { HomePage } from './pages/HomePage';
import { RecurringPage } from './pages/RecurringPage';
import { SettingsPage } from './pages/SettingsPage';
import { TransactionsPage } from './pages/TransactionsPage';

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
    const { theme, toggleTheme } = useTheme();
    const [activeView, setActiveView] = useState<ViewId>('home');

    const {
        defaultCurrency,
        budgetCycleStartDay,
        normalizedTransactions,
        currentBudgetCycleLabel,
        currentCycleSpent,
        currentCycleEarned,
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
    const activeIndex = views.findIndex((view) => view.id === activeView);

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

    function setBudgetCycleStartDay(day: number) {
        dispatch({
            type: financeActions.setBudgetCycleStartDay,
            payload: day,
        });
    }

    function renderPage(viewId: ViewId) {
        if (viewId === 'home') {
            return (
                <HomePage
                    balance={totalBalance}
                    defaultCurrency={defaultCurrency}
                    accounts={state.accounts}
                    categories={state.categories}
                    currentBudgetCycleLabel={currentBudgetCycleLabel}
                    currentCycleSpent={currentCycleSpent}
                    currentCycleEarned={currentCycleEarned}
                    recentTransactionGroups={recentTransactionGroups}
                    spendingByCategory={spendingByCategory}
                    netWorthTrend={netWorthTrend}
                    onCreateTransaction={addTransaction}
                    onUpdateTransaction={updateTransaction}
                    onDeleteTransaction={deleteTransaction}
                />
            );
        }

        if (viewId === 'transactions') {
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

        if (viewId === 'categories') {
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

        if (viewId === 'recurring') {
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

        if (viewId === 'goals') {
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
                budgetCycleStartDay={budgetCycleStartDay}
                exchangeRateStatus={exchangeRateStatus}
                onChangeDefaultCurrency={(currency) =>
                    dispatch({
                        type: financeActions.setDefaultCurrency,
                        payload: currency,
                    })
                }
                onChangeBudgetCycleStartDay={setBudgetCycleStartDay}
            />
        );
    }

    function jumpToView(viewId: ViewId) {
        setActiveView(viewId);
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
                                Money, organized into clear pages.
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                Jump between home, transactions, categories,
                                goals, and settings without losing your place.
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
                                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                                        activeView === id
                                            ? 'bg-brand-500 text-white shadow-[0_16px_30px_-20px_rgba(108,62,244,0.9)]'
                                            : 'text-slate-300 hover:bg-white/12 hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-auto flex items-end justify-end border-t border-white/10 pt-5">
                            <ThemeToggle
                                theme={theme}
                                onToggle={toggleTheme}
                                title="Toggle color mode"
                            />
                        </div>
                    </div>
                </aside>

                <main className="min-w-0 flex-1 pb-24 lg:pb-0">
                    <section className="mb-4 lg:hidden">
                        <div className="app-card overflow-hidden bg-slate-950 p-5 text-white">
                            <div className="flex items-start justify-between gap-4">
                                <div className="max-w-[15rem]">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-100">
                                        Expense Tracker
                                    </p>
                                    <h1 className="mt-3 text-xl font-semibold tracking-tight">
                                        Your money hub
                                    </h1>
                                    <p className="mt-2 text-sm leading-6 text-slate-300">
                                        Pick a section below and keep your main
                                        numbers close by.
                                    </p>
                                </div>
                                <ThemeToggle
                                    theme={theme}
                                    onToggle={toggleTheme}
                                    title="Toggle color mode"
                                />
                            </div>

                            <div className="mt-5 rounded-[22px] bg-white/10 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                    Total balance
                                </p>
                                <p className="mt-2 text-xl font-semibold">
                                    {formatMoney(totalBalance, defaultCurrency)}
                                </p>
                            </div>
                        </div>
                    </section>
                    {renderPage(activeView)}
                </main>
            </div>

            <nav className="fixed inset-x-0 bottom-4 z-20 px-4 lg:hidden">
                <div className="mx-auto max-w-2xl rounded-[28px] border border-app-line bg-white/95 p-2 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
                    <div className="relative flex items-center">
                        <span
                            className="pointer-events-none absolute inset-y-0 left-0 w-[calc(100%/6)] rounded-[20px] bg-brand-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{
                                transform: `translate3d(${activeIndex * 100}%, 0, 0)`,
                            }}
                        />
                        {views.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => jumpToView(id)}
                                aria-label={label}
                                className={`relative z-10 flex min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[20px] px-2 py-2 text-[10px] font-medium leading-tight transition-colors sm:px-3 ${
                                    activeView === id
                                        ? 'text-brand-700'
                                        : 'text-slate-500'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="sr-only">{label}</span>
                                <span className="hidden w-full truncate text-center sm:block">
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
}
