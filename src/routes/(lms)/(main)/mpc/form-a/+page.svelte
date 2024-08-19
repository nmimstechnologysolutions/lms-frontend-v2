<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import Select from '$lib/components/form/Select.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import MultiSelect from '$lib/components/form/MultiSelect.svelte';
	import * as XLSX from 'xlsx';
	import { getOptions } from '$lib/utils/helper/forms/options.helper';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import type { Options, SelectFieldOption } from '$lib/types/form';
	import { Button, Fileupload, Input, Toggle } from 'flowbite-svelte';
	import { getAcadyearForOption } from '$lib/utils/helper/index.js';
	import { parseJsonToExcel } from '$lib/utils/helper/excel';
	import type { FormATable, FormATableGrouped, countCourse } from '$lib/types';
	import FormAExcel from '$lib/components/mpc/FormAExcel.svelte';
	import { excelSerialToDate } from '$lib/utils/helper/excel/serialDate';
	import FormA from '$lib/components/mpc/FormA.svelte';
	import { ArrowRight, Download, Upload } from 'lucide-svelte';
	import type { FormADetailResponse, FormAType, MeetingdataForFormA } from '$lib/types/mpc';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { Badge } from 'flowbite-svelte';

	let isExcel = true;
	let meetingId = 0;
	let excelJson: FormATable | null = null;
	let isToggleDisabled = true;
	let meetingsSelect: SelectFieldOption[] = [];
	let attendeesArray: any[] = [];
	let absenteesArray: any[] = [];
	let absenteesvalue: any[] = [];
	let programSelect: SelectFieldOption[] = [];
	let subjectSelect: SelectFieldOption[] = [];
	let acadSessionSelect: SelectFieldOption[] = [];
	let attendeesSelect: Options[] = [];
	let attendeesValue: (string | number)[] = [];
	let excelDataForCampusAndPoints: FormAType | null = null;
	let excelDataForTable: FormATableGrouped | null = null;
	let meetingData: MeetingdataForFormA;
	let acadYear: string, program: string, subject: string, acadSession: string;
	let countCourseAnchor: countCourse[] = [];
	let courseAnchorOptions : Options[] = [];
	let meetingCount: number = 0;
	let meetingDates:string;

	$: meetingData = {
		meetingId,
		attendeesValue,
		absenteesvalue
	};

	async function handleAcadYear(e: Event) {
		programSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/program-by-username-and-year?acadYear=${acadYear}`
		);
	}

	async function handleProgram(e: Event) {
		acadSessionSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/acad-session-by-program?acadYear=${acadYear}&programLid=${program}`
		);
	}

	async function handleSubject(e: Event) {
		meetingsSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/get-formA-meeting-date?acadYear=${acadYear}&programLid=${program}&subjectLid=${subject}&acadSessionLid=${acadSession}`
		);	
		
	}
	

	async function handleAcadSession(e: Event) {
		subjectSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/subject-by-program?programLid=${program}&acadYear=${acadYear}&acadSessionLid=${acadSession}`
		);
	}

	async function handleMeetingDate(e: Event) {
		const [attendees, { json, error },{ json : countJson, error: countError }] = await Promise.all([
			getOptions(`${PUBLIC_FETCH_BASE_URL}/mpc/api/get-attendees-by-meetingId?meetingId=${meetingId}`),
			fetchApi<FormADetailResponse>(
				`${PUBLIC_FETCH_BASE_URL}/mpc/api/get-formA?meetingId=${meetingId}`,
				'GET',
				null
			),
			fetchApi<countCourse[]>(
				`${PUBLIC_FETCH_BASE_URL}/mpc/api/get-count-and-ac?meetingId=${meetingId}`,
				'GET',
				null
			)
		]);


		if(countJson){
			countCourseAnchor = countJson;
			courseAnchorOptions = countJson[0].ca_array;
			meetingCount = countJson[0].count;
			meetingDates = countJson[0].date_array;
		}
		
		console.log("countCourseAnchor : ",countCourseAnchor);
		attendeesSelect = attendees;

		if (json) {
			isToggleDisabled = false;
			console.log({
				json
			});
			excelDataForCampusAndPoints = json.json;
			excelDataForTable = json.groupedJson;
			return;
		}
	}

	//handle Attendees--->>>
	$: {
		for (let opt of attendeesSelect) {
			if (!attendeesValue.includes(opt.value) && opt.selected === false) {
				absenteesArray = [...absenteesArray, { ...opt, selected: true }];
				attendeesArray = attendeesArray.filter((att) => att.value !== opt.value);
			}
		}
	}

	//handle Absentees--->>>
	$: {
		for (let data of absenteesArray) {
			if (!absenteesvalue.includes(data.value) && data.selected === false) {
				attendeesArray = [...attendeesArray, { ...data, selected: true }];
				absenteesArray = absenteesArray.filter((abs) => abs.value !== data.value);
			}
		}
	}

	function downloadExcel() {
		if (!excelDataForCampusAndPoints) return;

		const formA = excelDataForCampusAndPoints;
		const numRows = excelDataForCampusAndPoints.points.length;
		const userRows = [];
		type UserRow = {
			[key: string]: string;
		};
		// Generate dynamic user rows
		for (let i = 0; i < numRows; i++) {
			const userRow: UserRow = {};
			excelDataForCampusAndPoints.header.forEach((column) => {
				if (column.name === 'Points') {
					userRow[`${column.name}`] = formA.points[i].point;
				} else if (column.name === 'Sub-Points') {
					userRow[`${column.name}`] = formA.points[i].subPoint;
				} else {
					userRow[`${column.name}-${column.id}`] = ``;
				}
			});
			userRows.push(userRow);
		}

		console.log({
			userRows
		});

		const ws = XLSX.utils.json_to_sheet(userRows);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

		const data = new Blob([excelBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
		});

		let a = document.createElement('a');
		a.href = URL.createObjectURL(data);
		a.download = 'forma-sample.xlsx';
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

		if (!excelDataForCampusAndPoints) return;
		const formA = excelDataForCampusAndPoints;

		let json = parseJsonToExcel(data);
		for (let data of json) {
			let point = data['Points']?.trim();
			let subPoint = data['Sub-Points']?.trim();

			const singleJson = formA.points.filter(
				(val) => val.point === point && val.subPoint === subPoint
			)[0];
			const type = singleJson?.type;

			// if (!type) {
			// 	return alert('INVALID POINTS/ SUB-POINTS PROVIDED');
			// }

			let keys = formA.header
				.filter((val) => val.name !== 'Points' && val.name !== 'Sub-Points')
				.map((v) => v.name + '-' + v.id);

			for (let key of keys) {
				if (!data.hasOwnProperty(key) || data[key] === '') {
					data[key] = '';
				}
			}

			for (const [key, value] of Object.entries(data)) {
				console.log({
					key,
					value,
					type
				});

				console.log(typeof value);

				if (key !== 'Points' && key !== 'Sub-Points') {
					if (type === 'text' && typeof value !== 'string' && typeof value !== 'number') {
						return alert(`INVALID TYPE PROVIDED TEXT, FOR ${point} - ${subPoint}`);
					} 
					// else if (type == 'number' && isNaN(Number.parseFloat(value))) {
					// 	return alert(`INVALID TYPE PROVIDED NUMBER, FOR ${point} - ${subPoint}`);
					// } 
					else if (type === 'date') {
						const parsedDate = excelSerialToDate(value);
						if (parsedDate === null) {
							return alert(`INVALID TYPE PROVIDED DATE, FOR ${point} - ${subPoint} `);
						}
						data[key] = parsedDate;
						data['type'] = type;
					}
				}
			}
			data.id = singleJson.id;
		}

		const formattedJson = {
			header: formA.header,
			points: json
		};

		excelJson = formattedJson;
	}

