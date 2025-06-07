import { DateTime } from 'luxon';
import { FinancialData, Transaction } from '@src/types';
import { getCurrentDateISO } from '@src/utils/dateAndTime';

// Generates a unique transaction ID
export const generateTransactionId = (): string => {
  const timestamp = DateTime.now().toMillis(); // e.g. 1717799811350
  const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `t-${timestamp}-${suffix}`;
};

// Creates a new transaction with default values
export const createNewTransaction = (
  type: 'income' | 'expense',
  categories: string[]
): Transaction => {
  if (!['income', 'expense'].includes(type)) {
    throw new Error(`Invalid transaction type: ${type}`);
  }

  return {
    id: generateTransactionId(),
    type,
    date: getCurrentDateISO(),
    merchant: '',
    category: type === 'expense' ? (categories[0] || 'Other') : '',
    amount: 0,
  };
};

// Updates or adds a transaction to the financial data
export const updateTransaction = (
  financialData: FinancialData,
  updatedTransaction: Transaction,
  saveInBrowser: boolean
): FinancialData => {
  if (!financialData || !financialData.transactions) {
    throw new Error('Invalid financial data');
  }
  if (!updatedTransaction || !updatedTransaction.id || isNaN(updatedTransaction.amount)) {
    throw new Error('Invalid transaction data');
  }
  if (!updatedTransaction.date || isNaN(new Date(updatedTransaction.date).getTime())) {
    throw new Error(`Invalid date in transaction: ${updatedTransaction.date}`);
  }

  const isNew = !financialData.transactions.some((t) => t.id === updatedTransaction.id);

  const updatedTransactions = isNew
    ? [...financialData.transactions, { ...updatedTransaction }]
    : financialData.transactions.map((t) =>
        t.id === updatedTransaction.id ? { ...updatedTransaction } : t
      );

  const updatedData: FinancialData = {
    ...financialData,
    transactions: updatedTransactions,
  };

  if (saveInBrowser) {
    try {
      localStorage.setItem('financialData', JSON.stringify(updatedData));
    } catch (error) {
      throw new Error(`Failed to save to localStorage: ${(error as Error).message}`);
    }
  }

  return updatedData;
};

// Deletes a transaction from the financial data
export const deleteTransaction = (
  financialData: FinancialData,
  transactionId: string,
  saveInBrowser: boolean
): FinancialData => {
  if (!financialData || !financialData.transactions) {
    throw new Error('Invalid financial data');
  }
  if (!transactionId) {
    throw new Error('Invalid transaction ID');
  }

  const updatedTransactions = financialData.transactions.filter((t) => t.id !== transactionId);

  const updatedData: FinancialData = {
    ...financialData,
    transactions: updatedTransactions,
  };

  if (saveInBrowser) {
    try {
      localStorage.setItem('financialData', JSON.stringify(updatedData));
    } catch (error) {
      throw new Error(`Failed to save to localStorage: ${(error as Error).message}`);
    }
  }

  return updatedData;
};