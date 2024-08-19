import { PRIVATE_FETCH_BASE_URL } from '$env/static/private';
import { serverFetchApi } from '$lib/server/utils/fetchApi.js';
import type { SingleMasterFormRequestObject } from '$lib/types/mpc.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, cookies, fetch, params }) {
    await parent();
    const { id } = params;
    const editUrl = `${PRIVATE_FETCH_BASE_URL}/mpc/api/master-form-by-id?masterFormId=${id}`;
    const { json, error } = await serverFetchApi<SingleMasterFormRequestObject>(editUrl, 'GET', null, fetch,  cookies);

    if(error) {
        throw redirect(303, '/mpc/view-master-form')
    };

    const programAnchorOptions = json.master_form_users.program_anchor.map((user) => ({
		value: user.user_session_lid,
		label: `${user.first_name} ${user.last_name} (${user.username})`,
		selected: true
	}));

	const courseAnchorOptions = json.master_form_users.course_anchor.map((user) => ({
		value: user.user_session_lid,
		label: `${user.first_name} ${user.last_name} (${user.username})`,
		selected: true
	}));

	const attendeesOptions = json.master_form_users.attendees.map((user) => ({
		value: user.user_session_lid,
		label: `${user.first_name} ${user.last_name} (${user.username})`,
		selected: true
	}));

    console.log({
        programAnchorOptions,
        courseAnchorOptions,
        attendeesOptions,
    });
    

    return {
        masterData: json.master_data,
        programAnchorOptions,
        courseAnchorOptions,
        attendeesOptions,
    }
}