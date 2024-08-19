<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import Select from '$lib/components/form/Select.svelte';
	import FormB from '$lib/components/mpc/FormB.svelte';
	import FormBExcel from '$lib/components/mpc/FormBExcel.svelte';
	import type { FormBTable, FormBType } from '$lib/types';
	import type { SelectFieldOption } from '$lib/types/form';
	import { getAcadyearForOption } from '$lib/utils/helper/index.js';
	import type { DynamicMeetingContainer, FormBData, GetFormBResponse } from '$lib/types/mpc';
	import * as XLSX from 'xlsx';

	import { Button, Fileupload, TableHead, TableHeadCell, Toggle } from 'flowbite-svelte';
	import { ArrowRight, Download, Loader, Table, Upload } from 'lucide-svelte';
	import { parseJsonToExcel } from '$lib/utils/helper/excel';
	import { showConfirmation } from '$lib/components/modals/Confirm.svelte';
	import { getOptions } from '$lib/utils/helper/forms/options.helper';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { addToast } from '$lib/stores/toast-store';
	import NewFormB from '$lib/components/mpc/newFormB.svelte';

	let isLoading = false;
	let isSaveAsDraft = false;
	let programSelect: SelectFieldOption[] = [];
	let acadSessionSelect: SelectFieldOption[] = [];
	let subjectSelect: SelectFieldOption[] = [];
	let isExcel = true;
	let excelJson: FormBTable;
	let isToggleDisabled = true;
	let downloadFormASummary: DynamicMeetingContainer;
	let formBSampleDownload: FormBData[];
	let formBDataForTable: FormBType;
	let newTableData:any;

	let acadYear: string, program: number, acadSession: number, subject: number;

	async function saveAsDraft() {
		const isConfirmed = await showConfirmation('Are you Sure You Want to Save As Draft?');
		if (!isConfirmed) return;
		isSaveAsDraft = true;
		await submitFormB();
		isSaveAsDraft = false;
	}

	async function finalSubmit() {
		const isConfirmed = await showConfirmation('Are you Sure You Want to Submit?');
		if (!isConfirmed) return;
		await submitFormB();
	}

	async function submitFormB() {
		console.log('submit form b');
	}

	async function handleAcadYear() {
		programSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/program-by-username-and-year?acadYear=${acadYear}`
		);
	}

	async function handleProgram() {
		acadSessionSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/acad-session-by-program?programLid=${program}&acadYear=${acadYear}`
		);
	}

	async function handleSession() {
		subjectSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/subject-by-program-session?programLid=${program}&acadYear=${acadYear}&acadSession=${acadSession}`
		);
	}

	async function handleGetFormB() {
		let newdata = await fetchApi<GetFormBResponse>(`${PUBLIC_FETCH_BASE_URL}/mpc/api/get-form-b-write?acadYear=${acadYear}&program=${program}&acadSession=${acadSession}&subjectLid=${subject}`,'GET',null);
		const { json, error } = await fetchApi<GetFormBResponse>(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/get-form-b?acadYear=${acadYear}&program=${program}&acadSession=${acadSession}&subjectLid=${subject}`,
			'GET',
			null
		);

		newTableData = newdata.json

		if (error) {
			addToast({
				color: 'red',
				heading: error.status ?? 'ERROR',
				message: error.message,
				error: true,
				position: 'bottom-right',
				errorId: error.errorId ?? crypto.randomUUID()
			});
			return;
		}

		isToggleDisabled = false;
		isExcel = true;
		downloadFormASummary = json.formASummary;
		formBSampleDownload = json.formBData;

		const uniqueHeaders = [...new Set(json.formBData.map((val) => val.subject_id))];
		const header = uniqueHeaders.map((id) => {
			return {
				id: id,
				name: json.formBData.filter((val) => val.subject_id === id)?.[0].subject_name
			};
		});

		header.unshift({
			id: 0,
			name: 'Points'
		});
		formBDataForTable = {
			header,
			data: json.groupedData
		};

		console.log("json : ",json);
		

	}
	
	function downloadFormASummaryExcel() {
		const campusNames = [
			...new Set(
				([] as string[]).concat(
					...Object.values(downloadFormASummary).map((meeting) =>
						meeting.map((item) => item.campus_name)
					)
				)
			)
		].sort();

		const meetings = Object.keys(downloadFormASummary);
		const editData: any = {};

		for (const meetingKey in downloadFormASummary) {
			if (downloadFormASummary[meetingKey as keyof typeof downloadFormASummary] !== undefined) {
				const meetingData = downloadFormASummary[meetingKey as keyof typeof downloadFormASummary];
				meetingData.forEach((item: any) => {
					const key = `${item.point}-${item.sub_point || ''}`;
					if (!editData[key]) {
						editData[key] = {};
					}
					if (!editData[key][meetingKey]) {
						editData[key][meetingKey] = {};
					}
					editData[key][meetingKey][item.campus_name] = item.text;
				});
			}
		}

		const userRows: any = [];
		for (const key in editData) {
			const row = key.split('-');
			const rowData = [row[0], row[1] || ''];

			meetings.forEach((meeting) => {
				const meetingData = editData[key][meeting];
				if (meetingData) {
					campusNames.forEach((campusName) => {
						rowData.push(meetingData[campusName] || '');
					});
				} else {
					campusNames.forEach(() => {
						rowData.push('');
					});
				}
				rowData.push('');
			});
			userRows.push(rowData);
		}

		let newHeaders = [...meetings];
		const headers = ['Points', 'Sub-Points', ...campusNames];

		meetings.slice(1).forEach((meetingKey) => {
			headers.push('');
			const meetingData = downloadFormASummary[meetingKey as keyof typeof downloadFormASummary];
			if (meetingData) {
				campusNames.forEach((campusName) => {
					headers.push(`${campusName}`);
				});
			}
		});

		const emptySubColumnsCount = campusNames.length;
		const columnsToRemove = newHeaders.length;

		let isFirstMeeting = true;
		meetings.forEach((meet) => {
			newHeaders.push('');
			const meetingData = downloadFormASummary[meet as keyof typeof downloadFormASummary];
			if (isFirstMeeting) {
				for (let i = 0; i < emptySubColumnsCount; i++) {
					newHeaders.push('');
				}
				isFirstMeeting = false; 
			}
			newHeaders.push(`${meet}`);
		});

		newHeaders.splice(0, columnsToRemove);

		const ws = XLSX.utils.aoa_to_sheet([newHeaders, headers, '', ...userRows]);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		let startCol = 3;
		let currentMeeting = '';

		newHeaders.forEach((header, colIndex) => {
			if (colIndex >= 2) {
				if (meetings) {
					if (header !== currentMeeting) {
						// Start a new merge range for the next meeting
						if (colIndex > startCol) {
							const mergeRange = {
								s: { r: 0, c: startCol },
								e: { r: 0, c: colIndex - 1 }
							};
							ws['!merges'] = ws['!merges'] || [];
							ws['!merges'].push(mergeRange);
						}
						startCol = colIndex;
						currentMeeting = header;
					}
				}
			}
		});

		if (newHeaders.length > startCol) {
			const mergeRange = {
				s: { r: 0, c: startCol },
				e: { r: 0, c: newHeaders.length - 1 }
			};
			ws['!merges'] = ws['!merges'] || [];
			ws['!merges'].push(mergeRange);
		}

		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

		const data = new Blob([excelBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
		});

		let a = document.createElement('a');
		a.href = URL.createObjectURL(data);
		a.download = 'forma-summary.xlsx';
		a.textContent = 'DOWNLOAD Sample';
		document.getElementById('download')?.appendChild(a);
		a.click();
		document.getElementById('download')?.removeChild(a);
	}

	function downloadSampleExcel() {
		const subjectSet = new Set(
			formBSampleDownload.map((item) =>
				JSON.stringify({
					id: item.subject_id,
					name: item.subject_name
				})
			)
		);

		const subjectData = Array.from(subjectSet).map((item) => JSON.parse(item));
		const newData: any = {};
		formBSampleDownload.forEach((item) => {
			const key = `${item.point}`;
			if (!newData[key]) {
				newData[key] = {};
			}
			newData[key][`${item.subject_name}-${item.subject_id}`] = item.text;
		});

		const userRows = [];
		for (const key in newData) {
			const row = key.split('-');
			const rowData = [row[0] || ''];
			subjectData.forEach((subject) => {
				rowData.push(newData[key][`${subject.name}-${subject.id}`] || '');
			});
			userRows.push(rowData);
		}

		const subjectNames = [
			...new Set(formBSampleDownload.map((item) => `${item.subject_name}-${item.subject_id}`))
		];
		const headers = ['Points', ...subjectNames];

		const ws = XLSX.utils.aoa_to_sheet([headers, [], ...userRows]);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

		const data = new Blob([excelBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
		});

		let a = document.createElement('a');
		a.href = URL.createObjectURL(data);
		a.download = 'formb-sample.xlsx';
		a.textContent = 'DOWNLOAD Sample';
		document.getElementById('download')?.appendChild(a);
		a.click();
		document.getElementById('download')?.removeChild(a);
	}

	function validateExcel() {
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		if (!fileInput.files) return;
		const file = fileInput.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = handleFileUploadEvent;
		reader.readAsArrayBuffer(file);
	}

	function handleFileUploadEvent(e: ProgressEvent<FileReader>) {
		const data = e.target?.result;
		if (!data) return;
		let json = parseJsonToExcel(data);

		for (let data of json) {
			let point = data['Points']?.trim();

			let keys = formBDataForTable.header
				.filter((val) => val.name !== 'Points')
				.map((v) => `${v.name}-${v.id}`);
			for (let key of keys) {
				if (!data.hasOwnProperty(key) || data[key] === '') {
					data[key] = '';
				}
			}

			const formattedJson = {
				header: formBDataForTable.header,
				points: json
			};
			excelJson = formattedJson;
		}
	}

	$:console.log("newTableData : ",newTableData);
	
