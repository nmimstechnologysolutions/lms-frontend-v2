<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import type { FormATableGrouped } from '$lib/types';
	import type { FormAObject, JsonType, MeetingdataForFormA } from '$lib/types/mpc';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { handleExcelDownload } from '$lib/utils/helper/mpc/index.utils';
	import {
		Button,
		Textarea,
		Table,
		TableHead,
		TableHeadCell,
		TableBodyCell,
		TableBodyRow,
		TableBody,
		Input
	} from 'flowbite-svelte';

	import { Download } from 'lucide-svelte';
	import { showConfirmation } from '../modals/Confirm.svelte';
	import { addToast } from '$lib/stores/toast-store';
	import type { FetchResponse } from '$lib/types/response';

	export let datas: FormATableGrouped;
	export let readOnly = false;
	export let meetingData : MeetingdataForFormA | null = null;
	//export let is_edit = false;
	export let isCourseExcelDownload = false;
	let isLoading = false;
	
	
	let form: HTMLFormElement;

	async function handleSubmit(e: Event, isFinalSubmit: boolean) {
		e.preventDefault();

		const message = isFinalSubmit ? 'Are you sure you want to submit?' : 'Are you sure you want to save as draft?';
		const confirm = await showConfirmation(message);
		if (!confirm) return;

		const formData = new FormData(form);
		const data = Object.fromEntries(formData);

		let jsonToSend: JsonType[] = [];
		for (const [key, value] of Object.entries(data)) {
			
			const point_id = key.split('-')[0].trim();
			const campus_id = key.split('-').pop()!.trim();
			const text = value as string;
			const obj = {
				point_id: parseInt(point_id),
				campus_id,
				text
			};

			jsonToSend = [obj, ...jsonToSend];
		}
		const formAObj: FormAObject = {
			meetingId: meetingData?.meetingId ?? 0,
			attendees: meetingData?.attendeesValue ?? [],
			absentees: meetingData?.absenteesvalue ?? [],
			jsonToSend,
			isFinalSubmit
		};
		
		let {json, error} = await fetchApi<FetchResponse>(`${PUBLIC_FETCH_BASE_URL}/mpc/api/submit-formA`, 'POST', formAObj);
		if (!json || error) {
			console.log(error);
			addToast({
				color: 'red',
				heading: 'Error',
				message: error?.message ?? "Something went wrong",
				position: 'bottom-right',
				error: true
			});
			isLoading = false;
			return;
		}

		addToast({
			color: "green",
			heading: json.status ?? "Success",
			message: json.message ?? "Successfully Submitted",
			position: "bottom-right",
			error: false,
		});
		goto('/mpc/view-form-a');
	}

	$: console.log("datas : ",datas);
	
</script>

{#if isCourseExcelDownload}
	<Button on:click={(e) => handleExcelDownload("form-a-table")}>
		<Download class="w-4 h-4 mr-2" /> Export to Excel
	</Button>
{/if}


<form bind:this={form} class="mt-2">
	{#if !readOnly}
		<!-- <h3 class="text-3xl font-semibold my-6 mx-4">Data To Fill</h3> -->
	{/if}
	<Table hoverable={true} id="form-a-table" >
		<TableHead theadClass="t-head">
			{#each datas.header as item, i}
				<TableHeadCell>{item.name}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody tableBodyClass="t-body">
			{#if datas.points}
				{#each Object.entries(datas.points) as [key, value]}
					<TableBodyRow>
						<TableBodyCell>{value[0].point}</TableBodyCell>
						<TableBodyCell>{value[0].subPoint}</TableBodyCell>
						{#each datas.header as head}
							{#if Number(datas.header.length) === Number(value.length + 2)}
								{#each value as item}
									{#if head.id == item.campus_lid}
										<TableBodyCell>
											{#if readOnly}
												<p>
													{item.text === "" ? "N.A" : item.text}
												</p>
											{:else}
												{#if item.type == "number"}
													<Input
														disabled={readOnly}
														name="{item.id}-{item.campus_lid}"
														type="number"
														value={item.text}
														placeholder="00"
														min={0}
														max={100}
													/>
												{:else if item.type == "date"}
													 <Input
														disabled={readOnly}
														name="{item.id}-{item.campus_lid}"
														type="date"
														value={item.text}
													/>
												{:else}
													<Textarea
														disabled={readOnly}
														name="{item.id}-{item.campus_lid}"
														rows="4"
														value={item.text ?? 'N.A'}
														placeholder="Enter Your text"
													/>
												{/if}
											{/if}
										</TableBodyCell>
									{:else}
										<!-- {#if head.name !== "Points" && head.name !== "Sub-Points"}
											<TableBodyCell>
												{#if item.type === "number"}
													<Input
														disabled={readOnly}
														name="{item.id}-{head.id}"
														type="number"
														placeholder="00"
														min={0}
														max={100}
													/>
												{:else if item.type === "date"}
													 <Input
														disabled={readOnly}
														name="{item.id}-{head.id}"
														type="date"
													/>
												{:else}
													<Textarea
														disabled={readOnly}
														rows="4"
														name={`${item.id}-${head.id}`}
														value={""}
														placeholder="{readOnly ? 'N.A' : "Enter Your text"}"
													/>
												{/if}
											</TableBodyCell>
										{/if} -->
									{/if}
								{/each}
							{:else}
								{#if head.name !== "Points" && head.name !== "Sub-Points"}
									 <TableBodyCell>
										 <Textarea
											 disabled={readOnly}
											 rows="4"
											 name={`${value[0].id}-${head.id}`}
											 value={""}
											 placeholder="{readOnly ? 'N.A' : "Enter Your text"}"
										 />
									 </TableBodyCell>
								{/if}
							{/if}
						{/each}
					</TableBodyRow>
				{/each}
			{:else}
				{#each { length: datas.header.length } as item, i}
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
	{#if !readOnly}
		<div class="flex justify-normal gap-8 mx-auto my-4">
			<Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, false)}  disabled={isLoading}
				>Save As Draft</Button
			>
			<Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, true)}  disabled={isLoading} >Submit</Button>
		</div>
	{/if}
</form>
