
import { FinancialData } from '@src/types';

export const readFromApi = async (url: string): Promise<FinancialData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to read from API: ${response.status}`);
  }
  return response.json();
};

export const writeToApi = async (url: string, data: FinancialData): Promise<void> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to write to API: ${response.status}`);
  }
};
