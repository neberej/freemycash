
import { processIncome, formatDate } from './income';
import { Transaction } from '../types';

describe('income.ts', () => {
  const currency = '$';

  const createTransaction = (
    type: 'income' | 'expense',
    date: string,
    amount: number,
    category: string = '',
    merchant: string = 'Test Merchant'
  ): Transaction => ({
    id: `t-${Date.now()}-${Math.random()}`,
    type,
    date,
    category,
    merchant,
    amount,
  });

  describe('processIncome', () => {
    it('returns empty data for empty transactions', () => {
      const result = processIncome([], 'all', currency);
      expect(result).toEqual({
        filteredIncome: [],
        months: [],
        chartData: { labels: [], datasets: [{ label: 'Income by Category', data: [], backgroundColor: [], borderColor: [], borderWidth: 1 }] },
      });
    });

    it('filters income transactions for all months', () => {
      const transactions = [
        createTransaction('income', '2025-06-01', 1000, 'Salary'),
        createTransaction('expense', '2025-06-01', 500, 'Rent'),
        createTransaction('income', '2025-06-01', 200, 'Freelance'),
      ];
      const result = processIncome(transactions, 'all', currency);
      expect(result.filteredIncome).toEqual([
        { category: 'Freelance', transactions: [expect.objectContaining({ category: 'Freelance' })], total: 200 },
        { category: 'Salary', transactions: [expect.objectContaining({ category: 'Salary' })], total: 1000 },
      ]);
      expect(result.months).toEqual(['2025-06']);
      expect(result.chartData.labels).toEqual(['Freelance', 'Salary']);
      expect(result.chartData.datasets[0].data).toEqual([200, 1000]);
    });

    it('filters income transactions for a specific month', () => {
      const transactions = [
        createTransaction('income', '2025-06-01', 1000, 'Salary'),
        createTransaction('income', '2025-07-01', 1500, 'Salary'),
      ];
      const result = processIncome(transactions, '2025-06', currency);
      expect(result.filteredIncome).toEqual([
        { category: 'Salary', transactions: [expect.objectContaining({ date: '2025-06-01' })], total: 1000 },
      ]);
      expect(result.months).toEqual(['2025-06', '2025-07']);
    });

    it('handles uncategorized income', () => {
      const transactions = [createTransaction('income', '2025-06-01', 1000)];
      const result = processIncome(transactions, 'all', currency);
      expect(result.filteredIncome).toEqual([
        { category: 'Uncategorized', transactions: [expect.objectContaining({ category: '' })], total: 1000 },
      ]);
    });

    it('throws TypeError for non-array transactions', () => {
      expect(() => processIncome(null as any, 'all', currency)).toThrow(TypeError);
    });

    it('throws Error for invalid date', () => {
      const transactions = [createTransaction('income', 'invalid-date', 1000)];
      expect(() => processIncome(transactions, '2025-06', currency)).toThrow('Invalid date format');
    });

    it('throws Error for invalid amount', () => {
      const transactions = [{ ...createTransaction('income', '2025-06-01', NaN) }];
      expect(() => processIncome(transactions, '2025-06', currency)).toThrow('amount');
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
