export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'BRL' | 'INR';

export type TransactionType = 'expense' | 'income';
export type AccountType = 'bank' | 'cash';
export type RecurringInterval = 'monthly' | 'weekly';
export type ExchangeRateStatus = 'loading' | 'success' | 'fallback';

export interface Account {
    id: string;
    name: string;
    type: AccountType;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    type: TransactionType;
}

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    currency: Currency;
    type: TransactionType;
    date: string;
    categoryId: string;
    accountId: string;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
}

export interface RecurringRule {
    id: string;
    description: string;
    amount: number;
    currency: Currency;
    type: TransactionType;
    accountId: string;
    categoryId: string;
    interval: RecurringInterval;
    nextDate: string;
}

export interface FinanceSettings {
    defaultCurrency: Currency;
}

export interface FinanceState {
    settings: FinanceSettings;
    accounts: Account[];
    categories: Category[];
    transactions: Transaction[];
    recurringRules: RecurringRule[];
    goals: Goal[];
}

export type ExchangeRates = Record<string, number>;

export interface NormalizedTransaction extends Transaction {
    converted: number;
}

export type SpendingByCategoryEntry = [string, number];
export type RecentTransactionGroups = Record<string, NormalizedTransaction[]>;

export interface NetWorthPoint {
    label: string;
    value: number;
}
