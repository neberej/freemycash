// util/api.ts

export async function getData<TResponse>(url: string): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.status}`);
  }

  return response.json();
}

export async function postData<TBody, TResponse>(
  url: string,
  body: TBody
): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`POST ${url} failed: ${response.status}`);
  }

  return response.json();
}
