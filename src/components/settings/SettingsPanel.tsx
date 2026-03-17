import { BadgeDollarSign, CalendarRange, Globe } from 'lucide-react';
import { Card } from '../common/Card';
import { CURRENCIES } from '../../data/constants';
import type { Currency, ExchangeRateStatus } from '../../types/finance';

interface SettingsPanelProps {
    defaultCurrency: Currency;
    budgetCycleStartDay: number;
    onChangeDefaultCurrency: (currency: Currency) => void;
    onChangeBudgetCycleStartDay: (day: number) => void;
    exchangeRateStatus: ExchangeRateStatus;
}

export function SettingsPanel({
    defaultCurrency,
    budgetCycleStartDay,
    onChangeDefaultCurrency,
    onChangeBudgetCycleStartDay,
    exchangeRateStatus,
}: SettingsPanelProps) {
    const exchangeLabel =
        exchangeRateStatus === 'success'
            ? 'Live API'
            : exchangeRateStatus === 'loading'
              ? 'Loading live rates...'
              : 'Fallback rates';

    return (
        <Card
            title="Settings"
            subtitle="Choose how balances are normalized and how each budget period is grouped."
        >
            <label
                htmlFor="default-currency"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
            >
                <BadgeDollarSign className="h-4 w-4 text-brand-500" />
                Default currency
            </label>
            <select
                id="default-currency"
                className="app-select"
                value={defaultCurrency}
                onChange={(event) =>
                    onChangeDefaultCurrency(event.target.value as Currency)
                }
            >
                {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>

            <p className="mt-4 text-sm text-slate-500">
                Transactions can be entered in any currency and are converted to
                the default using current rates.
            </p>

            <label
                htmlFor="budget-cycle-start-day"
                className="mt-6 mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
            >
                <CalendarRange className="h-4 w-4 text-brand-500" />
                Budget period start day
            </label>
            <select
                id="budget-cycle-start-day"
                className="app-select"
                value={budgetCycleStartDay}
                onChange={(event) =>
                    onChangeBudgetCycleStartDay(Number(event.target.value))
                }
            >
                {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                    <option key={day} value={day}>
                        Day {day}
                    </option>
                ))}
            </select>

            <p className="mt-4 text-sm text-slate-500">
                Use the day your pay period starts. If a month is shorter than
                that day, the period rolls over on the last day of that month.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    <Globe className="h-3.5 w-3.5" />
                    Exchange rates source
                </p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                    {exchangeLabel}
                </p>
            </div>
        </Card>
    );
}
