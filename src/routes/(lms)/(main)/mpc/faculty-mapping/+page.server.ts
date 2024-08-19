import { PRIVATE_FETCH_BASE_URL } from "$env/static/private";
import { getOptionsServer } from "$lib/server/utils/options.helper";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const data = await Promise.all([
        getOptionsServer(`${PRIVATE_FETCH_BASE_URL}/mpc/api/get-username-all`, fetch, cookies),
        getOptionsServer(`${PRIVATE_FETCH_BASE_URL}/mpc/api/get-program-all`, fetch, cookies),
        getOptionsServer(`${PRIVATE_FETCH_BASE_URL}/mpc/api/get-campus-all`, fetch, cookies),
        getOptionsServer(`${PRIVATE_FETCH_BASE_URL}/mpc/api/get-acadSession-all`, fetch, cookies),
        getOptionsServer(`${PRIVATE_FETCH_BASE_URL}/mpc/api/get-subject-all`, fetch, cookies),
    ]);

    return {
        options: data
    }
};