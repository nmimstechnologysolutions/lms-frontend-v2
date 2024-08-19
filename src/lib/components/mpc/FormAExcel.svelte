<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import { addToast } from '$lib/stores/toast-store';
	import type { FormATable } from '$lib/types';
	import type { FormAObject, JsonType, MeetingdataForFormA } from '$lib/types/mpc';
	import type { FetchResponse } from '$lib/types/response';
	import { excelSerialToDate } from '$lib/utils/helper/excel/serialDate';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import {
		Button,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Textarea
	} from 'flowbite-svelte';
	import { showConfirmation } from '../modals/Confirm.svelte';

	export let tableData: FormATable;
	export let meetingData: MeetingdataForFormA | null = null;
	let isLoading = false;

	let form: HTMLFormElement;
	$: console.log({ meetingData });
	async function handleSubmit(e: Event, isFinalSubmit: boolean) {
		e.preventDefault();

		const message = isFinalSubmit ? 'Are you sure you want to submit?' : 'Are you sure you want to save as draft?';
		const confirm = await showConfirmation(message);
		if (!confirm) return;
		
		const formData = new FormData(form);
		const json = Object.fromEntries(formData);
		console.log(json);

		let jsonToSend: JsonType[] = [];
		for (const [key, value] of Object.entries(json)) {
			const point_id = key.split('-')[0];
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

		const { json: data, error } = await fetchApi<FetchResponse>(`${PUBLIC_FETCH_BASE_URL}/mpc/api/submit-formA`, 'POST', formAObj);
		if (error) {
			console.log(error);
			addToast({
				color: "red",
				heading: error.status,
				message: error.message,
				position: "bottom-right",
				error: true,
				errorId: error.errorId
			});
			isLoading = false;
			return;
		}

		addToast({
			color: "green",
			heading: data.status ?? "Success",
			message: data.message ?? "Successfully Submitted",
			position: "bottom-right",
			error: false,
		});
		goto('/mpc/view-form-a');

	}

	
</script>

{#if tableData}
	<form bind:this={form}>
		<h3 class="text-3xl font-semibold my-6 mx-4">Data To Fill</h3>
		<Table hoverable={true}>
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
								{#if key !== 'type' && key !== 'id'}
									{#if key === 'Points' || key === 'Sub-Points'}
										<TableBodyCell>{value}</TableBodyCell>
									{:else}
										<TableBodyCell>
											{#if item.type === 'date'}
												<Input
													name="{item.id}-{key}"
													type="date"
													value={value}
													placeholder="Enter Date"
												/>
											{:else if item.type === 'number'}
												<Input
													name="{item.id}-{key}"
													type="number"
													value={value || ''}
													placeholder="Enter Number"
												/>
											{:else}
												<Textarea
													name="{item.id}-{key}"
													value={value || ''}
													placeholder="Enter Text"
												/>
											{/if}
										</TableBodyCell>
									{/if}
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
			<Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, false)} disabled={isLoading}>Save As Draft</Button>
			<Button class="w-32" type="submit" on:click={(e) => handleSubmit(e, true)}  disabled={isLoading}>Submit</Button>
		</div>
	</form>
{/if}
