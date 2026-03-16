import { useEffect, useState } from 'react';
import { FALLBACK_RATES } from '../data/constants';
import type { ExchangeRates, ExchangeRateStatus } from '../types/finance';

export function useExchangeRates() {
    const [rates, setRates] = useState<ExchangeRates>({ USD: 1 });
    const [status, setStatus] = useState<ExchangeRateStatus>('loading');

    useEffect(() => {
        let active = true;

        fetch('https://open.er-api.com/v6/latest/USD')
            .then(
                async (response) =>
                    (await response.json()) as { rates?: ExchangeRates },
            )
            .then((data) => {
                if (!active) {
                    return;
                }

                if (data.rates) {
                    setRates(data.rates);
                    setStatus('success');

                    return;
                }

                setRates(FALLBACK_RATES);
                setStatus('fallback');
            })
            .catch(() => {
                if (!active) {
                    return;
                }

                setRates(FALLBACK_RATES);
                setStatus('fallback');
            });

        return () => {
            active = false;
        };
    }, []);

    return { rates, status };
}
