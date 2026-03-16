import { useState, type FormEvent } from 'react';
import { PiggyBank, Plus } from 'lucide-react';
import { Card } from '../common/Card';
import { formatMoney } from '../../utils/currency';
import { todayISO } from '../../utils/date';
import type { Currency, Goal } from '../../types/finance';

interface GoalsPanelProps {
    goals: Goal[];
    currency: Currency;
    onAddGoal: (goal: Omit<Goal, 'id'>) => void;
    onContributeGoal: (goalId: string, amount: number) => void;
}

interface GoalFormState {
    name: string;
    targetAmount: string;
    currentAmount: string;
    targetDate: string;
}

export function GoalsPanel({
    goals,
    currency,
    onAddGoal,
    onContributeGoal,
}: GoalsPanelProps) {
    const [goalForm, setGoalForm] = useState<GoalFormState>({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: todayISO(),
    });

    function submitGoal(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!goalForm.name || !goalForm.targetAmount) {
            return;
        }

        onAddGoal({
            ...goalForm,
            targetAmount: Number(goalForm.targetAmount),
            currentAmount: Number(goalForm.currentAmount || 0),
        });

        setGoalForm({
            name: '',
            targetAmount: '',
            currentAmount: '',
            targetDate: todayISO(),
        });
    }

    return (
        <Card
            title="Goals"
            subtitle="Track progress and keep your monthly savings target visible."
        >
            <form
                onSubmit={submitGoal}
                className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
            >
                <input
                    className="app-input"
                    placeholder="Goal name"
                    value={goalForm.name}
                    onChange={(event) =>
                        setGoalForm({ ...goalForm, name: event.target.value })
                    }
                />
                <input
                    className="app-input"
                    type="number"
                    step="0.01"
                    placeholder="Target amount"
                    value={goalForm.targetAmount}
                    onChange={(event) =>
                        setGoalForm({
                            ...goalForm,
                            targetAmount: event.target.value,
                        })
                    }
                />
                <input
                    className="app-input"
                    type="number"
                    step="0.01"
                    placeholder="Current amount"
                    value={goalForm.currentAmount}
                    onChange={(event) =>
                        setGoalForm({
                            ...goalForm,
                            currentAmount: event.target.value,
                        })
                    }
                />
                <input
                    className="app-input"
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(event) =>
                        setGoalForm({
                            ...goalForm,
                            targetDate: event.target.value,
                        })
                    }
                />
                <button className="app-button-primary md:col-span-2 xl:col-span-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add goal
                </button>
            </form>

            <div className="space-y-3">
                {goals.map((goal) => {
                    const progress = Math.min(
                        100,
                        (goal.currentAmount / goal.targetAmount) * 100 || 0,
                    );
                    const monthsLeft = Math.max(
                        1,
                        (new Date(goal.targetDate).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24 * 30),
                    );
                    const neededPerMonth =
                        (goal.targetAmount - goal.currentAmount) / monthsLeft;

                    return (
                        <div
                            key={goal.id}
                            className="rounded-[24px] border border-app-line bg-slate-50/80 p-4"
                        >
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-white p-3 text-brand-500 shadow-sm">
                                        <PiggyBank className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {goal.name}
                                        </p>
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                            target {goal.targetDate}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">
                                    {formatMoney(goal.currentAmount, currency)}{' '}
                                    / {formatMoney(goal.targetAmount, currency)}
                                </p>
                            </div>

                            <div className="mb-3 h-2.5 rounded-full bg-white">
                                <div
                                    className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-brand-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="text-sm text-slate-600">
                                Suggested monthly saving:{' '}
                                {formatMoney(
                                    Math.max(0, neededPerMonth),
                                    currency,
                                )}
                            </p>
                            <button
                                type="button"
                                onClick={() => onContributeGoal(goal.id, 50)}
                                className="app-button-secondary mt-3"
                            >
                                + {formatMoney(50, currency)} contribution
                            </button>
                        </div>
                    );
                })}

                {!goals.length && (
                    <p className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
                        No goals yet.
                    </p>
                )}
            </div>
        </Card>
    );
}
