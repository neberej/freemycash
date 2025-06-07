import { getData, postData } from './api';

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('api utils', () => {
  test('getData should return JSON on success', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'ok' }));

    const result = await getData<{ message: string }>('/api/test');

    expect(result).toEqual({ message: 'ok' });
    expect(fetchMock).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      method: 'GET',
    }));
  });

  test('getData should throw on error response', async () => {
    fetchMock.mockResponseOnce('Server Error', { status: 500 });

    await expect(getData('/api/fail')).rejects.toThrow('GET /api/fail failed: 500');
  });

  test('postData should send and return JSON on success', async () => {
    const body = { foo: 'bar' };
    const response = { result: 'success' };

    fetchMock.mockResponseOnce(JSON.stringify(response));

    const result = await postData<typeof body, typeof response>('/api/post', body);

    expect(result).toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith('/api/post', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    }));
  });

  test('postData should throw on error response', async () => {
    fetchMock.mockResponseOnce('Bad Request', { status: 400 });

    await expect(postData('/api/post', { foo: 'bar' })).rejects.toThrow('POST /api/post failed: 400');
  });
});
