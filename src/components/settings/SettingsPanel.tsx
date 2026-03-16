import { BadgeDollarSign, Globe } from 'lucide-react';
import { Card } from '../common/Card';
import { CURRENCIES } from '../../data/constants';
import type { Currency, ExchangeRateStatus } from '../../types/finance';

interface SettingsPanelProps {
    defaultCurrency: Currency;
    onChangeDefaultCurrency: (currency: Currency) => void;
    exchangeRateStatus: ExchangeRateStatus;
}

export function SettingsPanel({
    defaultCurrency,
    onChangeDefaultCurrency,
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
            subtitle="Choose how balances are normalized across the app."
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
