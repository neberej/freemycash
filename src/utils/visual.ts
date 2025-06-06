
// break down number for nice visual
export function formatCurrencyParts(currency: string, value: number): {
  whole: string;
  decimal: string;
} {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const [whole, decimal] = absValue.toFixed(2).split('.');
  const formattedWhole = Number(whole).toLocaleString();
  const prefix = isNegative ? '-' : '';

  return {
    whole: `${prefix}${currency}${formattedWhole}`,
    decimal: `.${decimal}`,
  };
}
