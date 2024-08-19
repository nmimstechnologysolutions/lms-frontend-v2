<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Paginate from '$lib/components/base/Paginate.svelte';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import type { FormAList } from '$lib/types/mpc';
	import type { CustomError } from '$lib/types/error';
	import { Eye, Pencil } from 'lucide-svelte';

	let tableData: FormAList[] | null = null;
	let fetchError: CustomError;

	let url = `${PUBLIC_FETCH_BASE_URL}/mpc/api/formA-list`;
</script>

<Paginate bind:tableData bind:fetchError bind:url>
	<Table hoverable={true}>
		<TableHead theadClass="t-head">
			<TableHeadCell>Meeting ID</TableHeadCell>
			<TableHeadCell>Meeting Name</TableHeadCell>
			<TableHeadCell>Program Name</TableHeadCell>
			<TableHeadCell>Subject</TableHeadCell>
			<TableHeadCell>Acad Year</TableHeadCell>
			<TableHeadCell>Action</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y t-body">
			{#if tableData}
				{#each tableData as item, i}
					<TableBodyRow>
						<TableBodyCell>{item.meeting_id}</TableBodyCell>
						<TableBodyCell>{item.meeting_name}</TableBodyCell>
						<TableBodyCell>{item.program_name}</TableBodyCell>
						<TableBodyCell>{item.subject_name}</TableBodyCell>
						<TableBodyCell>{item.acad_year}</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-3">
								<a href="view-form-a/{item.meeting_id}" title="View">
									<Eye class="text-primary-500 cursor-pointer" />
								</a>
								{#if !item.final_submit}
									<a href="form-a/{item.meeting_id}" title="Edit">
										<Pencil class="text-green-500 cursor-pointer" />
									</a>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<TableBodyRow>
						<TableBodyCell class="text-center text-2xl" colspan="6"
							>No Data Present</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			{:else if fetchError}
				<TableBodyRow>
					<TableBodyCell class="text-center text-2xl" colspan="6"
						>{fetchError.message}</TableBodyCell
					>
				</TableBodyRow>
			{:else}
				{#each { length: 10 } as item, i}
					<TableBodyRow class="animate-pulse">
						<TableBodyCell>{i + 1}</TableBodyCell>
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

