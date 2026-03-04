import { useEffect, useMemo, useState } from 'react';
import { CURRENCIES } from '../../data/constants';
import { todayISO } from '../../utils/date';
import { Card } from '../common/Card';

export function TransactionForm({ accounts, categories, defaultCurrency, onSubmit }) {
  const defaultExpenseCategory = useMemo(
    () => categories.find((category) => category.type === 'expense')?.id,
    [categories]
  );

  const [form, setForm] = useState({
    description: '',
    amount: '',
    currency: defaultCurrency,
    type: 'expense',
    date: todayISO(),
    categoryId: defaultExpenseCategory,
    accountId: accounts[0]?.id,
  });

  const categoryOptions = useMemo(
    () => categories.filter((category) => category.type === form.type),
    [categories, form.type]
  );

  useEffect(() => {
    setForm((prev) => ({ ...prev, currency: defaultCurrency }));
  }, [defaultCurrency]);

  useEffect(() => {
    if (!categoryOptions.find((category) => category.id === form.categoryId)) {
      setForm((prev) => ({ ...prev, categoryId: categoryOptions[0]?.id }));
    }
  }, [categoryOptions, form.categoryId]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.description || !form.amount || !form.categoryId || !form.accountId) return;

    onSubmit({
      ...form,
      amount: Number(form.amount),
    });

    setForm((prev) => ({ ...prev, description: '', amount: '' }));
  }

  return (
    <Card title="Add Transaction">
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-3">
        <input required className="rounded border p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input required className="rounded border p-2" type="number" min="0" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input required className="rounded border p-2" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />

        <select className="rounded border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <select className="rounded border p-2" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
          {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
        </select>

        <select className="rounded border p-2" value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })}>
          {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
        </select>

        <select className="rounded border p-2 md:col-span-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
          ))}
        </select>

        <button type="submit" className="rounded bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-700">Add</button>
      </form>
    </Card>
  );
}
