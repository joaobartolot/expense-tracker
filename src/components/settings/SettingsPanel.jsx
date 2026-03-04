import { Card } from '../common/Card';
import { CURRENCIES } from '../../data/constants';

export function SettingsPanel({ defaultCurrency, onChangeDefaultCurrency }) {
  return (
    <Card title="Settings">
      <label className="mb-2 block text-sm text-slate-600">Default currency</label>
      <select className="w-full rounded border p-2" value={defaultCurrency} onChange={(e) => onChangeDefaultCurrency(e.target.value)}>
        {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
      </select>
      <p className="mt-3 text-xs text-slate-500">
        Transactions can be entered in any currency and are converted to the default using current rates.
      </p>
    </Card>
  );
}
