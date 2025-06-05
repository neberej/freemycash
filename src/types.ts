
export interface FinancialData {
  transactions: Transaction[];
  saveInBrowser: boolean;
  prefixDownload: boolean;
  currency: string;
  categories: string[];
  externalApi?: {
    read: string;
    write: string;
  }
}

export interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  date: string;
  merchant: string;
  category: string;
  amount: number;
}

export interface ExpenseGroup {
  category: string;
  transactions: Transaction[];
  total: number;
}


export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}