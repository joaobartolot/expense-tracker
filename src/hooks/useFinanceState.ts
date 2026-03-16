import { useEffect, useReducer, type Dispatch } from 'react';
import { STORAGE_KEY } from '../data/constants';
import { initialFinanceState } from '../state/initialState';
import { financeReducer } from '../state/reducer';
import type { FinanceAction } from '../state/actions';
import type { FinanceState } from '../types/finance';

function normalizeLoadedState(
    defaultState: FinanceState,
    parsedState: Partial<FinanceState>,
): FinanceState {
    return {
        ...defaultState,
        ...parsedState,
        settings: {
            ...defaultState.settings,
            ...parsedState.settings,
            budgetCycleStartDay: Math.min(
                31,
                Math.max(
                    1,
                    Math.trunc(parsedState.settings?.budgetCycleStartDay || 1),
                ),
            ),
        },
        accounts: parsedState.accounts ?? defaultState.accounts,
        categories: parsedState.categories ?? defaultState.categories,
        transactions: parsedState.transactions ?? defaultState.transactions,
        recurringRules: parsedState.recurringRules ?? defaultState.recurringRules,
        goals: parsedState.goals ?? defaultState.goals,
    };
}

function loadInitialState(defaultState: FinanceState) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        return raw
            ? normalizeLoadedState(
                  defaultState,
                  JSON.parse(raw) as Partial<FinanceState>,
              )
            : defaultState;
    } catch {
        return defaultState;
    }
}

export function useFinanceState() {
    const [state, dispatch] = useReducer(
        financeReducer,
        initialFinanceState,
        loadInitialState,
    );

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    return { state, dispatch } as {
        state: FinanceState;
        dispatch: Dispatch<FinanceAction>;
    };
}
