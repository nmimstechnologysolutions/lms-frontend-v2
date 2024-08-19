import { serverFetchApi } from "$lib/server/utils/fetchApi";
import type { Options } from "$lib/types/form";
import type { Cookies } from "@sveltejs/kit";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getOptionsServer(url: string, fetch: any, cookies: Cookies): Promise<Options[]> {
  const {json, error} = await serverFetchApi<Options[]>(url, 'GET', null, fetch, cookies);
  console.log({
      json,
      error
  });
  
  if(error) {
    return []
  }

  return json;
}