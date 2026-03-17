import { AppHeader } from '../../components/common/AppHeader';
import { SettingsPanel } from '../../components/settings/SettingsPanel';
import type { Currency, ExchangeRateStatus } from '../../types/finance';

interface SettingsPageProps {
    defaultCurrency: Currency;
    budgetCycleStartDay: number;
    exchangeRateStatus: ExchangeRateStatus;
    onChangeDefaultCurrency: (currency: Currency) => void;
    onChangeBudgetCycleStartDay: (day: number) => void;
}

export function SettingsPage({
    defaultCurrency,
    budgetCycleStartDay,
    exchangeRateStatus,
    onChangeDefaultCurrency,
    onChangeBudgetCycleStartDay,
}: SettingsPageProps) {
    return (
        <div className="space-y-6">
            <AppHeader
                eyebrow="Settings"
                title="App settings"
                description="Keep currency behavior, budget period boundaries, and exchange-rate context in one quieter place."
            />
            <SettingsPanel
                defaultCurrency={defaultCurrency}
                budgetCycleStartDay={budgetCycleStartDay}
                exchangeRateStatus={exchangeRateStatus}
                onChangeDefaultCurrency={onChangeDefaultCurrency}
                onChangeBudgetCycleStartDay={onChangeBudgetCycleStartDay}
            />
        </div>
    );
}
