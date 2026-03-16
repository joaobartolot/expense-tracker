import { useState, type FormEvent } from 'react';
import { Landmark, Plus, Wallet } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { Card } from '../common/Card';
import { CATEGORY_ICON_OPTIONS } from '../../utils/categoryIconData';
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
        icon: 'tag',
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
        <Card
            title="Accounts & Categories"
            subtitle="Keep your money sources and classifications tidy."
        >
            <form onSubmit={submitAccount} className="mb-4 flex flex-col gap-3 sm:flex-row">
                <input
                    className="app-input"
                    placeholder="New bank account"
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                />
                <button className="app-button-secondary whitespace-nowrap">
                    <Plus className="mr-2 h-4 w-4" />
                    Add account
                </button>
            </form>

            <ul className="mb-6 space-y-3 text-sm">
                {accounts.map((account) => (
                    <li
                        key={account.id}
                        className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                    >
                        <div className="rounded-2xl bg-white p-2.5 text-brand-500 shadow-sm">
                            {account.type === 'bank' ? (
                                <Landmark className="h-4 w-4" />
                            ) : (
                                <Wallet className="h-4 w-4" />
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">
                                {account.name}
                            </p>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                {account.type}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            <form
                onSubmit={submitCategory}
                className="grid gap-3 md:grid-cols-2"
            >
                <input
                    className="app-input"
                    placeholder="Category"
                    value={categoryForm.name}
                    onChange={(event) =>
                        setCategoryForm({
                            ...categoryForm,
                            name: event.target.value,
                        })
                    }
                />
                <select
                    className="app-select"
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

                <div className="rounded-[24px] border border-app-line bg-slate-50 p-4 md:col-span-2">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-2xl bg-white p-3 text-brand-500 shadow-sm">
                            <CategoryIcon
                                iconKey={categoryForm.icon}
                                className="h-5 w-5"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Category icon
                            </p>
                            <p className="text-xs text-slate-500">
                                Use one consistent icon style across the app.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {CATEGORY_ICON_OPTIONS.map(({ key, label, Icon }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() =>
                                    setCategoryForm({ ...categoryForm, icon: key })
                                }
                                className={`rounded-2xl border px-3 py-3 text-left transition ${
                                    categoryForm.icon === key
                                        ? 'border-brand-500 bg-brand-50 text-brand-600'
                                        : 'border-app-line bg-white text-slate-500 hover:border-brand-100 hover:text-brand-500'
                                }`}
                            >
                                <Icon className="mb-2 h-4 w-4" />
                                <span className="block text-xs font-medium">
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <button className="app-button-primary md:col-span-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add category
                </button>
            </form>
        </Card>
    );
}
