
import fetchMock from 'jest-fetch-mock';
import { readFromApi, writeToApi } from './externalApi';

const mockData: any = {
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
  currency: 'USD',
  externalApi: {
    read: '/read',
    write: '/write',
  },
};

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('externalApi', () => {
  it('reads data from API', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const result = await readFromApi('/read');
    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith('/read');
  });

  it('throws on read failure', async () => {
    fetchMock.mockResponseOnce('', { status: 500 });

    await expect(readFromApi('/read')).rejects.toThrow('Failed to read from API: 500');
  });

  it('writes data to API', async () => {
    fetchMock.mockResponseOnce('', { status: 200 });

    await writeToApi('/write', mockData);
    expect(fetchMock).toHaveBeenCalledWith('/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData),
    });
  });

  it('throws on write failure', async () => {
    fetchMock.mockResponseOnce('', { status: 400 });

    await expect(writeToApi('/write', mockData)).rejects.toThrow('Failed to write to API: 400');
  });
});
