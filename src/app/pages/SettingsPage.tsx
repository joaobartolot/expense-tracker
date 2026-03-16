import { AppHeader } from '../../components/common/AppHeader';
import { SettingsPanel } from '../../components/settings/SettingsPanel';
import type { Currency, ExchangeRateStatus } from '../../types/finance';

interface SettingsPageProps {
    defaultCurrency: Currency;
    exchangeRateStatus: ExchangeRateStatus;
    onChangeDefaultCurrency: (currency: Currency) => void;
}

export function SettingsPage({
    defaultCurrency,
    exchangeRateStatus,
    onChangeDefaultCurrency,
}: SettingsPageProps) {
    return (
        <div className="space-y-6">
            <AppHeader
                eyebrow="Settings"
                title="App settings"
                description="Keep currency behavior and exchange-rate context in one quieter place."
            />
            <SettingsPanel
                defaultCurrency={defaultCurrency}
                exchangeRateStatus={exchangeRateStatus}
                onChangeDefaultCurrency={onChangeDefaultCurrency}
            />
        </div>
    );
}
