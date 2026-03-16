import { useMemo, useState } from 'react';
import { Landmark, Pencil, Plus, Trash2, Wallet } from 'lucide-react';
import { AppHeader } from '../../components/common/AppHeader';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { CategoryEditor } from '../../components/forms/CategoryEditor';
import { formatMoney } from '../../utils/currency';
import type {
    Account,
    Category,
    Currency,
    NormalizedTransaction,
    RecurringRule,
    SpendingByCategoryEntry,
    Transaction,
} from '../../types/finance';

interface CategoriesPageProps {
    accounts: Account[];
    categories: Category[];
    defaultCurrency: Currency;
    transactions: Transaction[];
    normalizedTransactions: NormalizedTransaction[];
    recurringRules: RecurringRule[];
    spendingByCategory: SpendingByCategoryEntry[];
    onAddAccount: (accountName: string) => void;
    onCreateCategory: (category: Omit<Category, 'id'>) => void;
    onUpdateCategory: (category: Category) => void;
    onDeleteCategory: (categoryId: string) => void;
}

const pieColors = ['#6c3ef4', '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#0f172a'];

function describeArc(
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
) {
    const start = {
        x: cx + radius * Math.cos(startAngle),
        y: cy + radius * Math.sin(startAngle),
    };
    const end = {
        x: cx + radius * Math.cos(endAngle),
        y: cy + radius * Math.sin(endAngle),
    };
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

export function CategoriesPage({
    accounts,
    categories,
    defaultCurrency,
    transactions,
    normalizedTransactions,
    recurringRules,
    spendingByCategory,
    onAddAccount,
    onCreateCategory,
    onUpdateCategory,
    onDeleteCategory,
}: CategoriesPageProps) {
    const [accountName, setAccountName] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [activeCategoryId, setActiveCategoryId] = useState<string>(
        categories[0]?.id ?? '',
    );

    const activeCategory =
        categories.find((category) => category.id === activeCategoryId) ??
        categories[0];

    const transactionsForCategory = useMemo(
        () =>
            normalizedTransactions.filter(
                (transaction) => transaction.categoryId === activeCategory?.id,
            ),
        [normalizedTransactions, activeCategory],
    );

    const pieSlices = useMemo(() => {
        const total = spendingByCategory.reduce((sum, [, value]) => sum + value, 0);

        return spendingByCategory.reduce<
            { startAngle: number; slices: Array<{ label: string; value: number; color: string; path: string }> }
        >(
            (accumulator, [label, value], index) => {
                const sliceAngle =
                    total === 0 ? 0 : (value / total) * Math.PI * 2;
                const endAngle = accumulator.startAngle + sliceAngle;

                return {
                    startAngle: endAngle,
                    slices: [
                        ...accumulator.slices,
                        {
                            label,
                            value,
                            color: pieColors[index % pieColors.length],
                            path:
                                sliceAngle === 0
                                    ? ''
                                    : describeArc(
                                          110,
                                          110,
                                          90,
                                          accumulator.startAngle,
                                          endAngle,
                                      ),
                        },
                    ],
                };
            },
            { startAngle: -Math.PI / 2, slices: [] },
        ).slices;
    }, [spendingByCategory]);

    function handleAccountSubmit() {
        if (!accountName.trim()) {
            return;
        }

        onAddAccount(accountName.trim());
        setAccountName('');
    }

    return (
        <div className="space-y-6">
            <AppHeader
                eyebrow="Categories"
                title="Category overview"
                description="Browse categories, inspect transactions within each category, and see spending split in a pie chart."
                meta={
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="app-button-primary"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add category
                    </button>
                }
            />

            <section className="grid gap-4 md:grid-cols-3">
                <Card title="Total Categories">
                    <p className="text-3xl font-semibold text-slate-900">
                        {categories.length}
                    </p>
                </Card>
                <Card title="Expense Categories">
                    <p className="text-3xl font-semibold text-slate-900">
                        {categories.filter((category) => category.type === 'expense').length}
                    </p>
                </Card>
                <Card title="Income Categories">
                    <p className="text-3xl font-semibold text-slate-900">
                        {categories.filter((category) => category.type === 'income').length}
                    </p>
                </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Card
                    title="Spending by Category"
                    subtitle="Current-month expense split shown as a pie chart."
                >
                    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
                        <svg viewBox="0 0 220 220" className="h-56 w-56">
                            {pieSlices.length ? (
                                pieSlices.map((slice) => (
                                    <path
                                        key={slice.label}
                                        d={slice.path}
                                        fill={slice.color}
                                    />
                                ))
                            ) : (
                                <circle cx="110" cy="110" r="90" fill="#e2e8f0" />
                            )}
                            <circle cx="110" cy="110" r="46" fill="white" />
                        </svg>

                        <div className="w-full space-y-3">
                            {pieSlices.map((slice) => (
                                <div
                                    key={slice.label}
                                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: slice.color }}
                                        />
                                        <span className="text-sm font-medium text-slate-700">
                                            {slice.label}
                                        </span>
                                    </div>
                                    <span className="text-sm text-slate-500">
                                        {formatMoney(slice.value, defaultCurrency)}
                                    </span>
                                </div>
                            ))}
                            {!pieSlices.length ? (
                                <p className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                    No category spending yet.
                                </p>
                            ) : null}
                        </div>
                    </div>
                </Card>

                <Card
                    title="Categories"
                    subtitle="Pick a category to inspect its related transactions."
                >
                    <div className="space-y-3">
                        {categories.map((category) => {
                            const transactionCount = transactions.filter(
                                (item) => item.categoryId === category.id,
                            ).length;
                            const recurringCount = recurringRules.filter(
                                (item) => item.categoryId === category.id,
                            ).length;
                            const inUse = transactionCount > 0 || recurringCount > 0;

                            return (
                                <div
                                    key={category.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setActiveCategoryId(category.id)}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === 'Enter' ||
                                            event.key === ' '
                                        ) {
                                            event.preventDefault();
                                            setActiveCategoryId(category.id);
                                        }
                                    }}
                                    className={`flex w-full items-center justify-between gap-4 rounded-[24px] border p-4 text-left transition ${
                                        activeCategory?.id === category.id
                                            ? 'border-brand-500 bg-brand-50/70'
                                            : 'border-app-line bg-slate-50/90 hover:border-brand-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-2xl bg-white p-3 text-brand-500 shadow-sm">
                                            <CategoryIcon
                                                iconKey={category.icon}
                                                className="h-5 w-5"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {category.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {transactionCount} transactions • {recurringCount} recurring rules
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                            {category.type}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setEditingCategory(category);
                                            }}
                                            className="rounded-2xl border border-app-line bg-white p-2 text-slate-500"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                if (!inUse) {
                                                    onDeleteCategory(category.id);
                                                }
                                            }}
                                            className={`rounded-2xl border bg-white p-2 ${
                                                inUse
                                                    ? 'cursor-not-allowed border-slate-200 text-slate-300'
                                                    : 'border-rose-100 text-rose-500'
                                            }`}
                                            disabled={inUse}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <Card
                    title={
                        activeCategory
                            ? `Transactions in ${activeCategory.name}`
                            : 'Transactions by category'
                    }
                    subtitle="This list updates when you pick a category from the overview."
                >
                    <div className="space-y-3">
                        {transactionsForCategory.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="rounded-2xl bg-slate-50 px-4 py-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {transaction.description}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {transaction.date}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-slate-900">
                                        {formatMoney(
                                            transaction.converted,
                                            defaultCurrency,
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {!transactionsForCategory.length ? (
                            <p className="rounded-2xl bg-slate-50 px-4 py-8 text-sm text-slate-500">
                                No transactions for this category yet.
                            </p>
                        ) : null}
                    </div>
                </Card>

                <Card
                    title="Accounts"
                    subtitle="Account management stays here for now."
                >
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            className="app-input"
                            placeholder="New account"
                            value={accountName}
                            onChange={(event) => setAccountName(event.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleAccountSubmit}
                            className="app-button-secondary whitespace-nowrap"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add account
                        </button>
                    </div>

                    <div className="mt-5 space-y-3">
                        {accounts.map((account) => (
                            <div
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
                            </div>
                        ))}
                    </div>
                </Card>
            </section>

            <Modal
                open={isCreateOpen}
                title="Add category"
                description="Create a category from a dedicated modal."
                onClose={() => setIsCreateOpen(false)}
            >
                <CategoryEditor
                    submitLabel="Create category"
                    onCancel={() => setIsCreateOpen(false)}
                    onSubmit={(category) => {
                        onCreateCategory(category);
                        setIsCreateOpen(false);
                    }}
                />
            </Modal>

            <Modal
                open={Boolean(editingCategory)}
                title="Edit category"
                description="Update the name, type, or icon for this category."
                onClose={() => setEditingCategory(null)}
            >
                {editingCategory ? (
                    <CategoryEditor
                        initialValue={editingCategory}
                        submitLabel="Save category"
                        onCancel={() => setEditingCategory(null)}
                        onSubmit={(category) => {
                            onUpdateCategory({
                                ...editingCategory,
                                ...category,
                            });
                            setEditingCategory(null);
                        }}
                    />
                ) : null}
            </Modal>
        </div>
    );
}
