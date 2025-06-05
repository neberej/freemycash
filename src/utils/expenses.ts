import { Transaction } from '@src/types';

// Interface for filtered expense data
interface ExpenseData {
  category: string;
  transactions: Transaction[];
  total: number;
}

// Interface for expense calculation result
interface ExpensesResult {
  filteredExpenses: ExpenseData[];
  categories: string[];
  months: string[];
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
}

/**
 * Processes transactions to filter expenses, group by category, and prepare chart data.
 * @param transactions - Array of financial transactions
 * @param selectedMonth - Selected month filter (e.g., '2025-06' or 'all')
 * @param currency - Currency symbol for formatting
 * @returns Object containing filtered expenses, categories, months, and chart data
 * @throws Error if transactions contain invalid data
 */
export const processExpenses = (
  transactions: Transaction[],
  selectedMonth: string,
  currency: string
): ExpensesResult => {
  // Input validation
  if (!Array.isArray(transactions)) {
    throw new TypeError('Transactions must be an array');
  }

  // Validate transactions
  transactions.forEach((t) => {
    if (!t.date) throw new Error(`Invalid date in transaction: ${JSON.stringify(t)}`);
    const date = new Date(t.date);
    if (isNaN(date.getTime())) throw new Error(`Invalid date format: ${t.date}`);
    if (isNaN(t.amount)) throw new Error(`Invalid amount in transaction: ${JSON.stringify(t)}`);
  });

  // Filter expenses based on type and selected month
  const filteredExpenses = transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    if (selectedMonth === 'all') return true;
    const date = new Date(t.date + 'T00:00:00Z'); // Use UTC
    const [year, month] = selectedMonth.split('-').map(Number);
    return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month;
  });

  // Group expenses by category
  const categoryMap = new Map<string, Transaction[]>();
  filteredExpenses.forEach((t) => {
    const category = t.category || 'Uncategorized';
    const current = categoryMap.get(category) || [];
    categoryMap.set(category, [...current, t]);
  });

  // Prepare expense data with totals
  const expenseData: ExpenseData[] = Array.from(categoryMap.entries())
    .map(([category, transactions]) => ({
      category,
      transactions,
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  // Extract unique categories
  const categories = expenseData.map((data) => data.category);

  // Extract unique months
  const months = Array.from(
    new Set(
      transactions.map((t) => {
        const date = new Date(t.date + 'T00:00:00Z'); // Use UTC
        return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      })
    )
  ).sort();

  // Define color palette for pie chart
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEEAD', // Yellow
    '#D4A5A5', // Pink
    '#9B59B6', // Purple
  ];

  // Prepare chart data
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses by Category',
        data: expenseData.map((data) => data.total),
        backgroundColor: categories.map((_, i) => colors[i % colors.length]),
        borderColor: categories.map((_, i) => colors[i % colors.length]),
        borderWidth: 1,
      },
    ],
  };

  return {
    filteredExpenses: expenseData,
    categories,
    months,
    chartData,
  };
};

/**
 * Formats a date string to a readable format
 * @param dateStr - Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00Z'); // Use UTC
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};