</script>

<FormCard class="form">
	<svelte:fragment slot="heading">Form B</svelte:fragment>
	<InputGroup label="Academic Year">
		<Select
			options={getAcadyearForOption()}
			name="acad_year"
			placeholder="Select Acad Year"
			on:change={handleAcadYear}
			bind:value={acadYear}
		/>
	</InputGroup>
	<InputGroup label="Select Program">
		<Select
			name="program_lid"
			placeholder="Select Program"
			options={programSelect}
			on:change={handleProgram}
			bind:value={program}
		/>
	</InputGroup>

	<InputGroup isRequired label="Acad Session">
		<Select
			name="session_lid"
			options={acadSessionSelect}
			on:change={handleSession}
			placeholder="Select Acad Session"
			bind:value={acadSession}
		/>
	</InputGroup>

	<InputGroup isRequired label="Select Subject">
		<Select
			name="subject_lid"
			options={subjectSelect}
			placeholder="Select Subject"
			bind:value={subject}
		/>
	</InputGroup>

	<!-- <InputGroup isRequired label="Upload Excel Wise">
		<Toggle bind:checked={isExcel} disabled={isToggleDisabled} />
	</InputGroup> -->

	<Button
		color="blue"
		class="col-span-full max-w-[200px] mt-3 md:mt-1"
		disabled={!acadYear || !program || !acadSession || !subject}
		on:click={handleGetFormB}
	>
		<Loader class="w-5 h-4 mr-2 animate-spin {isLoading ? 'block' : 'hidden'}" />
		<span>Get Form B</span>
	</Button>
