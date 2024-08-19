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
	import type { User } from '$lib/types';

	let tableData: User[] | null = null;
	let fetchError: any = null;
	let url = 'https://api.slingacademy.com/v1/sample-data/users';
</script>

<Paginate bind:tableData bind:fetchError bind:url>
	<Table hoverable={true}>
		<TableHead theadClass="t-head">
			<TableHeadCell>Sr No</TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Phone No</TableHeadCell>
			<TableHeadCell>Country</TableHeadCell>
			<TableHeadCell>City</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y t-body">
			{#if tableData}
				{#each tableData as item, i}
					<TableBodyRow>
						<TableBodyCell>{item.id}</TableBodyCell>
						<TableBodyCell>{item.first_name} {item.last_name}</TableBodyCell>
						<TableBodyCell>{item.email}</TableBodyCell>
						<TableBodyCell>{item.phone}</TableBodyCell>
						<TableBodyCell>{item.country}</TableBodyCell>
						<TableBodyCell>{item.city}</TableBodyCell>
					</TableBodyRow>
				{:else}
					<TableBodyRow>
						<TableBodyCell class="text-center text-2xl animate-pulse" colspan="6"
							>No Data Present</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			{:else if fetchError}
				<TableBodyRow>
					<TableBodyCell class="text-center text-2xl animate-pulse" colspan="6"
						>Error in Getting data - {fetchError}</TableBodyCell
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
