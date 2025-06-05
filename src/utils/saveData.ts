
import { FinancialData } from '@src/types';

const STORAGE_KEY = 'financialData';

export const saveToLocalStorage = (data: FinancialData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

export const getFromLocalStorage = (): FinancialData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

export const deleteFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error deleting from local storage:', error);
  }
};
