import { useState } from 'react';
import { Card } from '../common/Card';
import { todayISO } from '../../utils/date';
import { CURRENCIES } from '../../data/constants';

export function RecurringTransactionsPanel({ recurringRules, onApplyDue, onAddRule, categories, accounts, defaultCurrency }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    currency: defaultCurrency,
    type: 'expense',
    interval: 'monthly',
    categoryId: categories[0]?.id,
    accountId: accounts[0]?.id,
    nextDate: todayISO(),
  });

  function submitRecurring(event) {
    event.preventDefault();
    if (!form.description || !form.amount) return;

    onAddRule({ ...form, amount: Number(form.amount) });
    setForm((prev) => ({ ...prev, description: '', amount: '' }));
  }

  const categoryOptions = categories.filter((category) => category.type === form.type);

  return (
    <Card title="Recurring Transactions" actions={<button onClick={onApplyDue} className="rounded bg-brand-500 px-3 py-1 text-sm text-white">Apply Due</button>}>
      <form onSubmit={submitRecurring} className="grid gap-2">
        <input className="rounded border p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="rounded border p-2" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />

        <div className="grid grid-cols-2 gap-2">
          <select className="rounded border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select className="rounded border p-2" value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select className="rounded border p-2" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
            {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
          </select>
          <input className="rounded border p-2" type="date" value={form.nextDate} onChange={(e) => setForm({ ...form, nextDate: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select className="rounded border p-2" value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })}>
            {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
          </select>
          <select className="rounded border p-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            {categoryOptions.map((category) => <option key={category.id} value={category.id}>{category.icon} {category.name}</option>)}
          </select>
        </div>

        <button className="rounded bg-slate-800 p-2 text-white">Add Recurring Rule</button>
      </form>

      <ul className="mt-3 space-y-1 text-sm text-slate-600">
        {recurringRules.map((rule) => (
          <li key={rule.id}>• {rule.description} ({rule.interval}) next: {rule.nextDate}</li>
        ))}
      </ul>
    </Card>
  );
}
