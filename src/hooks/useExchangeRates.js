import { useEffect, useState } from 'react';
import { FALLBACK_RATES } from '../data/constants';

export function useExchangeRates() {
  const [rates, setRates] = useState({ USD: 1 });
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;

    fetch('https://open.er-api.com/v6/latest/USD')
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        if (data?.rates) {
          setRates(data.rates);
          setStatus('success');
          return;
        }
        setRates(FALLBACK_RATES);
        setStatus('fallback');
      })
      .catch(() => {
        if (!active) return;
        setRates(FALLBACK_RATES);
        setStatus('fallback');
      });

    return () => {
      active = false;
    };
  }, []);

  return { rates, status };
}
