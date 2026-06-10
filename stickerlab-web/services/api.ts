const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions {
  revalidate?: number | false;
  tags?: string[];
}

async function request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: {
      revalidate: options?.revalidate ?? 60,
      tags: options?.tags,
    },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, options),
};
