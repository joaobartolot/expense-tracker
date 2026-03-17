import { useMemo, useState } from 'react';
import { Pencil, Play, Plus, Trash2 } from 'lucide-react';
import { AppHeader } from '../../components/common/AppHeader';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { RecurringRuleEditor } from '../../components/forms/RecurringRuleEditor';
import { formatMoney } from '../../utils/currency';
import { todayISO } from '../../utils/date';
import type {
    Account,
    Category,
    Currency,
    RecurringRule,
} from '../../types/finance';

interface RecurringPageProps {
    accounts: Account[];
    categories: Category[];
    defaultCurrency: Currency;
    recurringRules: RecurringRule[];
    onCreateRecurringRule: (rule: Omit<RecurringRule, 'id'>) => void;
    onUpdateRecurringRule: (rule: RecurringRule) => void;
    onDeleteRecurringRule: (ruleId: string) => void;
    onRunDueEntries: () => void;
}

export function RecurringPage({
    accounts,
    categories,
    defaultCurrency,
    recurringRules,
    onCreateRecurringRule,
    onUpdateRecurringRule,
    onDeleteRecurringRule,
    onRunDueEntries,
}: RecurringPageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<RecurringRule | null>(null);
    const today = todayISO();

    const dueRules = useMemo(
        () => recurringRules.filter((rule) => rule.nextDate <= today),
        [recurringRules, today],
    );
    const dueTotal = dueRules.reduce((sum, rule) => sum + rule.amount, 0);

    return (
        <div className="space-y-6">
            <AppHeader
                eyebrow="Recurring"
                title="Recurring rules"
                description="This page is now dedicated to recurring entries so the behavior is easier to understand: a rule becomes due on its next run date, and running due entries creates the missing transactions."
                meta={
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="app-button-secondary"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add rule
                        </button>
                        <button
                            type="button"
                            onClick={onRunDueEntries}
                            className="app-button-primary"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Run due entries
                        </button>
                    </div>
                }
            />

            <section className="grid gap-4 md:grid-cols-3">
                <Card title="Due Today" subtitle="Rules ready to generate entries right now.">
                    <p className="text-3xl font-semibold text-slate-900">
                        {dueRules.length}
                    </p>
                </Card>
                <Card title="Amount Due" subtitle="Total face value of currently due rules.">
                    <p className="text-3xl font-semibold text-slate-900">
                        {formatMoney(dueTotal, defaultCurrency)}
                    </p>
                </Card>
                <Card title="What Run Due Does" subtitle="Plain-language behavior.">
                    <p className="text-sm leading-6 text-slate-600">
                        It creates transactions for any rule with a next run date
                        on or before today, then advances that rule to its next
                        scheduled date.
                    </p>
                </Card>
            </section>

            <Card
                title="Recurring Rules"
                subtitle="View, edit, and delete rules from one place."
            >
                <div className="space-y-3">
                    {recurringRules.map((rule) => {
                        const category = categories.find(
                            (item) => item.id === rule.categoryId,
                        );
                        const account = accounts.find(
                            (item) => item.id === rule.accountId,
                        );
                        const isDue = rule.nextDate <= today;

                        return (
                            <div
                                key={rule.id}
                                className="flex flex-col gap-4 rounded-[24px] border border-app-line bg-slate-50/90 p-4 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-white p-3 text-brand-500 shadow-sm">
                                        <CategoryIcon
                                            iconKey={category?.icon}
                                            className="h-5 w-5"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-slate-900">
                                                {rule.description}
                                            </p>
                                            {isDue ? (
                                                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                                                    Due now
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {rule.interval} • next run {rule.nextDate} •{' '}
                                            {account?.name ?? 'Unknown account'} •{' '}
                                            {category?.name ?? 'Uncategorized'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 lg:items-end">
                                    <p className="text-lg font-semibold text-slate-900">
                                        {formatMoney(rule.amount, rule.currency)}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingRule(rule)}
                                            className="app-icon-button"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDeleteRecurringRule(rule.id)
                                            }
                                            className="app-icon-button text-rose-500 hover:bg-rose-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {!recurringRules.length ? (
                        <p className="rounded-2xl bg-slate-50 px-4 py-8 text-sm text-slate-500">
                            No recurring rules yet.
                        </p>
                    ) : null}
                </div>
            </Card>

            <Modal
                open={isCreateOpen}
                title="Add recurring rule"
                description="Set a description, amount, schedule, and first eligible run date."
                onClose={() => setIsCreateOpen(false)}
            >
                <RecurringRuleEditor
                    accounts={accounts}
                    categories={categories}
                    defaultCurrency={defaultCurrency}
                    submitLabel="Create rule"
                    onCancel={() => setIsCreateOpen(false)}
                    onSubmit={(rule) => {
                        onCreateRecurringRule(rule);
                        setIsCreateOpen(false);
                    }}
                />
            </Modal>

            <Modal
                open={Boolean(editingRule)}
                title="Edit recurring rule"
                description="Adjust the schedule or details for this rule."
                onClose={() => setEditingRule(null)}
            >
                {editingRule ? (
                    <RecurringRuleEditor
                        accounts={accounts}
                        categories={categories}
                        defaultCurrency={defaultCurrency}
                        initialValue={editingRule}
                        submitLabel="Save rule"
                        onCancel={() => setEditingRule(null)}
                        onSubmit={(rule) => {
                            onUpdateRecurringRule({
                                ...editingRule,
                                ...rule,
                            });
                            setEditingRule(null);
                        }}
                    />
                ) : null}
            </Modal>
        </div>
    );
}
