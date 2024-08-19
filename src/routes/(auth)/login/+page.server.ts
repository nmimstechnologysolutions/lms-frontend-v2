import { serverFetchApi } from '$lib/server/utils/fetchApi';
import { PRIVATE_AUTH_BASE_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

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
	
    if(json) {
        redirect(303, '/dashboard');
    }
}