/* eslint @typescript-eslint/no-explicit-any: 0 */ // --> OFF
import type { ApiResponse } from '$lib/types';
import type { Cookies, HttpMethod } from '@sveltejs/kit';

export const serverFetchApi = async <T>(
	url: string,
	method: HttpMethod,
	body: object | null | undefined,
	fetch: any,
	cookies: Cookies
): Promise<ApiResponse<T>> => {
	try {
		const requestOptions: RequestInit = {
			method,
			credentials: 'include'
		};

		if (method !== 'GET' && body) {
			requestOptions.body = JSON.stringify(body);
		}

		for(const obj of cookies.getAll()) {
			requestOptions.headers = {
				...requestOptions.headers,
				[obj.name]: obj.value
			};
		}

		console.log('requestOptions::::::::', requestOptions);
		

		const response = await fetch(url, requestOptions);

		if (!response.ok) {
			let errorData;
			try {
				errorData = await response.json();
			} catch (error) {
				errorData = {
					message: response.statusText,
					status: response.status
				};
			}
			return { json: null, error: errorData };
		}

		const json = (await response.json()) as T;
		return { json, error: null };
	} catch (error) {
		console.log('error', error);

		return { json: null, error: { message: 'Something went wrong' } };
	}
};
