import { useMemo, useState, type FormEvent } from 'react';
import { ArrowUpDown, Plus } from 'lucide-react';
import { CURRENCIES } from '../../data/constants';
import { todayISO } from '../../utils/date';
import { CategoryIcon } from '../common/CategoryIcon';
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

    const selectedCategory = categories.find(
        (category) => category.id === selectedCategoryId,
    );

    return (
        <Card
            title="New Transaction"
            subtitle="Capture spending and income without leaving the flow."
        >
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <input
                    required
                    className="app-input"
                    placeholder="Description"
                    value={form.description}
                    onChange={(event) =>
                        setForm({ ...form, description: event.target.value })
                    }
                />
                <input
                    required
                    className="app-input"
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
                    className="app-input"
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                        setForm({ ...form, date: event.target.value })
                    }
                />

                <select
                    className="app-select"
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
                    className="app-select"
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
                    className="app-select"
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

                <label className="md:col-span-2 xl:col-span-2">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        Category
                    </span>
                    <div className="flex items-center gap-3 rounded-2xl border border-app-line bg-white px-4 py-3">
                        <div className="rounded-2xl bg-brand-50 p-2.5 text-brand-500">
                            <CategoryIcon
                                iconKey={selectedCategory?.icon}
                                className="h-4 w-4"
                            />
                        </div>
                        <select
                            className="w-full bg-transparent text-sm text-slate-900 outline-none"
                            value={selectedCategoryId}
                            onChange={(event) =>
                                setForm({ ...form, categoryId: event.target.value })
                            }
                        >
                            {categoryOptions.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </label>

                <button
                    type="submit"
                    className="app-button-primary"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add transaction
                </button>
            </form>
        </Card>
    );
}
