import { useEffect, useState } from 'react';
import { FALLBACK_RATES } from '../data/constants';

export function useExchangeRates() {
  const [rates, setRates] = useState({ USD: 1 });

  useEffect(() => {
    let active = true;

    fetch('https://open.er-api.com/v6/latest/USD')
      .then((response) => response.json())
      .then((data) => {
        if (active && data?.rates) setRates(data.rates);
      })
      .catch(() => {
        if (active) setRates(FALLBACK_RATES);
      });

    return () => {
      active = false;
    };
  }, []);

  return rates;
}
