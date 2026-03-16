import type { Currency, ExchangeRates } from '../types/finance';

export function convertAmount(
    amount: number,
    from: Currency,
    to: Currency,
    rates: ExchangeRates,
) {
    if (!rates[from] || !rates[to]) {
        return amount;
    }

    const usdAmount = amount / rates[from];

    return usdAmount * rates[to];
}

export function formatMoney(value: number, currency: Currency) {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
    }).format(value);
}
