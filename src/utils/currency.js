export function convertAmount(amount, from, to, rates) {
  if (!rates[from] || !rates[to]) return amount;
  const usdAmount = amount / rates[from];
  return usdAmount * rates[to];
}

export function formatMoney(value, currency) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
