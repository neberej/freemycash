import { calculateMonthlySavings, formatCurrency } from './savings';
import { Transaction } from '@src/types';

describe('savings.ts', () => {
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

  describe('calculateMonthlySavings', () => {
    it('returns empty arrays for empty transactions', () => {
      const result = calculateMonthlySavings([], currency);
      expect(result).toEqual({ labels: [], savings: [] });
    });

    it('calculates savings for a single income transaction', () => {
      const transactions = [createTransaction('income', '2025-06-01', 1000)];
      const result = calculateMonthlySavings(transactions, currency);
      expect(result).toEqual({
        labels: ['Jun 2025'],
        savings: [1000],
      });
    });

    it('calculates savings for a single expense transaction', () => {
      const transactions = [createTransaction('expense', '2025-06-01', 500)];
      const result = calculateMonthlySavings(transactions, currency);
      expect(result).toEqual({
        labels: ['Jun 2025'],
        savings: [-500],
      });
    });

    it('calculates savings for mixed transactions in the same month', () => {
      const transactions = [
        createTransaction('income', '2025-06-01', 1000),
        createTransaction('expense', '2025-06-15', 400),
      ];
      const result = calculateMonthlySavings(transactions, currency);
      expect(result).toEqual({
        labels: ['Jun 2025'],
        savings: [600], // 1000 - 400
      });
    });

    it('calculates savings across multiple months and sorts by date', () => {
      const transactions = [
        createTransaction('income', '2025-07-01', 2000),
        createTransaction('expense', '2025-06-01', 500),
        createTransaction('income', '2025-06-01', 1000),
      ];
      const result = calculateMonthlySavings(transactions, currency);
      expect(result).toEqual({
        labels: ['Jun 2025', 'Jul 2025'],
        savings: [500, 2000], // Jun: 1000 - 500, Jul: 2000
      });
    });

    it('throws TypeError for non-array transactions', () => {
      expect(() => calculateMonthlySavings(null as any, currency)).toThrow(TypeError);
      expect(() => calculateMonthlySavings('invalid' as any, currency)).toThrow(TypeError);
    });

    it('throws Error for invalid transaction date', () => {
      const invalidTransaction = createTransaction('income', 'invalid-date', 1000);
      expect(() => calculateMonthlySavings([invalidTransaction], currency)).toThrow(
        'Invalid date in transaction: invalid-date'
      );
    });

    it('throws Error for missing transaction date', () => {
      const invalidTransaction = { ...createTransaction('income', '2025-06-01', 1000), date: '' };
      expect(() => calculateMonthlySavings([invalidTransaction], currency)).toThrow(
        'Invalid transaction:'
      );
    });

    it('throws Error for invalid transaction amount', () => {
      const invalidTransaction = { ...createTransaction('income', '2025-06-01', NaN) };
      expect(() => calculateMonthlySavings([invalidTransaction], currency)).toThrow(
        'Invalid transaction:'
      );
    });

    it('throws Error for invalid transaction type', () => {
      const invalidTransaction = {
        ...createTransaction('income', '2025-06-01', 1000),
        type: 'invalid' as any,
      };
      expect(() => calculateMonthlySavings([invalidTransaction], currency)).toThrow(
        'Invalid transaction type: invalid'
      );
    });
  });

  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.567, currency)).toBe('$1234.57');
      expect(formatCurrency(0, currency)).toBe('$0.00');
    });

    it('formats negative numbers correctly', () => {
      expect(formatCurrency(-1234.567, currency)).toBe('$-1234.57');
    });

    it('throws Error for invalid amount', () => {
      expect(() => formatCurrency(NaN, currency)).toThrow('Amount must be a valid number');
      expect(() => formatCurrency(Infinity, currency)).toThrow('Amount must be a valid number');
    });
  });
});