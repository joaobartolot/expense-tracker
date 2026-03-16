import type { Category, Currency, ExchangeRates } from '../types/finance';

export const STORAGE_KEY = 'expense-tracker-state-v2';

export const CURRENCIES = [
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CAD',
    'BRL',
    'INR',
] as const satisfies readonly Currency[];

export const DEFAULT_CATEGORIES: Category[] = [
    { id: 'cat-food', name: 'Food', icon: '🍔', type: 'expense' },
    { id: 'cat-rent', name: 'Rent', icon: '🏠', type: 'expense' },
    { id: 'cat-transport', name: 'Transport', icon: '🚌', type: 'expense' },
    { id: 'cat-health', name: 'Health', icon: '💊', type: 'expense' },
    { id: 'cat-salary', name: 'Salary', icon: '💼', type: 'income' },
    { id: 'cat-freelance', name: 'Freelance', icon: '🧑‍💻', type: 'income' },
];

export const FALLBACK_RATES: ExchangeRates = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.79,
    JPY: 149,
    CAD: 1.34,
    BRL: 4.9,
    INR: 83,
};
