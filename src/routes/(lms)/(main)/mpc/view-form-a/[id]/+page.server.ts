import { PRIVATE_FETCH_BASE_URL } from '$env/static/private';
import { serverFetchApi } from '$lib/server/utils/fetchApi.js';
import type { Options } from '$lib/types/form.js';
import type { FormATableGrouped, countCourse } from '$lib/types/index.js';
import type { FormADetailResponse, FormAType } from '$lib/types/mpc.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, cookies, fetch, params }) {
    await parent();
    const { id } = params;
    console.log({
        id
    });
    
    const editUrl = `${PRIVATE_FETCH_BASE_URL}/mpc/api/get-formA-detail?meetingId=${id}`;
    
    const [{ json, error }, {json: countJson, error: countError}] = await Promise.all([
        serverFetchApi<FormADetailResponse>(editUrl, 'GET', null, fetch,  cookies),
        serverFetchApi<countCourse[]>( `${PRIVATE_FETCH_BASE_URL}/mpc/api/get-count-and-by-id?meetingLid=${id}`, 'GET', null, fetch,  cookies),
    ]);
    
    console.log({ json, error });
    console.log({
        countJson,
        countError
    });
    
    
    if(error || countError) {
        throw redirect(303, '/mpc/view-master-form')
    };

    const attendeesOptions: Options[] = json.json.attendees.map((user) => ({
		value: user.user_session_lid,
		label: `${user.first_name} ${user.last_name} (${user.username})`,
		selected: true
	}));

	const absenteesOptions: Options[] = json.json.absentees.map((user) => ({
		value: user.user_session_lid,
		label: `${user.first_name} ${user.last_name} (${user.username})`,
		selected: true
	}));

    const formAGrouped: FormATableGrouped = {
        points: json.groupedJson.points,
        header : json.groupedJson.header
    }
    
    const formAtable: FormAType = {
        points: json.json.points,
        header : json.groupedJson.header
    }

    return {
        masterData: json.json.meeting_data[0],
        attendeesOptions,
        absenteesOptions,
        formAtable,
        formAGrouped,
        meetingId: id,
        countJson: countJson
    }
}