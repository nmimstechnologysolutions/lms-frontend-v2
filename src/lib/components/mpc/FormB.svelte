<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import { addToast } from '$lib/stores/toast-store';
	import type {  FormBType } from '$lib/types';
	import type { DataToGetForFormB } from '$lib/types/mpc';
	import type { FetchResponse } from '$lib/types/response';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { handleExcelDownload } from '$lib/utils/helper/mpc/index.utils';
	import {
		Textarea,
		Table,
		TableHead,
		TableHeadCell,
		TableBodyCell,
		TableBodyRow,
		TableBody,
		Button
	} from 'flowbite-svelte';
	import { Download } from 'lucide-svelte';

	export let datas: FormBType;
	export let formBObj : DataToGetForFormB = {
		acadYear: '',
		acadSession: 0,
		program: 0
	};
	export let readOnly = false;
	export let isRemarksDisabled = false;
	export let isProgramExcelDownload = false;

	let form: HTMLFormElement;

	type JsonType = {
		acad_year: string;
		program_lid: number;
		subject_lid: number
		session_lid: number;
		is_final_submit: boolean;
		remark: string;
	};

	$: console.log("datas : ",datas);
	
	async function handleSubmit(e: Event, isFinalSubmit: boolean) {
		e.preventDefault();
		const formData = new FormData(form);
		const jsonn = Object.fromEntries(formData);
		let jsonToSend: JsonType[] = [];

		for (const [key, value] of Object.entries(jsonn)) {
			const text = value as string;
			const obj: JsonType = {
				acad_year: formBObj.acadYear,
				program_lid: formBObj.program,
				subject_lid: Number(key),
				session_lid: formBObj.acadSession,
				is_final_submit: isFinalSubmit,
				remark: text
			};
			jsonToSend = [obj, ...jsonToSend];
		}
        
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
			message: isFinalSubmit ? "Form B submitted successfully" : "Form B saved as draft successfully",
			position: "bottom-right",
			error: false,
		});
		goto('/mpc/view-form-b')
	}


</script>

{#if isProgramExcelDownload}
	<Button on:click={(e) => handleExcelDownload("form-b-table")}>
		<Download class="w-4 h-4 mr-2" /> Export to Excel
	</Button>
{/if}

<form bind:this={form} class="mt-2">
	<Table hoverable={true} id="form-b-table">
		<TableHead theadClass="t-head">
			{#each datas.header as item, i}
				<TableHeadCell>{item.name}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody tableBodyClass="t-body">
			{#if datas}
				{#each Object.entries(datas.data) as [key, value]}
					<TableBodyRow>
						<TableBodyCell>{value[0].point}</TableBodyCell>
						{#each value as item(item.subject_id)}
							<TableBodyCell>
								{#if item.point === 'Remarks if any'}
									{#if readOnly && isRemarksDisabled}
										 <p>
											{item.text}
										 </p>
									{:else}
										<Textarea
											name="{item.subject_id}"
											rows="4"
											value={item.text}
											placeholder="Enter Your text"
										/>
									{/if}
									
								{:else}
									{#if readOnly}
										 <p>
											{item.text}
										 </p>
									{:else}
										<Textarea
											disabled={readOnly}
											name="{item.point_id}-{item.subject_id}"
											rows="4"
											value={item.text === '' ? 'N.A' : item.text}
										/>
									{/if}
									
								{/if}
							</TableBodyCell>
						{/each}
					</TableBodyRow>
				{/each}
			{:else}
				{#each { length: 16 } as _, i}
					<TableBodyRow class="animate-pulse">
						<TableBodyCell>{i + 1}</TableBodyCell>
						<TableBodyCell />
						<TableBodyCell />
						<TableBodyCell />
						<TableBodyCell />
					</TableBodyRow>
				{/each}
			{/if}
		</TableBody>
	</Table>
	{#if !readOnly || !isRemarksDisabled}
		<div class="flex justify-normal gap-8 mx-auto my-4">
			<Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, false)}
				>Save As Draft</Button
			>
			<Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, true)}>Submit</Button>
		</div>
	{/if}
</form>