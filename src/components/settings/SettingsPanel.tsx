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
    return (
        <Card title="Settings">
            <label
                htmlFor="default-currency"
                className="mb-2 block text-sm text-slate-600"
            >
                Default currency
            </label>
            <select
                id="default-currency"
                className="w-full rounded border p-2"
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

            <p className="mt-3 text-xs text-slate-500">
                Transactions can be entered in any currency and are converted to
                the default using current rates.
            </p>

            <p className="mt-2 text-xs text-slate-500">
                Exchange rates source:{' '}
                {exchangeRateStatus === 'success'
                    ? 'Live API'
                    : exchangeRateStatus === 'loading'
                      ? 'Loading live rates...'
                      : 'Fallback rates'}
            </p>
        </Card>
    );
}
