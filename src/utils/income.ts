import { Transaction } from '@src/types';

// Filtered income data
interface IncomeData {
  category: string;
  transactions: Transaction[];
  total: number;
}

// Income calculation result
interface IncomeResult {
  filteredIncome: IncomeData[];
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

// Processes transactions to filter income, group by category, and prepare chart data
export const processIncome = (
  transactions: Transaction[],
  selectedMonth: string,
  currency: string
): IncomeResult => {

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

  // Filter income based on type and selected month
  const filteredIncome = transactions.filter((t) => {
    if (t.type !== 'income') return false;
    if (selectedMonth === 'all') return true;
    const date = new Date(t.date + 'T00:00:00Z'); // Use UTC
    const [year, month] = selectedMonth.split('-').map(Number);
    return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month;
  });

  // Group income by category
  const categoryMap = new Map<string, Transaction[]>();
  filteredIncome.forEach((t) => {
    const category = t.category || 'Uncategorized';
    const current = categoryMap.get(category) || [];
    categoryMap.set(category, [...current, t]);
  });

  // Prepare income data with totals
  const incomeData: IncomeData[] = Array.from(categoryMap.entries())
    .map(([category, transactions]) => ({
      category,
      transactions,
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  // Extract unique months
  const months = Array.from(
    new Set(
      transactions.map((t) => {
        const date = new Date(t.date + 'T00:00:00Z'); // Use UTC
        return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      })
    )
  ).sort();

  // Define color palette for pie chart (matching Expenses.tsx)
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
    labels: incomeData.map((data) => data.category),
    datasets: [
      {
        label: 'Income by Category',
        data: incomeData.map((data) => data.total),
        backgroundColor: incomeData.map((_, i) => colors[i % colors.length]),
        borderColor: incomeData.map((_, i) => colors[i % colors.length]),
        borderWidth: 1,
      },
    ],
  };

  return {
    filteredIncome: incomeData,
    months,
    chartData,
  };
};

// Formats a date string to a readable format
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00Z'); // Use UTC
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};
