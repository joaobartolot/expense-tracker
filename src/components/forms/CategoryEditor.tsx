import { useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { CATEGORY_ICON_OPTIONS } from '../../utils/categoryIconData';
import type { Category } from '../../types/finance';

interface CategoryEditorProps {
    initialValue?: Category;
    submitLabel: string;
    onSubmit: (category: Omit<Category, 'id'>) => void;
    onCancel?: () => void;
}

export function CategoryEditor({
    initialValue,
    submitLabel,
    onSubmit,
    onCancel,
}: CategoryEditorProps) {
    const [form, setForm] = useState<Omit<Category, 'id'>>({
        name: initialValue?.name ?? '',
        icon: initialValue?.icon ?? 'tag',
        type: initialValue?.type ?? 'expense',
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.name.trim()) {
            return;
        }

        onSubmit({
            ...form,
            name: form.name.trim(),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <input
                className="app-input"
                placeholder="Category name"
                value={form.name}
                onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                }
            />
            <select
                className="app-select"
                value={form.type}
                onChange={(event) =>
                    setForm({
                        ...form,
                        type: event.target.value as Category['type'],
                    })
                }
            >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>

            <div className="rounded-[24px] border border-app-line bg-slate-50 p-4">
                <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-white p-3 text-brand-500 shadow-sm">
                        <CategoryIcon iconKey={form.icon} className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Category icon
                        </p>
                        <p className="text-xs text-slate-500">
                            Pick the icon that best matches this category.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {CATEGORY_ICON_OPTIONS.map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setForm({ ...form, icon: key })}
                            className={`rounded-2xl border px-3 py-3 text-left transition ${
                                form.icon === key
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

            <div className="flex justify-end gap-3">
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
                    <Save className="mr-2 h-4 w-4" />
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
