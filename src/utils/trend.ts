// utils/trend.ts
import { Transaction } from '@src/types';

/**
 * Returns an estimated value for the current month based on average of last N full months
 */
export function findTrend(
  transactions: Transaction[],
  category: string,
  months: string[] // format: ['2025-01', '2025-02', ..., '2025-06']
): number {
  const previousMonths = months.slice(0, -1); // exclude current month (last one)
  const totals: number[] = previousMonths.map((month) =>
    transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.category === category &&
          new Date(t.date + 'T00:00:00Z').toISOString().slice(0, 7) === month
      )
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const avg = totals.reduce((a, b) => a + b, 0) / totals.length || 0;
  return Math.round(avg);
}