</script>

<div class="mb-2">
	<FormCard class="form">
		<svelte:fragment slot="heading">MPC Form A</svelte:fragment>
		<InputGroup isRequired label="Acad Year">
			<Select
				name="acadYear"
				options={getAcadyearForOption()}
				on:change={handleAcadYear}
				placeholder="Select Acad Year"
				on:change={handleAcadYear}
				bind:value={acadYear}
			/>
		</InputGroup>
		<InputGroup isRequired label="Programs">
			<Select
				name="program_name"
				options={programSelect}
				placeholder="Select Program"
				on:change={handleProgram}
				bind:value={program}
			/>
		</InputGroup>
		<InputGroup isRequired label="Acad Session">
			<Select
				name="acad_session"
				options={acadSessionSelect}
				placeholder="Select Acad Session"
				on:change={handleAcadSession}
				bind:value={acadSession}
			/>
		</InputGroup>
		<InputGroup isRequired label="Subjects">
			<Select
				name="subject_name"
				options={subjectSelect}
				placeholder="Select Subject"
				on:change={handleSubject}
				bind:value={subject}
			/>
		</InputGroup>
		<InputGroup isRequired label="Meeting Date">
			<Select
				options={meetingsSelect}
				name="meeting_date"
				placeholder="Select meeting Date"
				on:change={handleMeetingDate}
				bind:value={meetingId}
			/>
		</InputGroup>
		<InputGroup label="Course Anchor">
			<MultiSelect
				readonly
				options={courseAnchorOptions}
				placeholder="Course Anchor"
			/>
		</InputGroup>
		<InputGroup isRequired label="Attendees">
			<MultiSelect
				bind:value={attendeesValue}
				bind:options={attendeesSelect}
				placeholder="Select Attendees"
			/>
		</InputGroup>
		<InputGroup label="Absentees">
			<MultiSelect
				bind:value={absenteesvalue}
				bind:options={absenteesArray}
				placeholder="Select Absentees"
			/>
		</InputGroup>
		<InputGroup isRequired label="Upload Excel Wise">
			<Toggle bind:checked={isExcel} disabled={isToggleDisabled} />
		</InputGroup>
		{#if meetingCount}
			<Badge class="mb-3 h-auto min-h-8 font-extrabold" color="yellow">Meeting Count {meetingCount} <br> Meeting Dates : {meetingDates}</Badge>
		{/if}
	</FormCard>


</div>

{#if isExcel && excelDataForCampusAndPoints}
	<div class="flex flex-col sm:flex-row gap-y-3 sm:justify-between sm:items-end">
		<div class="flex gap-4">
			<InputGroup label="">
				<Fileupload id="fileInput" inputClass="py-1" />
			</InputGroup>
			<Button class="sm:w-36 mt-6" on:click={validateExcel}>
				<Upload class="w-6 mr-2" />
				Upload
			</Button>
		</div>
		<div>
			<Button class="sm:w-36" on:click={downloadExcel}>
				<Download class="w-6 mr-2" />
				Sample File
			</Button>
			<div id="download" />
		</div>
	</div>
	{#if excelJson}
		<div id="table-content">
			<FormAExcel tableData={excelJson} {meetingData} />
		</div>
	{/if}
{:else if !isExcel && excelDataForTable}
	<div class="mt-4 pl-4 text-lg flex items-center">
		<ArrowRight class="w-6 h-6 mr-2 text-red-500" />
		<span>
			Note: Only the following special characters are allowed "<span
				class="text-rose-600 font-semibold">, . ( ) : ? & % # @</span
			>"
		</span>
	</div>
	<FormA datas={excelDataForTable} {meetingData} />
{/if}
