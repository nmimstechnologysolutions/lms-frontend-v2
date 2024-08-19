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
	import { Eye, Pencil } from 'lucide-svelte';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import type { FormBList } from '$lib/types/mpc';
	import type { CustomError } from '$lib/types/error';

	let tableData: FormBList[] | null = null;
	let fetchError: CustomError;
	$:console.log("tableData::::::::::",tableData);
	let url = `${PUBLIC_FETCH_BASE_URL}/mpc/api/formB-list`;
	
</script>

<Paginate bind:tableData bind:fetchError bind:url>
	<Table hoverable={true}>
		<TableHead theadClass="t-head">
			<TableHeadCell>Acad Year</TableHeadCell>
			<TableHeadCell>Program Name</TableHeadCell>
			<TableHeadCell>Acad Session</TableHeadCell>
			<TableHeadCell>Subject Name</TableHeadCell>
			<TableHeadCell>Action</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y t-body">
			{#if tableData}
				{#each tableData as item, i}
					<TableBodyRow>
						<TableBodyCell>{item.acad_year}</TableBodyCell>
						<TableBodyCell>{item.program_name}</TableBodyCell>
						<TableBodyCell>{item.acad_session}</TableBodyCell>
						<TableBodyCell>{item.subject_name}</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-3">
								<a href="view-form-b/view?acadYear={item.acad_year}&sessionLid={item.session_lid}&programLid={item.program_lid}&subjectLid={item.subject_lid}" title="View">
									<Eye class="text-primary-500 cursor-pointer" />
								</a>
								{#if !item.final_submit}
									<a href="form-b/edit?acadYear={item.acad_year}&sessionLid={item.session_lid}&programLid={item.program_lid}&subjectLid={item.subject_lid}" title="Edit">
										<Pencil class="text-green-500 cursor-pointer" />
									</a>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<TableBodyRow>
						<TableBodyCell class="text-center text-2xl" colspan="4"
							>No Data Present</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			{:else if fetchError}
				<TableBodyRow>
					<TableBodyCell class="text-center text-2xl" colspan="4"
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
					</TableBodyRow>
				{/each}
			{/if}
		</TableBody>
	</Table>
</Paginate>