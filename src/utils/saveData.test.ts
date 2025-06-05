
import {
  saveToLocalStorage,
  getFromLocalStorage,
  deleteFromLocalStorage,
} from './saveData';
import { FinancialData } from '@src/types';

describe('localStorageUtils', () => {
  const mockData: FinancialData = {
    transactions: [
      {
        id: 't-1',
        type: 'expense',
        date: '2025-06-01',
        category: 'Groceries',
        merchant: 'Costco',
        amount: 100,
      },
    ],
    categories: ['Food', 'Utilities'],
    saveInBrowser: true,
    prefixDownload: false,
    currency: 'USD'
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('saves data to localStorage', () => {
    saveToLocalStorage(mockData);
    const stored = localStorage.getItem('financialData');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored as string)).toEqual(mockData);
  });

  it('retrieves data from localStorage', () => {
    localStorage.setItem('financialData', JSON.stringify(mockData));
    const result = getFromLocalStorage();
    expect(result).toEqual(mockData);
  });

  it('returns null if nothing in localStorage', () => {
    const result = getFromLocalStorage();
    expect(result).toBeNull();
  });

  it('deletes data from localStorage', () => {
    localStorage.setItem('financialData', JSON.stringify(mockData));
    deleteFromLocalStorage();
    expect(localStorage.getItem('financialData')).toBeNull();
  });

  it('handles corrupted JSON in getFromLocalStorage gracefully', () => {
    localStorage.setItem('financialData', '{invalid json');
    const result = getFromLocalStorage();
    expect(result).toBeNull();
  });
});
