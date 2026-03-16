import { financeActions } from '../state/actions';
import { todayISO } from '../utils/date';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useFinanceState } from '../hooks/useFinanceState';
import { useDashboardData } from '../hooks/useDashboardData';
import type {
    Category,
    Goal,
    RecurringRule,
    Transaction,
} from '../types/finance';

import { AppHeader } from '../components/common/AppHeader';
import { MonthlySummaryCards } from '../components/dashboard/MonthlySummaryCards';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { SpendingByCategoryChart } from '../components/dashboard/SpendingByCategoryChart';
import { NetWorthTrendChart } from '../components/dashboard/NetWorthTrendChart';
import { TransactionForm } from '../components/forms/TransactionForm';
import { AccountsCategoriesPanel } from '../components/forms/AccountsCategoriesPanel';
import { RecurringTransactionsPanel } from '../components/forms/RecurringTransactionsPanel';
import { SettingsPanel } from '../components/settings/SettingsPanel';
import { GoalsPanel } from '../components/goals/GoalsPanel';

export function DashboardPage() {
    const { rates, status: exchangeRateStatus } = useExchangeRates();
    const { state, dispatch } = useFinanceState();

    const {
        defaultCurrency,
        monthlySpent,
        monthlyEarned,
        spendingByCategory,
        recentTransactionGroups,
        netWorthTrend,
    } = useDashboardData(state, rates);

    function addTransaction(transaction: Omit<Transaction, 'id'>) {
        dispatch({
            type: financeActions.addTransaction,
            payload: { id: crypto.randomUUID(), ...transaction },
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

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
            <AppHeader />

            <MonthlySummaryCards
                spent={monthlySpent}
                earned={monthlyEarned}
                currency={defaultCurrency}
            />

            <section className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <RecentTransactions
                        groups={recentTransactionGroups}
                        categories={state.categories}
                        defaultCurrency={defaultCurrency}
                    />
                    <TransactionForm
                        accounts={state.accounts}
                        categories={state.categories}
                        defaultCurrency={defaultCurrency}
                        onSubmit={addTransaction}
                    />
                </div>

                <div className="space-y-4">
                    <SpendingByCategoryChart
                        data={spendingByCategory}
                        spent={monthlySpent}
                        defaultCurrency={defaultCurrency}
                    />
                    <NetWorthTrendChart points={netWorthTrend} />
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <AccountsCategoriesPanel
                    accounts={state.accounts}
                    onAddAccount={addAccount}
                    onAddCategory={addCategory}
                />

                <RecurringTransactionsPanel
                    recurringRules={state.recurringRules}
                    categories={state.categories}
                    accounts={state.accounts}
                    defaultCurrency={defaultCurrency}
                    onApplyDue={() =>
                        dispatch({ type: financeActions.applyRecurringDue })
                    }
                    onAddRule={addRecurringRule}
                />

                <SettingsPanel
                    defaultCurrency={defaultCurrency}
                    exchangeRateStatus={exchangeRateStatus}
                    onChangeDefaultCurrency={(currency) =>
                        dispatch({
                            type: financeActions.setDefaultCurrency,
                            payload: currency,
                        })
                    }
                />
            </section>

            <GoalsPanel
                goals={state.goals}
                currency={defaultCurrency}
                onAddGoal={addGoal}
                onContributeGoal={contributeToGoal}
            />
        </div>
    );
}
