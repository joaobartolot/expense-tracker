import { useMemo, useState, type FormEvent } from 'react';
import { CalendarSync } from 'lucide-react';
import { CURRENCIES } from '../../data/constants';
import { todayISO } from '../../utils/date';
import { CategoryIcon } from '../common/CategoryIcon';
import type {
    Account,
    Category,
    Currency,
    RecurringInterval,
    RecurringRule,
    TransactionType,
} from '../../types/finance';

interface RecurringRuleEditorProps {
    accounts: Account[];
    categories: Category[];
    defaultCurrency: Currency;
    initialValue?: RecurringRule;
    submitLabel: string;
    onSubmit: (rule: Omit<RecurringRule, 'id'>) => void;
    onCancel?: () => void;
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

export function RecurringRuleEditor({
    accounts,
    categories,
    defaultCurrency,
    initialValue,
    submitLabel,
    onSubmit,
    onCancel,
}: RecurringRuleEditorProps) {
    const defaultExpenseCategory = useMemo(
        () =>
            categories.find((category) => category.type === 'expense')?.id ??
            categories[0]?.id,
        [categories],
    );

    const [form, setForm] = useState<RecurringRuleFormState>({
        description: initialValue?.description ?? '',
        amount:
            initialValue?.amount === undefined ? '' : String(initialValue.amount),
        currency: initialValue?.currency,
        type: initialValue?.type ?? 'expense',
        interval: initialValue?.interval ?? 'monthly',
        categoryId: initialValue?.categoryId ?? defaultExpenseCategory,
        accountId: initialValue?.accountId ?? accounts[0]?.id,
        nextDate: initialValue?.nextDate ?? todayISO(),
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
    const selectedCategory = categories.find(
        (category) => category.id === selectedCategoryId,
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            !form.description.trim() ||
            !form.amount ||
            !selectedCategoryId ||
            !selectedAccountId
        ) {
            return;
        }

        onSubmit({
            description: form.description.trim(),
            amount: Number(form.amount),
            currency: selectedCurrency,
            type: form.type,
            interval: form.interval,
            categoryId: selectedCategoryId,
            accountId: selectedAccountId,
            nextDate: form.nextDate,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
            <input
                required
                className="app-input md:col-span-2"
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
                onChange={(event) => setForm({ ...form, amount: event.target.value })}
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
                value={form.interval}
                onChange={(event) =>
                    setForm({
                        ...form,
                        interval: event.target.value as RecurringInterval,
                    })
                }
            >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
            </select>
            <input
                className="app-input"
                type="date"
                value={form.nextDate}
                onChange={(event) =>
                    setForm({ ...form, nextDate: event.target.value })
                }
            />
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
            <div className="rounded-[24px] border border-brand-100 bg-brand-50/70 p-4 text-sm text-slate-600 md:col-span-2">
                The next run date is the first date this rule becomes eligible.
                Running due entries creates transactions for any rule due today
                or earlier, then moves the next run forward.
            </div>
            <div className="flex justify-end gap-3 md:col-span-2">
                {onCancel ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="app-button-secondary"
                    >
                        Cancel
                    </button>
                ) : null}
                <button type="submit" className="app-button-primary">
                    <CalendarSync className="mr-2 h-4 w-4" />
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
