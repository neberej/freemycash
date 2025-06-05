import { Transaction } from '@src/types';

// Interface for monthly savings data
interface MonthlySavings {
  monthYear: string;
  income: number;
  expenses: number;
  savings: number;
}

// Interface for the result of savings calculation
interface SavingsResult {
  labels: string[];
  savings: number[];
}

/**
 * Groups transactions by month and year, calculating income, expenses, and savings.
 * @param transactions - Array of financial transactions
 * @param currency - Currency symbol for formatting
 * @returns Object containing sorted labels and savings amounts
 * @throws Error if transactions contain invalid dates or amounts
 */
export const calculateMonthlySavings = (
  transactions: Transaction[],
  currency: string
): SavingsResult => {
  // Input validation
  if (!Array.isArray(transactions)) {
    throw new TypeError('Transactions must be an array');
  }

  // Early return for empty transactions
  if (transactions.length === 0) {
    return { labels: [], savings: [] };
  }

  // Use Map for O(1) lookup and to maintain insertion order
  const savingsMap = new Map<string, { income: number; expenses: number }>();

  // Aggregate transactions by month-year
  transactions.forEach((transaction) => {
    // Validate transaction
    if (!transaction.date || isNaN(transaction.amount)) {
      throw new Error(`Invalid transaction: ${JSON.stringify(transaction)}`);
    }

    const date = new Date(transaction.date);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date in transaction: ${transaction.date}`);
    }

    // Use UTC for consistent month-year grouping
    const monthYear = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });

    const current = savingsMap.get(monthYear) || { income: 0, expenses: 0 };
    
    if (transaction.type === 'income') {
      current.income += transaction.amount;
    } else if (transaction.type === 'expense') {
      current.expenses += transaction.amount;
    } else {
      throw new Error(`Invalid transaction type: ${transaction.type}`);
    }

    savingsMap.set(monthYear, current);
  });

  // Convert Map to array and sort by date
  const monthlySavings: MonthlySavings[] = Array.from(savingsMap.entries())
    .map(([monthYear, { income, expenses }]) => ({
      monthYear,
      income,
      expenses,
      savings: income - expenses,
    }))
    .sort((a, b) => {
      const dateA = new Date(`${a.monthYear} 1, 2025 UTC`);
      const dateB = new Date(`${b.monthYear} 1, 2025 UTC`);
      return dateA.getTime() - dateB.getTime();
    });

  // Extract labels and savings for chart
  const labels = monthlySavings.map((entry) => entry.monthYear);
  const savings = monthlySavings.map((entry) => entry.savings);

  return { labels, savings };
};

/**
 * Formats a number as currency
 * @param amount - Number to format
 * @param currency - Currency symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string): string => {
  if (!isFinite(amount)) {
    throw new Error('Amount must be a valid number');
  }
  return `${currency}${amount.toFixed(2)}`;
};