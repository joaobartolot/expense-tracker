import { useMemo } from 'react';
import { convertAmount } from '../utils/currency';

export function useDashboardData(state, rates) {
  const defaultCurrency = state.settings.defaultCurrency;

  const normalizedTransactions = useMemo(
    () =>
      state.transactions.map((transaction) => ({
        ...transaction,
        converted: convertAmount(transaction.amount, transaction.currency, defaultCurrency, rates),
      })),
    [state.transactions, defaultCurrency, rates]
  );

  const currentMonthTransactions = useMemo(() => {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    return normalizedTransactions.filter((transaction) => {
      const date = new Date(`${transaction.date}T00:00:00`);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }, [normalizedTransactions]);

  const monthlySpent = currentMonthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.converted, 0);

  const monthlyEarned = currentMonthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.converted, 0);

  const spendingByCategory = useMemo(() => {
    const totals = {};

    currentMonthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        const category = state.categories.find((item) => item.id === transaction.categoryId);
        const label = category ? `${category.icon} ${category.name}` : 'Uncategorized';
        totals[label] = (totals[label] || 0) + transaction.converted;
      });

    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [currentMonthTransactions, state.categories]);

  const recentTransactionGroups = useMemo(() => {
    const sorted = [...normalizedTransactions].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.reduce((groups, transaction) => {
      groups[transaction.date] = groups[transaction.date] || [];
      groups[transaction.date].push(transaction);
      return groups;
    }, {});
  }, [normalizedTransactions]);

  const netWorthTrend = useMemo(() => {
    let runningBalance = 0;

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthlyTransactions = normalizedTransactions.filter((transaction) => {
        const transactionDate = new Date(`${transaction.date}T00:00:00`);
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
      });

      runningBalance += monthlyTransactions.reduce(
        (sum, transaction) => sum + (transaction.type === 'income' ? transaction.converted : -transaction.converted),
        0
      );

      return {
        label: date.toLocaleDateString(undefined, { month: 'short' }),
        value: runningBalance,
      };
    });
  }, [normalizedTransactions]);

  return {
    defaultCurrency,
    normalizedTransactions,
    monthlySpent,
    monthlyEarned,
    spendingByCategory,
    recentTransactionGroups,
    netWorthTrend,
  };
}