</FormCard>

{#if isExcel && downloadFormASummary}
	<div class="flex flex-col xl:flex-row justify-between mt-3">
		<!-- <div class="flex gap-2">
			<InputGroup label="">
				<Fileupload id="fileInput" inputClass="py-1 w-56" />
			</InputGroup>
			<Button class="mt-6" on:click={validateExcel}>
				<Upload class="w-6 mr-2" />
				Upload
			</Button>
		</div> -->
		<div class="flex gap-x-2">
			<Button class="mt-6" on:click={downloadFormASummaryExcel}>
				<Download class="w-6 mr-2" />
				Form-A Summary
			</Button>
			<!-- <Button class="mt-6" on:click={downloadSampleExcel}>
				<Download class="w-6 mr-2" />
				Sample File
			</Button> -->
		</div>
	</div>
	{#if excelJson}
		<div id="table-content">
			<FormBExcel tableData={excelJson} formBObj={{ acadYear, program, acadSession }} />
		</div>
	{/if}
{:else if !isExcel && formBSampleDownload}
	<div class="mt-4 pl-4 text-lg flex items-center">
		<ArrowRight class="w-6 h-6 mr-2 text-red-500" />
		<span>
			Note: Only the following special characters are allowed "<span
				class="text-rose-600 font-semibold">, . ( ) : ? & %</span
			>"
		</span>
	</div>
	<FormB datas={formBDataForTable} formBObj={{ acadYear, program, acadSession }} readOnly />
{/if}

{#if newTableData}
	<NewFormB newTableData={newTableData} acad_year={acadYear} program_lid={program} session_lid={acadSession}/>
{/if}