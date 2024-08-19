<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import { addToast } from '$lib/stores/toast-store';
	import type { FormATable } from '$lib/types';
	import type { DataToGetForFormB } from '$lib/types/mpc';
	import type { FetchResponse } from '$lib/types/response';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import {
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Textarea
	} from 'flowbite-svelte';

	export let tableData: FormATable;
	export let formBObj : DataToGetForFormB;
	let form: HTMLFormElement;

	$: {
		console.log("tableData:::::::", tableData);
	}

	type JsonType = {
		acad_year: string;
		program_lid: number;
		subject_lid: number
		session_lid: number;
		is_final_submit: boolean;
		remark: string;
	};

	async function handleSubmit(e: Event, isFinalSubmit: boolean) {
		e.preventDefault();
		const formData = new FormData(form);
		const jsonn = Object.fromEntries(formData);

		let jsonToSend: JsonType[] = [];

		for (const [key, value] of Object.entries(jsonn)) {
			const text = value as string;
			const obj = {
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

{#if tableData}
<form bind:this={form} class="mt-2">
		<h3 class="text-3xl font-semibold my-6 mx-4">Data To Fill</h3>
		<Table id="form-b-table-excel" hoverable={true}>
			<TableHead theadClass="t-head">
				{#each tableData.header as item, i}
					<TableHeadCell>{item.name}</TableHeadCell>
				{/each}
			</TableHead>
			<TableBody tableBodyClass="t-body">
				{#if tableData.points}
					{#each tableData.points as item, i}
						<TableBodyRow>
							{#each Object.entries(item) as [key, value]}
								{#if key === 'Points'}
									<TableBodyCell>{value}</TableBodyCell>
								{:else}
									<TableBodyCell>
										<Textarea
											name="{key.split('-').pop()}"
											value={value || 'N.A'}
										/>
									</TableBodyCell>
								{/if}
							{/each}
						</TableBodyRow>
					{/each}
				{:else}
					{#each { length: 16 } as item, i}
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
		<div class="flex justify-normal gap-8 mx-auto my-4">
			<Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, false)}>Save As Draft</Button>
			
			<Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, true)}>Submit</Button>
		</div>
	</form>
{/if}
