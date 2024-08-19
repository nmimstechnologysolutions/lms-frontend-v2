import { PRIVATE_FETCH_BASE_URL } from '$env/static/private';
import { serverFetchApi } from '$lib/server/utils/fetchApi.js';
import type { FormBData, GetFormBResponse, GroupedFormBData, formBDetails } from '$lib/types/mpc.js';
import { redirect } from '@sveltejs/kit';

type ResponseType = {
    formDetails: formBDetails,
    formBData: FormBData[],
    groupedData: GroupedFormBData
}
export async function load({ parent, fetch, cookies, url }) {
    await parent();
    
    const search = url.search;
    const viewUrl = `${PRIVATE_FETCH_BASE_URL}/mpc/api/get-formB-detail-by-id${search}`;
    const { json, error }  = await serverFetchApi<ResponseType>(viewUrl, "GET", null, fetch, cookies);
    
    if(error || !json) {
        throw redirect(303, "/mpc/view-form-b")
    }

    const uniqueHeaders = [...new Set(json.formBData.map(val => val.subject_id))];
    const header = uniqueHeaders.map(id => {
        return {
                id: id,
                name: json.formBData.filter(val => val.subject_id === id)?.[0].subject_name
            }
        });

    header.unshift({
        id: 0,
        name: 'Points'
    })

    const formBDataForTable = {
        header,
        data: json.groupedData
    }

    const newdata = await serverFetchApi<GetFormBResponse>(`${PRIVATE_FETCH_BASE_URL}/mpc/api/get-form-b-read?acadYear=${json.formDetails.acad_year}&program=${json.formDetails.program_lid}&acadSession=${json.formDetails.session_lid}&subjectLid=${json.formDetails.subject_lid}`,'GET',null,fetch, cookies);


    console.log("newTableData :",newdata);	

    return {
        status: 200,
        formData: formBDataForTable,
        formDetails: json.formDetails,
        newTableData : newdata.json
    }
}



