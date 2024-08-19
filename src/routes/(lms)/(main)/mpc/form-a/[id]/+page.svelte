<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import { Button, Fileupload, Input, Toggle } from 'flowbite-svelte';
	import MultiSelect from '$lib/components/form/MultiSelect.svelte';
	import * as XLSX from 'xlsx';
	import FormA from '$lib/components/mpc/FormA.svelte';
	import FormAExcel from '$lib/components/mpc/FormAExcel.svelte';
	import { parseJsonToExcel } from '$lib/utils/helper/excel';
	import { excelSerialToDate } from '$lib/utils/helper/excel/serialDate';
	import { ArrowRight, Download, Upload } from 'lucide-svelte';
	import type { MeetingdataForFormA } from '$lib/types/mpc.js';

	export let data;
	$: console.log(data);
	
	let attendeesValue: any[] = [];
	let absenteesvalue: any[] = [];

	let isExcel = false;
	let isExcelFormLoading = true;
	let excelJson: any;
	
	let meetingData: MeetingdataForFormA;
	$ : meetingData = {
		meetingId: Number(data.meetingId),
		attendeesValue,
		absenteesvalue
	}

	$: masterData = data.masterData;

	$: {
		for(let obj of data.attendeesOptions) {
			if(obj.selected === false) {
				data.attendeesOptions = data.attendeesOptions.filter(val => val.value !== obj.value)
				data.absenteesOptions = [...data.absenteesOptions, {...obj, selected: true}];
			}
		}

		for(let obj of data.absenteesOptions) {
			if(obj.selected === false) {
				data.absenteesOptions = data.absenteesOptions.filter(val => val.value !== obj.value)
				data.attendeesOptions = [...data.attendeesOptions, {...obj, selected: true}];
			}
		}
	}

	function downloadExcel() {
		if(!data.formAtable) return
		
		const formA = data.formAtable
		let userRows: any = [];

		const distinctPointIds = [...new Set(formA.points.map(val => val.id))]
		const distinctPoints = distinctPointIds.map((id) => {
			return {
				id,
				point: formA.points.find(val => val.id == id)?.point,
				subPoint: formA.points.find(val => val.id == id)?.subPoint,
			}
		})

		for (let point of distinctPoints) {
			let singleRow: any = {
				Points: point.point,
				'Sub-Points': point.subPoint
			};

			// Map other headers based on campus_lid
			for (let head of formA.header) {
				if (head.name !== 'Points' && head.name !== 'Sub-Points') {
					const key = `${head.name}-${head.id}`;
					const pointData = formA.points.find((p) => p.campus_lid === head.id && p.id === point.id);
					singleRow[key] = pointData ? pointData.text : '';
				}
			}

			userRows.push(singleRow);
		}

		const ws = XLSX.utils.json_to_sheet(userRows);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

		const blob = new Blob([excelBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
		});

		let a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'edit-formA-sample.xlsx';
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
		const file = e.target?.result;
		if (!file) return;

		let json = parseJsonToExcel(file);

		for (let obj of json) {
			let point = obj['Points']?.trim();
			let subPoint = obj['Sub-Points']?.trim();

			const singleJson = data.formAtable.points.filter(
				(val) => val.point === point && val.subPoint === subPoint
			)[0];
			const type = singleJson?.type;

			// if (!type) {
			// 	return alert('INVALID POINTS/ SUB-POINTS PROVIDED');
			// }

			let keys = data.formAtable.header
				.filter((val) => val.name !== 'Points' && val.name !== 'Sub-Points')
				.map((v) => `${v.name}-${v.id}`);

			for (let key of keys) {
				if (!obj.hasOwnProperty(key) || obj[key] === '') {
					obj[key] = '';
				}
			}

			for (const [key, value] of Object.entries(obj)) {
				console.log({
					key,
					value,
					type
				});

				if (key !== 'Points' && key !== 'Sub-Points') {
					if (type === 'text' && typeof value !== 'string') {
						return alert(`INVALID TYPE PROVIDED TEXT, FOR ${point} - ${subPoint}`);
					}
					//  else if (type === 'number' && isNaN(Number.parseFloat(value))) {
					// 	return alert(`INVALID TYPE PROVIDED NUMBER, FOR ${point} - ${subPoint}`);
					// } 
					else if (type === 'date') {
						const parsedDate = excelSerialToDate(value);
						if (parsedDate === null) {
							return alert(`INVALID TYPE PROVIDED DATE, FOR ${point} - ${subPoint} `);
						}
						obj[key] = parsedDate
					}
					obj['type'] = type
				} 
			}
			obj.id = singleJson.id;
		}

		const formattedJson = {
			header: data.formAtable.header,
			points: json
		};

		excelJson = formattedJson;
		isExcelFormLoading = false;
	}
</script>

<div class="mb-6">
	<FormCard class="form">
		<svelte:fragment slot="heading">Edit Form A</svelte:fragment>
		<InputGroup isRequired label="Acad Year">
			<Input type="text" disabled  value={masterData.acad_year} />
		</InputGroup>
		<InputGroup isRequired label="Programs">
			<Input type="text" disabled  value={masterData.program_name} />
		</InputGroup>
		<InputGroup isRequired label="Subjects">
			<Input type="text" disabled  value={masterData.subject_name} />
		</InputGroup>
		<InputGroup isRequired label="Acad Session">
			<Input type="text" disabled  value={masterData.acad_session} />
		</InputGroup>
		<InputGroup isRequired label="Meeting Date">
			<Input type="text" disabled  value={masterData.meeting_date} />
		</InputGroup>
		<InputGroup label="Attendees">
			<MultiSelect
				bind:value={attendeesValue}
				bind:options={data.attendeesOptions}
				placeholder="Select Attendees"
			/>
		</InputGroup>
		<InputGroup label="Absentees">
			<MultiSelect
				bind:value={absenteesvalue}
				bind:options={data.absenteesOptions}
				placeholder="Select Absentees"
			/>
		</InputGroup>
		<InputGroup label="Upload Excel Wise">
			<Toggle bind:checked={isExcel} />
		</InputGroup>
	</FormCard>
</div>

{#if isExcel}
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
			<Button class="sm:w-36 text-xs" on:click={downloadExcel}>
				<Download class="w-6 mr-2" />
				Sample File
			</Button>
			<div id="download" />
		</div>
	</div>
	<div id="table-content">
		<FormAExcel tableData={excelJson} meetingData={meetingData} />
	</div>
{:else}
	<div class="mt-4 pl-4 text-lg flex items-center">
		<ArrowRight class="w-6 h-6 mr-2 text-red-500" />
		<span>
			Note: Only the following special characters are allowed "<span
				class="text-rose-600 font-semibold">, . ( ) : ? & % # @</span
			>"
		</span>
	</div>
	<FormA datas={data.formAGrouped} meetingData={meetingData} />
{/if}
