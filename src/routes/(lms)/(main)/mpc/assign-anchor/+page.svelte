<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
	} from 'flowbite-svelte';
	import { Download } from 'lucide-svelte';
	import Paginate from '$lib/components/base/Paginate.svelte';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import type { AssignUserData, FacultyRole, UserRoleResult } from '$lib/types/mpc';
	import type { CustomError } from '$lib/types/error';
	import AssignMpcRoleTableRow from '$lib/components/mpc/AssignMpcRoleTableRow.svelte';
	import RightSidebar from '$lib/components/layout/RightSidebar.svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import { facultyRoleStore } from '$lib/stores/mpc/faculty-role';
	import { showConfirmation } from '$lib/components/modals/Confirm.svelte';
	import * as XLSX from 'xlsx';
	import * as EXCEL from 'exceljs';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import type { FetchResponse } from '$lib/types/response';
	import { addToast } from '$lib/stores/toast-store';
	import { jsonToExcelExcelJsForAssignAnchor } from '$lib/utils/helper/mpc/index.utils';
	import { getAcadyearForOption } from '$lib/utils/helper/index.js';
	import Select from '$lib/components/form/Select.svelte';

	let isOpened = false;

	let tableData: UserRoleResult[] | null = null;

	let fetchError: CustomError;
	$: console.log({
		tableData
	});

	let acadYear: string = new Date().getFullYear().toString();
	let url = `${PUBLIC_FETCH_BASE_URL}/mpc/api/user-to-assign-role?acadYear=${acadYear}`;

	function handleAcadYear(e: Event): void {
		console.log('acadYearacadYear',acadYear);
		url = `${PUBLIC_FETCH_BASE_URL}/mpc/api/user-to-assign-role?acadYear=${acadYear}`;
	}



	beforeNavigate(async ({ to, cancel }) => {
		if ($facultyRoleStore.length > 0) {
			cancel();
			const confirmed = await showConfirmation(
				'Are you sure you want to proceed? </br> All the changes will be lost.'
			);

			if (confirmed) {
				facultyRoleStore.set([]);
				goto(to?.url?.pathname! ?? '/mpc');
			}
		}
	});



	let userData: UserRoleResult[];
	async function handleDownloadUsers() {
		const { json, error } = await fetchApi(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/user-to-assign-role-excel`,
			'GET',
			null
		);

		if (!json) return;

		userData = json as UserRoleResult[];
		// var worksheet = XLSX.utils.json_to_sheet(userData);
		// var workbook = XLSX.utils.book_new();
		// XLSX.utils.book_append_sheet(workbook, worksheet, "UserList");
		// XLSX.writeFile(workbook, "AssignUser.xlsx");
		await jsonToExcelExcelJsForAssignAnchor(userData, 'AssignUser', 'UserList');
	}

	async function handleUserFileUpload(e: any) {
		const fileInput = document.querySelector<HTMLInputElement>('#userFileListUpload');
		console.log('handleUserFileUpload called', fileInput);
		if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
			addToast({
				color: 'red',
				heading: 'File',
				message: 'Kindly selected file to upload',
				position: 'bottom-right',
				error: false
			});
			return;
		}

		const file = fileInput.files[0];
		console.log('Selected file:', file);

		const reader = new FileReader();

		reader.onload = async function (ev: any) {
			const excelData = ev.target.result;
			const workbook = XLSX.read(excelData, { type: 'binary' });

			const result: any = {};

			workbook.SheetNames.forEach(async (sheetName) => {
				console.log('SheetName: ' + sheetName);

				const worksheet = workbook.Sheets[sheetName];
				const sheetData = XLSX.utils.sheet_to_json(worksheet);
				result[sheetName] = sheetData;
			});

			console.log('Before Data : ', userData);
			console.log('Excel Data as JSON:', result);

			let comparedData = await compareAndPushChanges(userData, result.UserList);
			const data = {
				data: comparedData
			};
			console.log('New Data as JSON:', data);

			const { json, error } = await fetchApi<FetchResponse>(
				`${PUBLIC_FETCH_BASE_URL}/mpc/api/assign-role`,
				'POST',
				data
			);

			if (error) {
				console.log(error);
				addToast({
					color: 'red',
					heading: error.status,
					message: error.message,
					position: 'bottom-right',
					error: false
				});
				return;
			}
			console.log(json);

			facultyRoleStore.set([]);

			addToast({
				color: 'green',
				heading: json.status,
				message: json.message,
				position: 'bottom-right',
				error: false
			});

			goto('/mpc');
		};

		reader.readAsBinaryString(file);
	}

	function compareAndPushChanges(
		existingData: UserRoleResult[],
		newData: UserRoleResult[]
	): Promise<AssignUserData[]> {
		return new Promise((resolve, reject) => {
			const changedData: AssignUserData[] = [];

			const existingMap: Record<string, UserRoleResult> = {};
			existingData.forEach((item) => {
				existingMap[item.user_session_lid] = item;
			});

			newData.forEach((newItem) => {
				const existingItem = existingMap[newItem.user_session_lid];

				if (existingItem) {
					if (
						existingItem.is_program_anchor !== newItem.is_program_anchor ||
						existingItem.is_course_anchor !== newItem.is_course_anchor
					) {
						let obj: AssignUserData = {
							usersessionLid: newItem.user_session_lid,
							isProgramAnchor: newItem.is_program_anchor,
							isCourseAnchor: newItem.is_course_anchor
						};
						changedData.push(obj);
					}
				}
			});
			resolve(changedData);
		});
	}
	

</script>

<svelte:head>
	<meta
		name="description"
		title="Assign Role"
		content="Page for Assgning Program Anchor and Course Anchor Roles FOr Mpc Module"
	/>
</svelte:head>
<div class="border-2 border-solid border-gray-300 rounded-lg p-3 flex items-center gap-4">
	<input type="file" id="userFileListUpload" />
	<Button class="h-fit" on:click={handleUserFileUpload}>Upload Excel</Button>
	<Button class="h-fit" on:click={handleDownloadUsers}>
		<Download class="w-4 h-4 mr-2" /> Download Excel
	</Button>
</div>
<div class="flex min-h-full gap-x-5">
	<div class="overflow-x-auto flex-1">
		<div class="pt-4 w-[210px]">
			<Select
			options={getAcadyearForOption()}
			on:change={handleAcadYear}
			bind:value={acadYear}
			name="acad_year"
			placeholder="Select Acad Year"
		/>
		</div>
		<Paginate bind:tableData bind:fetchError bind:url class="flex-1">
			<Table id="assign-role-table" hoverable={true}>
				<TableHead theadClass="t-head">
					<TableHeadCell>Username</TableHeadCell>
					<TableHeadCell>Faculty Name</TableHeadCell>
					<TableHeadCell>Program</TableHeadCell>
					<TableHeadCell>Subject</TableHeadCell>
					<TableHeadCell>Semester</TableHeadCell>
					<TableHeadCell>Campus</TableHeadCell>
					<!-- <TableHeadCell>School</TableHeadCell> -->
					<TableHeadCell>Program Anchor / <br /> Program Chair</TableHeadCell>
					<TableHeadCell>Course Anchor</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y t-body">
					{#if tableData}
						{#each tableData as item, i}
							<AssignMpcRoleTableRow bind:isOpened {item} />
						{:else}
							<TableBodyRow>
								<TableBodyCell class="text-center text-2xl" colspan="8"
									>No Data Present</TableBodyCell
								>
							</TableBodyRow>
						{/each}
					{:else if fetchError}
						<TableBodyRow>
							<TableBodyCell class="text-center text-2xl" colspan="8"
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
								<TableBodyCell />
								<TableBodyCell />
								<TableBodyCell />
							</TableBodyRow>
						{/each}
					{/if}
				</TableBody>
			</Table>
		</Paginate>
	</div>
	<RightSidebar />
</div>
