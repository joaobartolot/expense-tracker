import { useMemo, useState, type FormEvent } from 'react';
import { CURRENCIES } from '../../data/constants';
import { todayISO } from '../../utils/date';
import { Card } from '../common/Card';
import type {
    Account,
    Category,
    Currency,
    Transaction,
    TransactionType,
} from '../../types/finance';

interface TransactionFormProps {
    accounts: Account[];
    categories: Category[];
    defaultCurrency: Currency;
    onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

interface TransactionFormState {
    description: string;
    amount: string;
    currency?: Currency;
    type: TransactionType;
    date: string;
    categoryId?: string;
    accountId?: string;
}

export function TransactionForm({
    accounts,
    categories,
    defaultCurrency,
    onSubmit,
}: TransactionFormProps) {
    const defaultExpenseCategory = useMemo(
        () =>
            categories.find((category) => category.type === 'expense')?.id ??
            categories[0]?.id,
        [categories],
    );

    const [form, setForm] = useState<TransactionFormState>({
        description: '',
        amount: '',
        currency: undefined,
        type: 'expense',
        date: todayISO(),
        categoryId: defaultExpenseCategory,
        accountId: accounts[0]?.id,
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

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            !form.description ||
            !form.amount ||
            !selectedCategoryId ||
            !selectedAccountId
        ) {
            return;
        }

        onSubmit({
            ...form,
            amount: Number(form.amount),
            currency: selectedCurrency,
            categoryId: selectedCategoryId,
            accountId: selectedAccountId,
        });

        setForm((prev) => ({ ...prev, description: '', amount: '' }));
    }

    return (
        <Card title="Add Transaction">
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-3">
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
                <input
                    required
                    className="rounded border p-2"
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                        setForm({ ...form, date: event.target.value })
                    }
                />

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
                    className="rounded border p-2 md:col-span-2"
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

                <button
                    type="submit"
                    className="rounded bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-700"
                >
                    Add
                </button>
            </form>
        </Card>
    );
}
