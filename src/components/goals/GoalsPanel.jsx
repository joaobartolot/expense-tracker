import { useState } from 'react';
import { Card } from '../common/Card';
import { formatMoney } from '../../utils/currency';
import { todayISO } from '../../utils/date';

export function GoalsPanel({ goals, currency, onAddGoal, onContributeGoal }) {
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: todayISO(),
  });

  function submitGoal(event) {
    event.preventDefault();
    if (!goalForm.name || !goalForm.targetAmount) return;

    onAddGoal({
      ...goalForm,
      targetAmount: Number(goalForm.targetAmount),
      currentAmount: Number(goalForm.currentAmount || 0),
    });

    setGoalForm({ name: '', targetAmount: '', currentAmount: '', targetDate: todayISO() });
  }

  return (
    <Card title="Goals">
      <form onSubmit={submitGoal} className="mb-4 grid gap-2 md:grid-cols-4">
        <input className="rounded border p-2" placeholder="Goal name" value={goalForm.name} onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })} />
        <input className="rounded border p-2" type="number" step="0.01" placeholder="Target amount" value={goalForm.targetAmount} onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })} />
        <input className="rounded border p-2" type="number" step="0.01" placeholder="Current amount" value={goalForm.currentAmount} onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })} />
        <input className="rounded border p-2" type="date" value={goalForm.targetDate} onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })} />
        <button className="rounded bg-brand-500 px-3 py-2 text-white md:col-span-4">Add Goal</button>
      </form>

      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100 || 0);
          const monthsLeft = Math.max(1, (new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30));
          const neededPerMonth = (goal.targetAmount - goal.currentAmount) / monthsLeft;

          return (
            <div key={goal.id} className="rounded-lg border p-3">
              <div className="mb-1 flex justify-between">
                <p className="font-semibold">{goal.name}</p>
                <p className="text-sm text-slate-500">{formatMoney(goal.currentAmount, currency)} / {formatMoney(goal.targetAmount, currency)}</p>
              </div>

              <div className="mb-2 h-2 rounded bg-slate-200">
                <div className="h-2 rounded bg-emerald-500" style={{ width: `${progress}%` }} />
              </div>

              <p className="text-sm text-slate-600">Suggested monthly saving: {formatMoney(Math.max(0, neededPerMonth), currency)}</p>
              <button onClick={() => onContributeGoal(goal.id, 50)} className="mt-2 rounded bg-slate-800 px-3 py-1 text-sm text-white">
                + {formatMoney(50, currency)} contribution
              </button>
            </div>
          );
        })}

        {!goals.length && <p className="text-sm text-slate-500">No goals yet.</p>}
      </div>
    </Card>
  );
}
