// @src/utils/savings.ts
import { Transaction } from '@src/types';

// Interface for monthly savings data
interface MonthlySavings {
  monthYear: string;
  income: number;
  expenses: number;
  savings: number;
}

// Interface for the result of savings calculation
interface SavingsResult {
  labels: string[];
  savings: number[];
}

// Groups transactions by month and year, calculating income, expenses, and savings.
export const calculateMonthlySavings = (
  transactions: Transaction[],
  currency: string
): {
  labels: string[];
  savings: number[];
  monthlyData: Record<string, { income: number; expenses: number }>;
} => {
  const monthlyMap = new Map<string, { date: Date; income: number; expenses: number }>();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    const key = `${year}-${month}`;

    const current = monthlyMap.get(key) || {
      date: new Date(Date.UTC(year, month, 1)),
      income: 0,
      expenses: 0,
    };

    if (transaction.type === 'income') current.income += transaction.amount;
    else if (transaction.type === 'expense') current.expenses += transaction.amount;

    monthlyMap.set(key, current);
  });

  const sorted = Array.from(monthlyMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());

  const labels: string[] = [];
  const savings: number[] = [];
  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  sorted.forEach(({ date, income, expenses }) => {
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    labels.push(monthYear);
    savings.push(income - expenses);
    monthlyData[monthYear] = { income, expenses };
  });

  return { labels, savings, monthlyData };
};

// Simple linear regression estimate for next savings value
export const estimateSavings = (savings: number[]): number => {
  const n = savings.length;
  if (n < 2) return savings[n - 1] || 0;

  const xMean = (n - 1) / 2;
  const yMean = savings.reduce((sum, val) => sum + val, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (savings[i] - yMean);
    denominator += (i - xMean) ** 2;
  }

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  return slope * n + intercept;
};

// Formats a number as currency
export const formatCurrency = (amount: number, currency: string): string => {
  if (!isFinite(amount)) {
    throw new Error('Amount must be a valid number');
  }
  return `${currency}${amount.toFixed(2)}`;
};

export const formatCurrencyShort = (amount: number, currency: string): string => {
  if (!isFinite(amount)) throw new Error('Amount must be a valid number');
  const isNegative = amount < 0;
  return `${isNegative ? '-' : ''}${currency}${Math.abs(amount).toFixed(2)}`;
};