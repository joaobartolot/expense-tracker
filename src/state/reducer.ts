import { financeActions, type FinanceAction } from './actions';
import { shiftDate, todayISO } from '../utils/date';
import type { FinanceState, Transaction } from '../types/finance';

export function financeReducer(
    state: FinanceState,
    action: FinanceAction,
): FinanceState {
    switch (action.type) {
        case financeActions.addTransaction:
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
            };

        case financeActions.addAccount:
            return {
                ...state,
                accounts: [...state.accounts, action.payload],
            };

        case financeActions.addCategory:
            return {
                ...state,
                categories: [...state.categories, action.payload],
            };

        case financeActions.addGoal:
            return {
                ...state,
                goals: [...state.goals, action.payload],
            };

        case financeActions.contributeGoal:
            return {
                ...state,
                goals: state.goals.map((goal) =>
                    goal.id === action.payload.goalId
                        ? {
                              ...goal,
                              currentAmount:
                                  goal.currentAmount + action.payload.amount,
                          }
                        : goal,
                ),
                transactions: [
                    action.payload.transaction,
                    ...state.transactions,
                ],
            };

        case financeActions.addRecurringRule:
            return {
                ...state,
                recurringRules: [...state.recurringRules, action.payload],
            };

        case financeActions.applyRecurringDue: {
            const today = todayISO();
            const createdTransactions: Transaction[] = [];

            const updatedRules = state.recurringRules.map((rule) => {
                let nextDate = rule.nextDate;

                while (nextDate <= today) {
                    createdTransactions.push({
                        id: crypto.randomUUID(),
                        description: rule.description,
                        amount: rule.amount,
                        currency: rule.currency,
                        type: rule.type,
                        date: nextDate,
                        categoryId: rule.categoryId,
                        accountId: rule.accountId,
                    });

                    nextDate = shiftDate(nextDate, rule.interval);
                }

                return { ...rule, nextDate };
            });

            return {
                ...state,
                recurringRules: updatedRules,
                transactions: [...createdTransactions, ...state.transactions],
            };
        }

        case financeActions.setDefaultCurrency:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    defaultCurrency: action.payload,
                },
            };

        default:
            return state;
    }
}
