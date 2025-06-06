// @src/utils/__tests__/savings.test.ts
import {
  calculateMonthlySavings,
  estimateSavings,
  formatCurrency,
  formatCurrencyShort,
} from './savings';
import { Transaction } from '@src/types';

describe('calculateMonthlySavings', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      date: '2025-04-01',
      merchant: 'Company',
      category: '',
      amount: 3000,
    },
    {
      id: '2',
      type: 'expense',
      date: '2025-04-05',
      merchant: 'Rent',
      category: '',
      amount: 1500,
    },
    {
      id: '3',
      type: 'income',
      date: '2025-05-01',
      merchant: 'Company',
      category: '',
      amount: 3200,
    },
    {
      id: '4',
      type: 'expense',
      date: '2025-05-10',
      merchant: 'Groceries',
      category: '',
      amount: 800,
    },
  ];

  it('calculates correct savings per month', () => {
    const { labels, savings, monthlyData } = calculateMonthlySavings(transactions, '$');
    expect(labels).toEqual(['Apr 2025', 'May 2025']);
    expect(savings).toEqual([1500, 2400]);
    expect(monthlyData['Apr 2025']).toEqual({ income: 3000, expenses: 1500 });
    expect(monthlyData['May 2025']).toEqual({ income: 3200, expenses: 800 });
  });
});

describe('estimateSavings', () => {
  it('returns projected savings using linear regression', () => {
    const input = [1500, 2400];
    const estimate = estimateSavings(input);
    expect(estimate).toBeCloseTo(3300, 1); // checks reasonable trend
  });

  it('handles empty or one-element array', () => {
    expect(estimateSavings([])).toEqual(0);
    expect(estimateSavings([500])).toEqual(500);
  });
});

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1234.56, '$')).toEqual('$1234.56');
    expect(formatCurrency(-99.1, '€')).toEqual('€-99.10');
  });

  it('throws on invalid input', () => {
    expect(() => formatCurrency(NaN, '$')).toThrow();
  });
});

describe('formatCurrencyShort', () => {
  it('formats short currency with sign', () => {
    expect(formatCurrencyShort(1000.5, '$')).toEqual('$1000.50');
    expect(formatCurrencyShort(-100.12, '€')).toEqual('-€100.12');
  });

  it('throws on invalid input', () => {
    expect(() => formatCurrencyShort(Infinity, '$')).toThrow();
  });
});
