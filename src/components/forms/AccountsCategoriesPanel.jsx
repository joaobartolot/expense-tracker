import { useState } from 'react';
import { Card } from '../common/Card';

export function AccountsCategoriesPanel({ accounts, onAddAccount, onAddCategory }) {
  const [accountName, setAccountName] = useState('');
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '🏷️', type: 'expense' });

  function submitAccount(event) {
    event.preventDefault();
    if (!accountName.trim()) return;
    onAddAccount(accountName.trim());
    setAccountName('');
  }

  function submitCategory(event) {
    event.preventDefault();
    if (!categoryForm.name.trim()) return;
    onAddCategory(categoryForm);
    setCategoryForm((prev) => ({ ...prev, name: '' }));
  }

  return (
    <Card title="Accounts & Categories">
      <form onSubmit={submitAccount} className="mb-3 flex gap-2">
        <input className="w-full rounded border p-2" placeholder="New bank account" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
        <button className="rounded bg-slate-800 px-3 text-white">Add</button>
      </form>

      <ul className="mb-4 space-y-1 text-sm">
        {accounts.map((account) => (
          <li key={account.id}>• {account.name} <span className="text-slate-500">({account.type})</span></li>
        ))}
      </ul>

      <form onSubmit={submitCategory} className="grid gap-2 md:grid-cols-3">
        <input className="rounded border p-2" placeholder="Category" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
        <input className="rounded border p-2" placeholder="Icon" value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} />
        <select className="rounded border p-2" value={categoryForm.type} onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button className="rounded bg-slate-800 px-3 py-2 text-white md:col-span-3">Add Category</button>
      </form>
    </Card>
  );
}
