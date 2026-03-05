import { DEFAULT_CATEGORIES } from '../data/constants';
import { todayISO } from '../utils/date';

export const initialFinanceState = {
  settings: { defaultCurrency: 'USD' },
  accounts: [
    { id: 'acc-checking', name: 'Checking', type: 'bank' },
    { id: 'acc-cash', name: 'Cash', type: 'cash' },
  ],
  categories: DEFAULT_CATEGORIES,
  transactions: [],
  recurringRules: [
    {
      id: crypto.randomUUID(),
      description: 'Monthly Salary',
      amount: 3000,
      currency: 'USD',
      type: 'income',
      accountId: 'acc-checking',
      categoryId: 'cat-salary',
      interval: 'monthly',
      nextDate: todayISO(),
    },
  ],
  goals: [],
};
