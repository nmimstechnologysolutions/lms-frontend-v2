import { serverFetchApi } from '$lib/server/utils/fetchApi.js';
import { json, type HttpMethod } from '@sveltejs/kit';

export async function GET({ fetch, request, cookies }) {
	const data = await serverFetchApi(
		request.headers.get('url')!,
		request.headers.get('method') as HttpMethod,
		null,
		fetch,
		cookies
	);

	return json(data);
}

export async function POST({ fetch, request, cookies }) {

  const body = await request.json();
  console.log('body', body);
  console.log('request.headers.get(\'url\')!', request.headers.get('url')!);
  console.log('request.headers.get(\'method\')!', request.headers.get('method')!);
  
	const data = await serverFetchApi(
		request.headers.get('url')!,
		request.headers.get('method') as HttpMethod,
		body,
		fetch,
		cookies
	);

  console.log('DATA IN POST', data);
  
	return json(data);
}

export async function PUT({ fetch, request, cookies }) {

  const body = await request.json();
	const data = await serverFetchApi(
		request.headers.get('url')!,
		request.headers.get('method') as HttpMethod,
		body,
		fetch,
		cookies
	);

	return json(data);
}

export async function DELETE({ fetch, request, cookies }) {

  const body = await request.json();
	const data = await serverFetchApi(
		request.headers.get('url')!,
		request.headers.get('method') as HttpMethod,
		body,
		fetch,
		cookies
	);

	return json(data);
}
