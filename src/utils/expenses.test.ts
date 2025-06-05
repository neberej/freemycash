import { processExpenses, formatDate } from './expenses';
import { Transaction } from '../types';

describe('expenses.ts', () => {
  const currency = '$';

  // Helper to create a transaction
  const createTransaction = (
    type: 'income' | 'expense',
    date: string,
    amount: number,
    category: string = 'Test',
    merchant: string = 'Test Merchant'
  ): Transaction => ({
    id: `t-${Date.now()}-${Math.random()}`,
    type,
    date,
    category,
    merchant,
    amount,
  });

  describe('processExpenses', () => {
    it('returns empty data for empty transactions', () => {
      const result = processExpenses([], 'all', currency);
      expect(result).toEqual({
        filteredExpenses: [],
        categories: [],
        months: [],
        chartData: { labels: [], datasets: [{ label: 'Expenses by Category', data: [], backgroundColor: [], borderColor: [], borderWidth: 1 }] },
      });
    });

    it('filters expense transactions for all months', () => {
      const transactions = [
        createTransaction('expense', '2025-06-01', 500, 'Rent'),
        createTransaction('income', '2025-06-01', 1000, 'Salary'),
        createTransaction('expense', '2025-06-01', 200, 'Food'),
      ];
      const result = processExpenses(transactions, 'all', currency);
      expect(result.filteredExpenses).toEqual([
        { category: 'Food', transactions: [expect.objectContaining({ category: 'Food' })], total: 200 },
        { category: 'Rent', transactions: [expect.objectContaining({ category: 'Rent' })], total: 500 },
      ]);
      expect(result.categories).toEqual(['Food', 'Rent']);
      expect(result.months).toEqual(['2025-06']);
      expect(result.chartData.labels).toEqual(['Food', 'Rent']);
      expect(result.chartData.datasets[0].data).toEqual([200, 500]);
    });

    it('filters expense transactions for a specific month', () => {
      const transactions = [
        createTransaction('expense', '2025-06-01', 500, 'Rent'),
        createTransaction('expense', '2025-07-01', 600, 'Rent'),
      ];
      const result = processExpenses(transactions, '2025-06', currency);
      expect(result.filteredExpenses).toEqual([
        { category: 'Rent', transactions: [expect.objectContaining({ date: '2025-06-01' })], total: 500 },
      ]);
      expect(result.months).toEqual(['2025-06', '2025-07']);
    });

    it('handles uncategorized expenses', () => {
      const transactions = [createTransaction('expense', '2025-06-01', 500, '')];
      const result = processExpenses(transactions, 'all', currency);
      expect(result.filteredExpenses).toEqual([
        { category: 'Uncategorized', transactions: [expect.objectContaining({ category: '' })], total: 500 },
      ]);
    });

    it('throws TypeError for non-array transactions', () => {
      expect(() => processExpenses(null as any, 'all', currency)).toThrow(TypeError);
    });

    it('throws Error for invalid date', () => {
      const transactions = [createTransaction('expense', 'invalid-date', 500)];
      expect(() => processExpenses(transactions, '2025-06', currency)).toThrow('Invalid date format');
    });

    it('throws Error for invalid amount', () => {
      const transactions = [{ ...createTransaction('expense', '2025-06-01', NaN) }];
      expect(() => processExpenses(transactions, '2025-06', currency)).toThrow('Invalid amount in transaction');
    });
  });

  describe('formatDate', () => {
    it('formats valid date correctly', () => {
      expect(formatDate('2025-06-01')).toBe('June 1, 2025');
    });

    it('throws Error for invalid date', () => {
      expect(() => formatDate('invalid-date')).toThrow('Invalid date format');
    });
  });
});