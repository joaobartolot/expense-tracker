import type {
    Account,
    Category,
    Currency,
    Goal,
    RecurringRule,
    Transaction,
} from '../types/finance';

export const financeActions = {
    addTransaction: 'ADD_TRANSACTION',
    addAccount: 'ADD_ACCOUNT',
    addCategory: 'ADD_CATEGORY',
    addGoal: 'ADD_GOAL',
    contributeGoal: 'CONTRIBUTE_GOAL',
    addRecurringRule: 'ADD_RECURRING_RULE',
    applyRecurringDue: 'APPLY_RECURRING_DUE',
    setDefaultCurrency: 'SET_DEFAULT_CURRENCY',
} as const;

type FinanceActionMap = typeof financeActions;

export type FinanceAction =
    | { type: FinanceActionMap['addTransaction']; payload: Transaction }
    | { type: FinanceActionMap['addAccount']; payload: Account }
    | { type: FinanceActionMap['addCategory']; payload: Category }
    | { type: FinanceActionMap['addGoal']; payload: Goal }
    | {
          type: FinanceActionMap['contributeGoal'];
          payload: {
              goalId: string;
              amount: number;
              transaction: Transaction;
          };
      }
    | { type: FinanceActionMap['addRecurringRule']; payload: RecurringRule }
    | { type: FinanceActionMap['applyRecurringDue'] }
    | { type: FinanceActionMap['setDefaultCurrency']; payload: Currency };
