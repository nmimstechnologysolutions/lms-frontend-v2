import { serverFetchApi } from '$lib/server/utils/fetchApi';
import { PRIVATE_AUTH_BASE_URL } from '$env/static/private';
import { redirect, type NumericRange } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

import type { UserSessionData } from '$lib/types/index.js';

export async function load({ fetch, cookies }) {
	console.log('cookies', cookies);
	
	const { json, error: err } = await serverFetchApi<UserSessionData>(
		`${PRIVATE_AUTH_BASE_URL}/validate-route`,
		'GET',
		null,
		fetch,
        cookies
	);
	console.log({
		json,
		err
	});
	if (err && err.status === 'UNAUTHORIZED') {
		redirect(303, '/login');
	}

	if(err) {
		error((Number(err.status) as NumericRange<400, 599>) ?? 500, {
			message: err.message ?? 'Something went wrong',
		});
	}

	return {
		json
	};
}
