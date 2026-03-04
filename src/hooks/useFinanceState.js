import { useEffect, useReducer } from 'react';
import { STORAGE_KEY } from '../data/constants';
import { initialFinanceState } from '../state/initialState';
import { financeReducer } from '../state/reducer';

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialFinanceState;
  } catch {
    return initialFinanceState;
  }
}

export function useFinanceState() {
  const [state, dispatch] = useReducer(financeReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
