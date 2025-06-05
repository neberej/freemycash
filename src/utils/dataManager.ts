import { FinancialData, Transaction, Notification as NotificationType } from '@src/types';

// Validates and saves financial data from JSON input
export const validateAndSaveData = (
  jsonInput: string,
  saveInBrowser: boolean
): { data: FinancialData; notification: NotificationType } => {
  if (typeof jsonInput !== 'string' || jsonInput.trim() === '') {
    throw new Error('Invalid JSON input: must be a non-empty string');
  }

  let parsedData: FinancialData;
  try {
    parsedData = JSON.parse(jsonInput);
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${(error as Error).message}`);
  }

  // Validate FinancialData structure
  if (
    !parsedData ||
    !Array.isArray(parsedData.transactions) ||
    !Array.isArray(parsedData.categories) ||
    typeof parsedData.saveInBrowser !== 'boolean' ||
    typeof parsedData.prefixDownload !== 'boolean' ||
    typeof parsedData.currency !== 'string'
  ) {
    throw new Error('Invalid data structure: missing or incorrect required fields');
  }

  // Validate transactions
  parsedData.transactions.forEach((t, index) => {
    if (
      !t.id ||
      !['income', 'expense'].includes(t.type) ||
      typeof t.date !== 'string' ||
      isNaN(new Date(t.date).getTime()) ||
      typeof t.merchant !== 'string' ||
      (t.type === 'expense' && typeof t.category !== 'string') ||
      typeof t.amount !== 'number' ||
      isNaN(t.amount)
    ) {
      throw new Error(`Invalid transaction at index ${index}: ${JSON.stringify(t)}`);
    }
  });

  // Validate categories
  parsedData.categories.forEach((cat, index) => {
    if (typeof cat !== 'string' || cat.trim() === '') {
      throw new Error(`Invalid category at index ${index}: ${cat}`);
    }
  });

  // Create a deep copy to prevent data leaks
  const updatedData: FinancialData = {
    transactions: parsedData.transactions.map((t) => ({ ...t })),
    categories: [...parsedData.categories],
    saveInBrowser: parsedData.saveInBrowser,
    prefixDownload: parsedData.prefixDownload,
    currency: parsedData.currency,
  };

  if (saveInBrowser) {
    try {
      localStorage.setItem('financialData', JSON.stringify(updatedData));
    } catch (error) {
      throw new Error(`Failed to save to localStorage: ${(error as Error).message}`);
    }
  }

  return {
    data: updatedData,
    notification: {
      id: Date.now().toString(),
      message: 'Data saved successfully',
      type: 'success',
    },
  };
};

// Validates and creates a transaction from form input
export const validateAndCreateTransaction = (
  transaction: {
    type: 'income' | 'expense';
    date: string;
    category: string;
    merchant: string;
    amount: string;
  },
  categories: string[],
  existingId?: string
): Transaction => {
  const { type, date, category, merchant, amount } = transaction;

  if (!['income', 'expense'].includes(type)) {
    throw new Error(`Invalid transaction type: ${type}`);
  }

  if (!date || isNaN(new Date(date).getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }

  if (type === 'expense' && (!category || !categories.includes(category))) {
    throw new Error(`Invalid category for expense: ${category}`);
  }

  if (!merchant || merchant.trim() === '') {
    throw new Error('Merchant cannot be empty');
  }

  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error(`Invalid amount: ${amount}`);
  }

  return {
    id: existingId || `t-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    date,
    category: type === 'expense' ? category : '',
    merchant: merchant.trim(),
    amount: parsedAmount,
  };
};