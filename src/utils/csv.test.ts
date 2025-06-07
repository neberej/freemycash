import { parseCsvToTransactions, deriveCategory } from '../utils/csv';

const sampleCsv = `
Description,Summary Amt.
Beginning balance as of 04/23/2025,1752.88
Total credits,0
Total debits,-99.95
Ending balance as of 05/21/2025,1652.93

Date,Description,Amount,Running Bal.
4/23/25,Fee,-4.95,1747.93
4/24/25,Payment,-55,1692.93
4/25/25,Payment,-40,1652.93
`.trim();

describe('parseCsvToTransactions', () => {
  it('parses valid CSV correctly', () => {
    const data = parseCsvToTransactions(sampleCsv);
    expect(data.transactions.length).toBe(3);
    expect(data.transactions[0]).toMatchObject({
      type: 'expense',
      amount: 4.95,
      category: 'Fees',
    });
  });

  it('throws error on missing transaction section', () => {
    const badCsv = `name,email,amount\njohn@example.com,test,10`;
    expect(() => parseCsvToTransactions(badCsv)).toThrow('Could not find transactions section');
  });

  it('handles malformed rows gracefully', () => {
    const csv = `
Date,Description,Amount
4/25/25,Some thing,-20
bad,row
4/26/25,Another,-5.5
`.trim();

    const result = parseCsvToTransactions(csv);
    expect(result.transactions.length).toBe(2);
    expect(result.transactions[1].amount).toBe(5.5);
  });
});

describe('deriveCategory with multiple keywords', () => {
  it('matches keyword group correctly', () => {
    expect(deriveCategory('Monthly Maintenance Fee')).toBe('Fees');
    expect(deriveCategory('Netflix Premium Subscription')).toBe('Subscriptions');
    expect(deriveCategory('Zelle payment to friend')).toBe('Transfers');
    expect(deriveCategory('Uber trip to downtown')).toBe('Transport');
    expect(deriveCategory('Random transaction')).toBe('Uncategorized');
  });
});