import { useMemo, useState, type FormEvent } from 'react';
import { Card } from '../common/Card';
import { todayISO } from '../../utils/date';
import { CURRENCIES } from '../../data/constants';
import type {
    Account,
    Category,
    Currency,
    RecurringInterval,
    RecurringRule,
    TransactionType,
} from '../../types/finance';

interface RecurringTransactionsPanelProps {
    recurringRules: RecurringRule[];
    onApplyDue: () => void;
    onAddRule: (rule: Omit<RecurringRule, 'id'>) => void;
    categories: Category[];
    accounts: Account[];
    defaultCurrency: Currency;
}

interface RecurringRuleFormState {
    description: string;
    amount: string;
    currency?: Currency;
    type: TransactionType;
    interval: RecurringInterval;
    categoryId?: string;
    accountId?: string;
    nextDate: string;
}

export function RecurringTransactionsPanel({
    recurringRules,
    onApplyDue,
    onAddRule,
    categories,
    accounts,
    defaultCurrency,
}: RecurringTransactionsPanelProps) {
    const defaultExpenseCategory = useMemo(
        () =>
            categories.find((category) => category.type === 'expense')?.id ??
            categories[0]?.id,
        [categories],
    );

    const [form, setForm] = useState<RecurringRuleFormState>({
        description: '',
        amount: '',
        currency: undefined,
        type: 'expense',
        interval: 'monthly',
        categoryId: defaultExpenseCategory,
        accountId: accounts[0]?.id,
        nextDate: todayISO(),
    });

    const categoryOptions = useMemo(
        () => categories.filter((category) => category.type === form.type),
        [categories, form.type],
    );

    const selectedCurrency = form.currency ?? defaultCurrency;
    const selectedAccountId =
        accounts.find((account) => account.id === form.accountId)?.id ??
        accounts[0]?.id ??
        '';
    const selectedCategoryId =
        categoryOptions.find((category) => category.id === form.categoryId)
            ?.id ??
        categoryOptions[0]?.id ??
        '';

    function submitRecurring(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            !form.description ||
            !form.amount ||
            !selectedCategoryId ||
            !selectedAccountId
        ) {
            return;
        }

        onAddRule({
            ...form,
            amount: Number(form.amount),
            currency: selectedCurrency,
            categoryId: selectedCategoryId,
            accountId: selectedAccountId,
        });
        setForm((prev) => ({ ...prev, description: '', amount: '' }));
    }

    return (
        <Card
            title="Recurring Transactions"
            actions={
                <button
                    type="button"
                    onClick={onApplyDue}
                    className="rounded bg-brand-500 px-3 py-1 text-sm text-white"
                >
                    Apply Due
                </button>
            }
        >
            <form onSubmit={submitRecurring} className="grid gap-2">
                <input
                    required
                    className="rounded border p-2"
                    placeholder="Description"
                    value={form.description}
                    onChange={(event) =>
                        setForm({ ...form, description: event.target.value })
                    }
                />
                <input
                    required
                    className="rounded border p-2"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(event) =>
                        setForm({ ...form, amount: event.target.value })
                    }
                />

                <div className="grid grid-cols-2 gap-2">
                    <select
                        className="rounded border p-2"
                        value={form.type}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                type: event.target.value as TransactionType,
                            })
                        }
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <select
                        className="rounded border p-2"
                        value={form.interval}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                interval: event.target
                                    .value as RecurringInterval,
                            })
                        }
                    >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <select
                        className="rounded border p-2"
                        value={selectedCurrency}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                currency: event.target.value as Currency,
                            })
                        }
                    >
                        {CURRENCIES.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                    <input
                        className="rounded border p-2"
                        type="date"
                        value={form.nextDate}
                        onChange={(event) =>
                            setForm({ ...form, nextDate: event.target.value })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <select
                        className="rounded border p-2"
                        value={selectedAccountId}
                        onChange={(event) =>
                            setForm({ ...form, accountId: event.target.value })
                        }
                    >
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="rounded border p-2"
                        value={selectedCategoryId}
                        onChange={(event) =>
                            setForm({ ...form, categoryId: event.target.value })
                        }
                    >
                        {categoryOptions.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.icon} {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="rounded bg-slate-800 p-2 text-white"
                >
                    Add Recurring Rule
                </button>
            </form>

            <ul className="mt-3 space-y-1 text-sm text-slate-600">
                {recurringRules.map((rule) => (
                    <li key={rule.id}>
                        • {rule.description} ({rule.interval}) next:{' '}
                        {rule.nextDate}
                    </li>
                ))}
            </ul>
        </Card>
    );
}
