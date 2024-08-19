<script lang="ts">
	import { Button, Textarea } from "flowbite-svelte";
    import { goto } from '$app/navigation';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import { addToast } from '$lib/stores/toast-store';
	import type { FetchResponse } from '$lib/types/response';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { handleExcelDownload } from "$lib/utils/helper/mpc/index.utils";
	import { Download } from "lucide-svelte";

	export let newTableData: any;
    export let acad_year:string,program_lid:number,session_lid: number = 0;
    export let readOnly:boolean = false;
	console.log('newTableData IN COMPONENT: ', newTableData);
    type jsonToSendType = {
        acad_year: string
        program_lid : number
        session_lid : number
        is_final_submit: boolean
        remark: string
        subject_lid : string | null
    }[]

    async function handleSubmit(e: Event, is_final_submit: boolean) {
		e.preventDefault();

		let jsonToSend: jsonToSendType[] = [];
        const table = (document.getElementById('form-b-table-new') as HTMLTableElement);
        table.querySelectorAll('textarea').forEach((elm) => {
            const subjectId = elm.getAttribute("data-subjectId");

            let obj:any = {
                acad_year,
                program_lid,
                session_lid,
                is_final_submit,
                'remark':elm.value,
                'subject_lid' : subjectId 
            }

            jsonToSend.push(obj);
            
        })


		let { json, error} = await fetchApi<FetchResponse>(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/submit-formB`, 
			'POST', 
			jsonToSend);

		if (error) {
			console.log(error);
			addToast({
				color: "red",
				heading: error.status,
				message: error.message,
				position: "bottom-right",
				error: false,

			})
			return;
		} 

		if(!json) return;

		addToast({
			color: "green",
			heading: json.status,
			message: is_final_submit ? "Form B submitted successfully" : "Form B saved as draft successfully",
			position: "bottom-right",
			error: false,
		});
		goto('/mpc/view-form-b')
	}
</script>
{#if readOnly}
    <Button on:click={(e) => handleExcelDownload("form-b-table-new")}>
        <Download class="w-4 h-4 mr-2" /> Export to Excel
    </Button>
{/if}
<div class="overflow-x-auto">
    <table id="form-b-table-new" class="w-full mt-3">
        <thead class="t-head">
            <tr>
                {#each newTableData.formBHeaderData as item, i}
                        {#if i === 0}
                            <th class="text-center" rowspan="2">Points</th>
                        {/if}
                        <th class="text-center" colspan={Number(item.count)}>{item.subject_name}</th>
                {/each}
            </tr>
                <tr>
                {#each newTableData.formBHeaderData as item, i}
                    {#each item.campus_arr as camp, j}
                        <th data-event="{camp.campus_lid}-{item.subject_id}" class="text-center">{camp.campus_name}</th>
                    {/each}
                {/each}
                </tr>
        </thead>
        <tbody class="t-body">
            {#each newTableData.formBvalueData as item, i}
                <tr>
                    {#if item.point && item.sub_point}
                        <td class="text-center p-3 text-black" >{item.point}-{item.sub_point}</td>
                    {/if}
                    {#each newTableData.formBHeaderData as header}
                        {#each header.campus_arr as camp, j}
                            <td class="text-center p-3 text-black">{item.jsonb_object_agg[`${camp.campus_lid}-${header.subject_id}`]}</td>
                        {/each}
                    {/each}
                </tr>
            {/each}
            <tr>
                {#each newTableData.formBHeaderData as item, i}
                    {#if i === 0}
                        <th data-event="1-1" class="text-center" rowspan="2">Remarks</th>
                    {/if}
                    <th class="text-center p-2" colspan={Number(item.count)}><Textarea isRequired disabled={readOnly} value={item.remarks  ? item.remarks : ''} data-subjectId={item.subject_id} id={`${item.subject_id}`}/></th>
                {/each}
            </tr>

        </tbody>
    </table>
</div>

{#if !readOnly}
    <div class="flex justify-normal gap-8 mx-auto my-4">
        <Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, false)}
            >Save As Draft</Button
        >
        <Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, true)}>Submit</Button>
    </div>
{/if}
