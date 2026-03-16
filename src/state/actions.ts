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
    updateTransaction: 'UPDATE_TRANSACTION',
    deleteTransaction: 'DELETE_TRANSACTION',
    addAccount: 'ADD_ACCOUNT',
    addCategory: 'ADD_CATEGORY',
    updateCategory: 'UPDATE_CATEGORY',
    deleteCategory: 'DELETE_CATEGORY',
    addGoal: 'ADD_GOAL',
    contributeGoal: 'CONTRIBUTE_GOAL',
    addRecurringRule: 'ADD_RECURRING_RULE',
    updateRecurringRule: 'UPDATE_RECURRING_RULE',
    deleteRecurringRule: 'DELETE_RECURRING_RULE',
    applyRecurringDue: 'APPLY_RECURRING_DUE',
    setDefaultCurrency: 'SET_DEFAULT_CURRENCY',
} as const;

type FinanceActionMap = typeof financeActions;

export type FinanceAction =
    | { type: FinanceActionMap['addTransaction']; payload: Transaction }
    | { type: FinanceActionMap['updateTransaction']; payload: Transaction }
    | { type: FinanceActionMap['deleteTransaction']; payload: string }
    | { type: FinanceActionMap['addAccount']; payload: Account }
    | { type: FinanceActionMap['addCategory']; payload: Category }
    | { type: FinanceActionMap['updateCategory']; payload: Category }
    | { type: FinanceActionMap['deleteCategory']; payload: string }
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
    | { type: FinanceActionMap['updateRecurringRule']; payload: RecurringRule }
    | { type: FinanceActionMap['deleteRecurringRule']; payload: string }
    | { type: FinanceActionMap['applyRecurringDue'] }
    | { type: FinanceActionMap['setDefaultCurrency']; payload: Currency };
