import { useState, type FormEvent } from 'react';
import { Card } from '../common/Card';
import type { Account, Category } from '../../types/finance';

interface AccountsCategoriesPanelProps {
    accounts: Account[];
    onAddAccount: (accountName: string) => void;
    onAddCategory: (category: Omit<Category, 'id'>) => void;
}

export function AccountsCategoriesPanel({
    accounts,
    onAddAccount,
    onAddCategory,
}: AccountsCategoriesPanelProps) {
    const [accountName, setAccountName] = useState('');
    const [categoryForm, setCategoryForm] = useState<Omit<Category, 'id'>>({
        name: '',
        icon: '🏷️',
        type: 'expense',
    });

    function submitAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!accountName.trim()) {
            return;
        }

        onAddAccount(accountName.trim());
        setAccountName('');
    }

    function submitCategory(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!categoryForm.name.trim()) {
            return;
        }

        onAddCategory(categoryForm);
        setCategoryForm((prev) => ({ ...prev, name: '' }));
    }

    return (
        <Card title="Accounts & Categories">
            <form onSubmit={submitAccount} className="mb-3 flex gap-2">
                <input
                    className="w-full rounded border p-2"
                    placeholder="New bank account"
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                />
                <button className="rounded bg-slate-800 px-3 text-white">
                    Add
                </button>
            </form>

            <ul className="mb-4 space-y-1 text-sm">
                {accounts.map((account) => (
                    <li key={account.id}>
                        • {account.name}{' '}
                        <span className="text-slate-500">({account.type})</span>
                    </li>
                ))}
            </ul>

            <form
                onSubmit={submitCategory}
                className="grid gap-2 md:grid-cols-3"
            >
                <input
                    className="rounded border p-2"
                    placeholder="Category"
                    value={categoryForm.name}
                    onChange={(event) =>
                        setCategoryForm({
                            ...categoryForm,
                            name: event.target.value,
                        })
                    }
                />
                <input
                    className="rounded border p-2"
                    placeholder="Icon"
                    value={categoryForm.icon}
                    onChange={(event) =>
                        setCategoryForm({
                            ...categoryForm,
                            icon: event.target.value,
                        })
                    }
                />
                <select
                    className="rounded border p-2"
                    value={categoryForm.type}
                    onChange={(event) =>
                        setCategoryForm({
                            ...categoryForm,
                            type: event.target.value as Category['type'],
                        })
                    }
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <button className="rounded bg-slate-800 px-3 py-2 text-white md:col-span-3">
                    Add Category
                </button>
            </form>
        </Card>
    );
}
