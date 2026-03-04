import { Card } from '../common/Card';
import { formatMoney } from '../../utils/currency';

export function MonthlySummaryCards({ spent, earned, currency }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card title="This Month Spent">
        <p className="text-2xl font-bold text-rose-600">{formatMoney(spent, currency)}</p>
      </Card>
      <Card title="This Month Earned">
        <p className="text-2xl font-bold text-emerald-600">{formatMoney(earned, currency)}</p>
      </Card>
      <Card title="Net">
        <p className="text-2xl font-bold text-slate-800">{formatMoney(earned - spent, currency)}</p>
      </Card>
    </section>
  );
}
