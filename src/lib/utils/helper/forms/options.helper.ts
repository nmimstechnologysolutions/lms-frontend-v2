import type { Options } from "$lib/types/form";
import { fetchApi } from "../fetchApi";

export async function getOptions(url: string): Promise<Options[]> {
  const {json, error} = await fetchApi<Options[]>(url, 'GET');
 console.log({
    json,
    error
 });
 
  if(error) {
    return []
  }

  return json;
}