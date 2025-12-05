import { notFound, redirect } from 'next/navigation';

export interface FetchProps {
  endpoint: string;
  isThirdParty?: boolean;
  method: 'POST' | 'GET';
  token?: string | undefined;
  data?: any;
  timeout?: number;
  isClient?: boolean;
}

export async function customFetch({
  endpoint,
  isThirdParty = false,
  method,
  token,
  data,
  isClient
}: FetchProps) {
  let url = '';
  if (!isThirdParty)
    url = `${
      !isClient ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL
    }${endpoint}`;
  else url = endpoint;
  return fetch(url, {
    method: method,
    body: data ? JSON.stringify(data) : null,
    headers: !isThirdParty
      ? {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      : {},
    cache: 'no-store'
  });
}

export async function getPageDetail({ path, slug, locale }: any) {
  try {
    let res = await customFetch({
      endpoint: `/page/detail?slug=${slug}&locale=${locale}`,
      method: 'GET',
      token: process.env.API_KEY_GET
    });
    console.log(`======== getPageDetail ${slug} ${locale} ok`, res.ok);
    if (!res.ok) notFound();
    // if (res.status === 404) {
    //   redirect(`/id${path}`);
    // }

    let data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
