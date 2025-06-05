import { generateTransactionId, createNewTransaction, updateTransaction, deleteTransaction } from './transactions';
import { Transaction, FinancialData } from '../types';

// Mock dateAndTime
jest.mock('../utils/dateAndTime', () => ({
  getCurrentDateISO: jest.fn(() => '2025-06-01'),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('transactions.ts', () => {
  const categories = ['Rent', 'Food', 'Salary'];
  const mockTransaction: Transaction = {
    id: 't-123',
    type: 'expense',
    date: '2025-06-01',
    category: 'Rent',
    merchant: 'Landlord',
    amount: 1000,
  };
  const mockFinancialData: FinancialData = {
    transactions: [mockTransaction],
    saveInBrowser: false,
    prefixDownload: false,
    currency: '$',
    categories: []
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('generateTransactionId', () => {
    it('generates a unique transaction ID', () => {
      const id1 = generateTransactionId();
      const id2 = generateTransactionId();
      expect(id1).toMatch(/^t-\d+-\w+$/);
      expect(id1).not.toEqual(id2);
    });
  });

  describe('createNewTransaction', () => {
    it('creates a new expense transaction', () => {
      const transaction = createNewTransaction('expense', categories);
      expect(transaction).toEqual({
        id: expect.stringMatching(/^t-\d+-\w+$/),
        type: 'expense',
        date: '2025-06-01',
        merchant: '',
        category: 'Rent',
        amount: 0,
      });
    });

    it('creates a new income transaction', () => {
      const transaction = createNewTransaction('income', categories);
      expect(transaction).toEqual({
        id: expect.stringMatching(/^t-\d+-\w+$/),
        type: 'income',
        date: '2025-06-01',
        merchant: '',
        category: '',
        amount: 0,
      });
    });

    it('throws Error for invalid type', () => {
      expect(() => createNewTransaction('invalid' as any, categories)).toThrow('Invalid transaction type');
    });
  });

  describe('updateTransaction', () => {
    it('adds a new transaction', () => {
      const newTransaction: Transaction = {
        id: 't-124',
        type: 'income',
        date: '2025-06-01',
        category: 'Salary',
        merchant: 'Employer',
        amount: 2000,
      };
      const result = updateTransaction(mockFinancialData, newTransaction, false);
      expect(result.transactions).toContainEqual(newTransaction);
      expect(result.transactions.length).toBe(2);
    });

    it('updates an existing transaction', () => {
      const updatedTransaction = { ...mockTransaction, amount: 1200 };
      const result = updateTransaction(mockFinancialData, updatedTransaction, false);
      expect(result.transactions).toEqual([updatedTransaction]);
    });

    it('saves to localStorage when saveInBrowser is true', () => {
      const newTransaction: Transaction = {
        id: 't-124',
        type: 'income',
        date: '2025-06-01',
        category: 'Salary',
        merchant: 'Employer',
        amount: 2000,
      };
      const result = updateTransaction(mockFinancialData, newTransaction, true);
      expect(localStorage.setItem).toHaveBeenCalledWith('financialData', JSON.stringify(result));
    });

    it('throws Error for invalid financial data', () => {
      expect(() => updateTransaction(null as any, mockTransaction, false)).toThrow('Invalid financial data');
    });

    it('throws Error for invalid transaction', () => {
      const invalidTransaction = { ...mockTransaction, id: '', amount: NaN };
      expect(() => updateTransaction(mockFinancialData, invalidTransaction, false)).toThrow('Invalid transaction data');
    });

    it('throws Error for invalid date', () => {
      const invalidTransaction = { ...mockTransaction, date: 'invalid-date' };
      expect(() => updateTransaction(mockFinancialData, invalidTransaction, false)).toThrow('Invalid date in transaction');
    });

    it('throws Error for localStorage failure', () => {
      jest.spyOn(localStorage, 'setItem').mockImplementationOnce(() => { throw new Error('Storage full'); });
      expect(() => updateTransaction(mockFinancialData, mockTransaction, true)).toThrow('Failed to save to localStorage');
    });
  });

  describe('deleteTransaction', () => {
    it('deletes a transaction', () => {
      const result = deleteTransaction(mockFinancialData, 't-123', false);
      expect(result.transactions).toEqual([]);
    });

    it('saves to localStorage when saveInBrowser is true', () => {
      const result = deleteTransaction(mockFinancialData, 't-123', true);
      expect(localStorage.setItem).toHaveBeenCalledWith('financialData', JSON.stringify(result));
    });

    it('throws Error for invalid financial data', () => {
      expect(() => deleteTransaction(null as any, 't-123', false)).toThrow('Invalid financial data');
    });

    it('throws Error for invalid transaction ID', () => {
      expect(() => deleteTransaction(mockFinancialData, '', false)).toThrow('Invalid transaction ID');
    });

    it('throws Error for localStorage failure', () => {
      jest.spyOn(localStorage, 'setItem').mockImplementationOnce(() => { throw new Error('Storage full'); });
      expect(() => deleteTransaction(mockFinancialData, 't-123', true)).toThrow('Failed to save to localStorage');
    });
  });
});