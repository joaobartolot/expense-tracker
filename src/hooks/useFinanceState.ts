import { useEffect, useReducer, type Dispatch } from 'react';
import { STORAGE_KEY } from '../data/constants';
import { initialFinanceState } from '../state/initialState';
import { financeReducer } from '../state/reducer';
import type { FinanceAction } from '../state/actions';
import type { FinanceState } from '../types/finance';

function loadInitialState(defaultState: FinanceState) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        return raw ? (JSON.parse(raw) as FinanceState) : defaultState;
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
