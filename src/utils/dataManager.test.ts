
import { validateAndSaveData, validateAndCreateTransaction } from './dataManager';
import { FinancialData } from '@src/types';

describe('dataManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  describe('validateAndSaveData', () => {
    const validFinancialData: FinancialData = {
      transactions: [
        {
          id: 't1',
          type: 'income',
          date: '2025-06-01',
          merchant: 'Salary',
          category: '',
          amount: 1000,
        },
        {
          id: 't2',
          type: 'expense',
          date: '2025-06-02',
          merchant: 'Groceries',
          category: 'Food',
          amount: 50,
        },
      ],
      categories: ['Food', 'Utilities'],
      saveInBrowser: true,
      prefixDownload: false,
      currency: 'USD',
    };

    it('validates and saves valid JSON data with saveInBrowser true', () => {
      const jsonInput = JSON.stringify(validFinancialData);
      const result = validateAndSaveData(jsonInput, true);

      expect(result.data).toEqual(validFinancialData);
      expect(result.notification).toMatchObject({
        message: 'Data saved successfully',
        type: 'success',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'financialData',
        JSON.stringify(validFinancialData)
      );
    });

    it('validates and returns data without saving when saveInBrowser is false', () => {
      const jsonInput = JSON.stringify(validFinancialData);
      const result = validateAndSaveData(jsonInput, false);

      expect(result.data).toEqual(validFinancialData);
      expect(result.notification).toMatchObject({
        message: 'Data saved successfully',
        type: 'success',
      });
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('throws error for empty or invalid JSON string', () => {
      expect(() => validateAndSaveData('', true)).toThrow(
        'Invalid JSON input: must be a non-empty string'
      );
      expect(() => validateAndSaveData('not json', true)).toThrow('Failed to parse JSON');
    });

    it('throws error for invalid FinancialData structure', () => {
      const invalidData = {
        transactions: 'not an array',
        categories: [],
        saveInBrowser: true,
        prefixDownload: false,
        currency: 'USD',
      };
      expect(() => validateAndSaveData(JSON.stringify(invalidData), true)).toThrow(
        'Invalid data structure: missing or incorrect required fields'
      );
    });

    it('throws error for invalid transaction', () => {
      const invalidTransactionData = {
        ...validFinancialData,
        transactions: [
          {
            id: 't1',
            type: 'invalid',
            date: '2025-06-01',
            merchant: 'Salary',
            category: '',
            amount: 1000,
          },
        ],
      };
      expect(() => validateAndSaveData(JSON.stringify(invalidTransactionData), true)).toThrow(
        'Invalid transaction at index 0'
      );
    });

    it('throws error for invalid category', () => {
      const invalidCategoryData = {
        ...validFinancialData,
        categories: ['Food', ''],
      };
      expect(() => validateAndSaveData(JSON.stringify(invalidCategoryData), true)).toThrow(
        'Invalid category at index 1'
      );
    });

    it('throws error if localStorage save fails', () => {
      (localStorage.setItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage full');
      });
      expect(() => validateAndSaveData(JSON.stringify(validFinancialData), true)).toThrow(
        'Failed to save to localStorage: Storage full'
      );
    });
  });

  describe('validateAndCreateTransaction', () => {
    const validCategories = ['Food', 'Utilities'];
    const validTransactionInput = {
      type: 'expense' as 'expense',
      date: '2025-06-01',
      category: 'Food',
      merchant: 'Groceries',
      amount: '50',
    };

    it('creates a valid expense transaction', () => {
      const result = validateAndCreateTransaction(validTransactionInput, validCategories);
      expect(result).toMatchObject({
        id: expect.any(String),
        type: 'expense',
        date: '2025-06-01',
        category: 'Food',
        merchant: 'Groceries',
        amount: 50,
      });
    });

    it('creates a valid income transaction without category', () => {
      const incomeInput = {
        ...validTransactionInput,
        type: 'income' as 'income',
        category: '',
      };
      const result = validateAndCreateTransaction(incomeInput, validCategories);
      expect(result).toMatchObject({
        id: expect.any(String),
        type: 'income',
        date: '2025-06-01',
        category: '',
        merchant: 'Groceries',
        amount: 50,
      });
    });

    it('uses existing ID when provided', () => {
      const result = validateAndCreateTransaction(validTransactionInput, validCategories, 't1');
      expect(result.id).toBe('t1');
    });

    it('throws error for invalid transaction type', () => {
      const invalidInput = { ...validTransactionInput, type: 'invalid' as any };
      expect(() => validateAndCreateTransaction(invalidInput, validCategories)).toThrow(
        'Invalid transaction type: invalid'
      );
    });

    it('throws error for invalid date', () => {
      const invalidInput = { ...validTransactionInput, date: 'invalid' };
      expect(() => validateAndCreateTransaction(invalidInput, validCategories)).toThrow(
        'Invalid date: invalid'
      );
    });

    it('throws error for missing or invalid category for expense', () => {
      const invalidInput = { ...validTransactionInput, category: '' };
      expect(() => validateAndCreateTransaction(invalidInput, validCategories)).toThrow(
        'Invalid category for expense: '
      );

      const invalidCategory = { ...validTransactionInput, category: 'Invalid' };
      expect(() => validateAndCreateTransaction(invalidCategory, validCategories)).toThrow(
        'Invalid category for expense: Invalid'
      );
    });

    it('throws error for empty merchant', () => {
      const invalidInput = { ...validTransactionInput, merchant: '' };
      expect(() => validateAndCreateTransaction(invalidInput, validCategories)).toThrow(
        'Merchant cannot be empty'
      );
    });

    it('throws error for invalid amount', () => {
      const invalidAmount = { ...validTransactionInput, amount: 'invalid' };
      expect(() => validateAndCreateTransaction(invalidAmount, validCategories)).toThrow(
        'Invalid amount: invalid'
      );

      const negativeAmount = { ...validTransactionInput, amount: '-10' };
      expect(() => validateAndCreateTransaction(negativeAmount, validCategories)).toThrow(
        'Invalid amount: -10'
      );
    });
  });
});