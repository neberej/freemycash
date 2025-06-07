
export async function getData<TResponse>(url: string | undefined): Promise<TResponse> {
  if (!url) throw new Error(`URL missing!`);
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
  url: string | undefined,
  body: TBody
): Promise<TResponse> {
  if (!url) throw new Error(`URL missing!`);
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
