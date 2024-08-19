import type { ApiResponse } from '$lib/types';
import type { HttpMethod } from '@sveltejs/kit';

export const fetchApi = async <T>(
	url: string,
	method: HttpMethod,
	body?: object | null | undefined
): Promise<ApiResponse<T>> => {
	try {
		const requestOptions: RequestInit = {
			method,
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		};

		if (method !== 'GET' && body) {
			requestOptions.body = JSON.stringify(body);
		}
		console.log('requestOptions', requestOptions);
		
		const response = await fetch(url, requestOptions);

		if (!response.ok) {
			const errorData = await response.json();
			return { json: null, error: errorData };
		}

		const json = (await response.json()) as T;
		return { json, error: null };
	} catch (error) {
		console.log('error', error);
		
		return { json: null, error: { message: 'Something went wrong' } };
	}
};
