<script lang="ts">
	import {
		Button,
		Modal,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Paginate from '$lib/components/base/Paginate.svelte';
	import { Eye, Pencil, Trash2 } from 'lucide-svelte';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import type { MasterFormList, MasterFormListSession } from '$lib/types/mpc';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { addToast } from '$lib/stores/toast-store';
	import type { FetchResponse } from '$lib/types/response';
	import type { CustomError } from '$lib/types/error';
	import { showConfirmation } from '$lib/components/modals/Confirm.svelte';

	let tableData: MasterFormList[] | null = null;
	let fetchError: CustomError
 
	let modalTableData: MasterFormListSession[] | null = null;
	let modalFetchError: CustomError
	let url = `${PUBLIC_FETCH_BASE_URL}/mpc/api/master-form-list`;
  
	$: console.log('modalTableData::::::::::', modalTableData)

	let isModalOpen = false;
	const modalBaseUrl = `${PUBLIC_FETCH_BASE_URL}/mpc/api/master-form-list-by-subject`;
	let modalUrl: string;

	
	function openModal(programLid: number, subjectLid: number, acadYear: string) {
		modalUrl =
			modalBaseUrl +
			`?acadYear=${acadYear}&programLid=${programLid}&subjectLid=${subjectLid}`;
		isModalOpen = true;
	}

	async function deleteForm(meetingId: number) {

		const isConfirmed = await showConfirmation('Are you sure you want to Delete this Meeting?');
		if (!isConfirmed) {
			return
		}

		const { json, error } = await fetchApi<FetchResponse>(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/master-form?masterFormId=${meetingId}`,
			'DELETE',
			null
		);

		if(error) {
			addToast({
				color: "red",
				heading: error.status,
				message: error.message,
				position: "bottom-right",
				error: true,
				errorId: error.id ?? 'N.A',
			});
		}

		if(json) {
			addToast({
				color: "green",
				heading: json.status,
				message: json.message,
				position: "bottom-right",
				error: false,
			});
		}

		isModalOpen = false;
	}
</script>

<Paginate bind:tableData bind:fetchError bind:url>
	<Table hoverable={true}>
		<TableHead theadClass="t-head">
			<TableHeadCell>Sr.No</TableHeadCell>
			<TableHeadCell>Program Name</TableHeadCell>
			<TableHeadCell>Subject</TableHeadCell>
			<TableHeadCell>Acad Year</TableHeadCell>
			<TableHeadCell>Action</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y t-body">
			{#if tableData}
				{#each tableData as item, i}
					<TableBodyRow>
						<TableBodyCell>{i + 1}</TableBodyCell>
						<TableBodyCell
							>{item.program_name} ({item.program_code}) - {item.program_id}</TableBodyCell
						>
						<TableBodyCell
							>{item.subject_name} ({item.subject_abbr}) - {item.subject_id}</TableBodyCell
						>
						<TableBodyCell>{item.acad_year}</TableBodyCell>
						<TableBodyCell
							><Button
								class="text-xs"
								on:click={() => openModal(item.program_lid, item.subject_lid, item.acad_year)}
								>View All Meetings</Button
							>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<TableBodyRow>
						<TableBodyCell class="text-center text-2xl" colspan="5"
							>No Data Present</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			{:else if fetchError}
				<TableBodyRow>
					<TableBodyCell class="text-center text-2xl" colspan="5"
						>{fetchError.message}</TableBodyCell
					>
				</TableBodyRow>
			{:else}
				{#each { length: 10 } as item, i}
					<TableBodyRow>
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
</Paginate>

{#if isModalOpen}
	<Modal title="Subject Wise Meetings" bind:open={isModalOpen} size="xl" autoclose>
		<Paginate
			showSearch={false}
			bind:tableData={modalTableData}
			bind:fetchError={modalFetchError}
			bind:url={modalUrl}
		>
			<Table hoverable={true} class="!text-[13px]">
				<TableHead theadClass="t-head">
					<TableHeadCell>Meeting id</TableHeadCell>
					<TableHeadCell>Meeting Name</TableHeadCell>
					<TableHeadCell>Meeting Date</TableHeadCell>
					<TableHeadCell>Program Name</TableHeadCell>
					<TableHeadCell>Subject</TableHeadCell>
					<TableHeadCell>Acad Session</TableHeadCell>
					<TableHeadCell>Acad Year</TableHeadCell>
					<TableHeadCell>Action</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y t-body">
					{#if modalTableData}
						{#each modalTableData as item, i}
							<TableBodyRow>
								<TableBodyCell>{item.meeting_id}</TableBodyCell>
								<TableBodyCell>{item.meeting_name}</TableBodyCell>
								<TableBodyCell>{item.meeting_date}</TableBodyCell>
								<TableBodyCell
									>{item.program_name} ({item.program_code}) - {item.program_id}</TableBodyCell
								>
								<TableBodyCell
									>{item.subject_name} ({item.subject_abbr}) - {item.subject_id}</TableBodyCell
								>
								<TableBodyCell>{item.acad_session}</TableBodyCell>
								<TableBodyCell>{item.acad_year}</TableBodyCell>
								<TableBodyCell>
									<div class="flex gap-3">
										<a href="/mpc/view-master-form/{item.meeting_id}" title="View">
											<Eye class="text-primary-500 cursor-pointer" />
										</a>
										{#if !item.final_submit}
											<a href="/mpc/master-form/{item.meeting_id}" title="Edit">
												<Pencil class="text-green-500 cursor-pointer" />
											</a>
											<button on:click={() => deleteForm(item.meeting_id)} title="Delete">
												<Trash2 class="text-pink-500 cursor-pointer" />
											</button>
										{/if}
									</div>
								</TableBodyCell>
							</TableBodyRow>
						{:else}
							<TableBodyRow>
								<TableBodyCell class="text-center text-2xl" colspan="8"
									>No Data Present</TableBodyCell
								>
							</TableBodyRow>
						{/each}
					{:else if modalFetchError}
						<TableBodyRow>
							<TableBodyCell class="text-center text-2xl" colspan="8"
								>{modalFetchError.message}</TableBodyCell
							>
						</TableBodyRow>
					{:else}
						{#each { length: 1 } as item, i}
							<TableBodyRow class="animate-pulse">
								<TableBodyCell>{i + 1}</TableBodyCell>
								<TableBodyCell />
								<TableBodyCell />
								<TableBodyCell />
								<TableBodyCell />
								<TableBodyCell />
								<TableBodyCell />
								<TableBodyCell />
							</TableBodyRow>
						{/each}
					{/if}
				</TableBody>
			</Table>
		</Paginate>
	</Modal>
{/if}
