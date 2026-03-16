import { GoalsPanel } from '../../components/goals/GoalsPanel';
import { AppHeader } from '../../components/common/AppHeader';
import type { Currency, Goal } from '../../types/finance';

interface GoalsPageProps {
    goals: Goal[];
    currency: Currency;
    onAddGoal: (goal: Omit<Goal, 'id'>) => void;
    onContributeGoal: (goalId: string, amount: number) => void;
}

export function GoalsPage({
    goals,
    currency,
    onAddGoal,
    onContributeGoal,
}: GoalsPageProps) {
    return (
        <div className="space-y-6">
            <AppHeader
                eyebrow="Goals"
                title="Savings goals"
                description="A dedicated page for progress, targets, and suggested monthly savings."
            />
            <GoalsPanel
                goals={goals}
                currency={currency}
                onAddGoal={onAddGoal}
                onContributeGoal={onContributeGoal}
            />
        </div>
    );
}
