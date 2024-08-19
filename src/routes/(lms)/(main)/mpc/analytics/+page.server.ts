import { PRIVATE_FETCH_BASE_URL } from '$env/static/private';
import { serverFetchApi } from '$lib/server/utils/fetchApi.js';
import type { SchoolListAnalytics } from '$lib/types/mpc.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, fetch, cookies }) {
    await parent();

    const { json, error } = await serverFetchApi<SchoolListAnalytics[]>(
        `${PRIVATE_FETCH_BASE_URL}/mpc/api/mpc-school-list`, 
        "GET", null, fetch, cookies);

    if(error) {
        throw redirect(303, '/mpc')
    }

    return {
        status: 200,
        organizationJson: json
    }
}