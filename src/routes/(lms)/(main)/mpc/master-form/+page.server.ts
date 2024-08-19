import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
import { getOptionsServer } from '$lib/server/utils/options.helper.js';
import type { SelectFieldOption } from '$lib/types/form.js';

export async function load({ parent, fetch, cookies }) {
    await parent();

    let campusList: SelectFieldOption[] = [];


    campusList = await getOptionsServer(
        `${PUBLIC_FETCH_BASE_URL}/mpc/api/campus-by-user`,
        fetch,
        cookies
    );

    return {
        campusList
    }
}