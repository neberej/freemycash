import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, FinancialData } from '@src/types';
import categorization from '@src/static/categorization.json';

export function parseCsvToTransactions(csvText: string, fileName = 'Imported'): Pick<FinancialData, 'transactions'> {
  const parsed = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`CSV parse error: ${parsed.errors[0].message}`);
  }

  const rows = parsed.data;
  const startIndex = rows.findIndex((row) =>
    row.some((cell) => cell?.toLowerCase().includes('date'))
  );

  if (startIndex === -1) {
    throw new Error('Could not find transactions section in CSV.');
  }

  const transactions: Transaction[] = [];

  for (let i = startIndex + 1; i < rows.length; i++) {
    const [date, description, amountStr] = rows[i];

    if (!date || !description || !amountStr) continue;

    const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));
    if (isNaN(amount)) continue;

    transactions.push({
      id: uuidv4(),
      type: amount > 0 ? 'income' : 'expense',
      date: new Date(date).toISOString(),
      merchant: simplifyMerchant(description),
      category: deriveCategory(description),
      amount: Math.abs(amount),
    });
  }

  return { transactions };
}

export function deriveCategory(description: string): string {
  const lower = description.toLowerCase();

  for (const category in categorization) {
    const keywords = categorization[category as keyof typeof categorization];
    if (keywords.some((keyword: string) => lower.includes(keyword))) {
      return category;
    }
  }

  return 'Uncategorized';
}

export function simplifyMerchant(description: string): string {
  return description
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .slice(0, 2)
    .join(' ')
    .trim();
}