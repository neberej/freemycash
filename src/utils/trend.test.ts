
import { findTrend } from '@src/utils/trend';
import { Transaction } from '@src/types';

describe('findTrend', () => {
  const mockTx: Transaction[] = [
    { date: '2025-01-01', category: 'Food', type: 'expense', amount: 100, merchant: 'A' },
    { date: '2025-02-01', category: 'Food', type: 'expense', amount: 200, merchant: 'B' },
    { date: '2025-03-01', category: 'Food', type: 'expense', amount: 300, merchant: 'C' },
    { date: '2025-06-01', category: 'Transport', type: 'expense', amount: 400, merchant: 'D' },
  ];

  it('should estimate value using trend', () => {
    const months = ['2025-01', '2025-02', '2025-03'];
    const estimate = findTrend(mockTx, 'Food', months);
    expect(typeof estimate).toBe('number');
    expect(estimate).toBeGreaterThan(0);
  });

  it('should return 0 for empty input', () => {
    const estimate = findTrend([], 'Food', []);
    expect(estimate).toBe(0);
  });

  it('should return 0 for unknown category', () => {
    const estimate = findTrend(mockTx, 'Unknown', ['2025-01']);
    expect(estimate).toBe(0);
  });
});
