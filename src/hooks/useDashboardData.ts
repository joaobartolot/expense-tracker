import { useMemo } from 'react';
import { convertAmount } from '../utils/currency';
import { getBudgetCycleBounds } from '../utils/date';
import type {
    ExchangeRates,
    FinanceState,
    NetWorthPoint,
    NormalizedTransaction,
    RecentTransactionGroups,
    SpendingByCategoryEntry,
} from '../types/finance';

export function useDashboardData(state: FinanceState, rates: ExchangeRates) {
    const defaultCurrency = state.settings.defaultCurrency;
    const budgetCycleStartDay = state.settings.budgetCycleStartDay;

    const normalizedTransactions = useMemo<NormalizedTransaction[]>(
        () =>
            state.transactions.map((transaction) => ({
                ...transaction,
                converted: convertAmount(
                    transaction.amount,
                    transaction.currency,
                    defaultCurrency,
                    rates,
                ),
            })),
        [state.transactions, defaultCurrency, rates],
    );

    const currentBudgetCycle = useMemo(
        () => getBudgetCycleBounds(new Date(), budgetCycleStartDay),
        [budgetCycleStartDay],
    );

    const currentCycleTransactions = useMemo(() => {
        return normalizedTransactions.filter((transaction) => {
            return (
                transaction.date >= currentBudgetCycle.start &&
                transaction.date < currentBudgetCycle.endExclusive
            );
        });
    }, [currentBudgetCycle.endExclusive, currentBudgetCycle.start, normalizedTransactions]);

    const currentCycleSpent = currentCycleTransactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.converted, 0);

    const currentCycleEarned = currentCycleTransactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.converted, 0);

    const spendingByCategory = useMemo<SpendingByCategoryEntry[]>(() => {
        const totals: Record<string, number> = {};

        currentCycleTransactions
            .filter((transaction) => transaction.type === 'expense')
            .forEach((transaction) => {
                const category = state.categories.find(
                    (item) => item.id === transaction.categoryId,
                );
                const label = category?.name ?? 'Uncategorized';

                totals[label] = (totals[label] || 0) + transaction.converted;
            });

        return Object.entries(totals).sort((a, b) => b[1] - a[1]);
    }, [currentCycleTransactions, state.categories]);

    const recentTransactionGroups = useMemo<RecentTransactionGroups>(() => {
        const sorted = [...normalizedTransactions].sort((a, b) =>
            b.date.localeCompare(a.date),
        );

        return sorted.reduce<RecentTransactionGroups>((groups, transaction) => {
            groups[transaction.date] = groups[transaction.date] || [];
            groups[transaction.date].push(transaction);

            return groups;
        }, {});
    }, [normalizedTransactions]);

    const netWorthTrend = useMemo<NetWorthPoint[]>(() => {
        const cycleChanges = Array.from({ length: 6 }, (_, index) => {
            const cycleStart = getBudgetCycleBounds(
                new Date(
                    currentBudgetCycle.startDate.getFullYear(),
                    currentBudgetCycle.startDate.getMonth() - (5 - index),
                    currentBudgetCycle.startDate.getDate(),
                ),
                budgetCycleStartDay,
            );

            const cycleTransactions = normalizedTransactions.filter(
                (transaction) => {
                    return (
                        transaction.date >= cycleStart.start &&
                        transaction.date < cycleStart.endExclusive
                    );
                },
            );

            return {
                label: cycleStart.startDate.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                }),
                change: cycleTransactions.reduce(
                    (sum, transaction) =>
                        sum +
                        (transaction.type === 'income'
                            ? transaction.converted
                            : -transaction.converted),
                    0,
                ),
            };
        });

        return cycleChanges.map((entry, index) => ({
            label: entry.label,
            value: cycleChanges
                .slice(0, index + 1)
                .reduce((sum, currentEntry) => sum + currentEntry.change, 0),
        }));
    }, [budgetCycleStartDay, currentBudgetCycle.startDate, normalizedTransactions]);

    return {
        defaultCurrency,
        budgetCycleStartDay,
        normalizedTransactions,
        currentBudgetCycleLabel: currentBudgetCycle.label,
        currentCycleSpent,
        currentCycleEarned,
        spendingByCategory,
        recentTransactionGroups,
        netWorthTrend,
    };
}
