<script lang="ts">
	import { Accordion, AccordionItem, TabItem, Tabs, Badge } from 'flowbite-svelte';
	import InputGroup from '../form/InputGroup.svelte';
	import Select from '../form/Select.svelte';
	import { getAcadyearForOption } from '$lib/utils/helper';
	import type { SelectFieldOption } from '$lib/types/form';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import { getOptions } from '$lib/utils/helper/forms/options.helper';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import type {
		FormADetailResponse,
		FormBData,
		GetFormBResponse,
		GroupedFormBData,
		absenteesChart,
		formBDetails
	} from '$lib/types/mpc';
	import type { FormATableGrouped, FormBType } from '$lib/types';
	import FormB from './FormB.svelte';
	import FormA from './FormA.svelte';
	import Chart from '../charts/Chart.svelte';
	import type { ApexOptions } from 'apexcharts';
	import AnalyticsPie from './AnalyticsPie.svelte';
	import NewFormB from './newFormB.svelte';

	export let organizationAbbr: string;

	let programSelect: SelectFieldOption[] = [];
	let subjectSelect: SelectFieldOption[] = [];
	let meetingSelect: SelectFieldOption[] = [];
	let formBdata: FormBType | undefined;
	let formAtable: FormATableGrouped | undefined;
	let absenteesData: absenteesChart[] | undefined;
	let icaChartData: number | undefined;
	let acadYear: string, program: number, course: number, meeting: string;

	type ResponseType = {
		formDetails: formBDetails;
		formBData: FormBData[];
		groupedData: GroupedFormBData;
		icaChartData: number;
	};

	async function handleAcadYear() {
        formBdata = undefined
        icaChartData = undefined
        absenteesData = undefined
        formAtable = undefined
        program = 0
        course = 0
        meeting = ''
		programSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/program-by-username-and-year-and-organization?acadYear=${acadYear}&organizationAbbr=${organizationAbbr}`
		);
	}

	let newTableData:any;
	let meetingCount:number;
	let programName:any;
	async function handleProgram() {
		console.log("programSelect :",programSelect);
		const item = programSelect.find(item => item.value === program);
		programName =  item ? item.label : null;
		
        absenteesData = undefined
        formAtable = undefined
        course = 0
        meeting = ''
		subjectSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/subject-by-program-analytic?programLid=${program}&acadYear=${acadYear}`
		);

		const viewUrl = `${PUBLIC_FETCH_BASE_URL}/mpc/api/get-program-formB-for-analytics?acadYear=${acadYear}&programLid=${program}`;
		const { json, error } = await fetchApi<ResponseType>(viewUrl, 'GET', null);

		let meetCout:any = await fetchApi(`${PUBLIC_FETCH_BASE_URL}/mpc/api/get-count-by-program?acadYear=${acadYear}&program=${program}`,'GET',null);
		if (error || !json) {
			console.log({error});
			return;
		}
		meetingCount = meetCout.json.Meetcount[0].count;
		

		// const uniqueHeaders = [...new Set(json.formBData.map((val) => val.subject_id))];
		// const header = uniqueHeaders.map((id) => {
		// 	return {
		// 		id: id,
		// 		name: json.formBData.filter((val) => val.subject_id === id)?.[0].subject_name
		// 	};
		// });

		// header.unshift({
		// 	id: 0,
		// 	name: 'Points'
		// });

		// formBdata = {
		// 	header,
		// 	data: json.groupedData
		// };

		icaChartData = json.icaChartData;
	}

	let x: any = [];
	let y: any = [];

	async function handleSubject() {
        formAtable = undefined
        meeting = ''
		meetingSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/meetings-by-subject?subjectLid=${course}&acadYear=${acadYear}&programLid=${program}`
		);

		const { json, error } = await fetchApi<absenteesChart[]>(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/get-absentees-count?subjectLid=${course}&acadYear=${acadYear}&programLid=${program}`,
			'GET'
		);

		let newdata = await fetchApi<GetFormBResponse>(`${PUBLIC_FETCH_BASE_URL}/mpc/api/get-form-b-analytics-new?acadYear=${acadYear}&program=${program}&subjectLid=${course}`,'GET',null);

		if (error) {
			console.log('ERROR::::::::');
			return;
		}

		absenteesData = json;
		newTableData = newdata.json
		

		for (let countarray of absenteesData) {
			x.push(countarray.username);
			y.push(countarray.absentees_count);
		}
	}

	$: console.log("New data : ", newTableData);

	async function handleMeetingChange() {
		const editUrl = `${PUBLIC_FETCH_BASE_URL}/mpc/api/get-formA-detail?meetingId=${meeting}`;
		const { json, error } = await fetchApi<FormADetailResponse>(editUrl, 'GET');

		if (error) {
			console.log('ERROR::::::::');
			return;
		}

		formAtable = {
			points: json.groupedJson.points,
			header: json.groupedJson.header
		};
	}

	let colors = [
		'#008FFB',
		'#00E396',
		'#FEB019',
		'#FF4560',
		'#775DD0',
		'#546E7A',
		'#26a69a',
		'#D10CE8'
	];
	let options: ApexOptions = {
		series: [
			{
				data: y,
				name: 'Absentees Count'
			}
		],
		chart: {
			height: 350,
			type: 'bar'
		},
		colors: colors,
		plotOptions: {
			bar: {
				columnWidth: '25%',
				distributed: true
			}
		},
		dataLabels: {
			enabled: false
		},
		legend: {
			show: false
		},
		xaxis: {
			categories: x,
			labels: {
				style: {
					colors: colors,
					fontSize: '12px'
				}
			}
		}
	};
</script>

<div>
	<div class="form !grid-cols-4 mb-5 gap-4">
		<InputGroup label="Academic Year" class="col-span-2 xl:col-span-1">
			<Select
				placeholder="Select Acad Year"
				bind:value={acadYear}
				on:change={handleAcadYear}
				options={getAcadyearForOption()}
			/>
		</InputGroup>
		<InputGroup label="Program" class="col-span-2 xl:col-span-1">
			<Select id="programSelect"
				placeholder="Select Program"
				bind:value={program}
				options={programSelect}
				on:change={handleProgram}
			/>
		</InputGroup>
		<InputGroup label="Course" class="col-span-2 xl:col-span-1">
			<Select
				placeholder="Select Course"
				bind:value={course}
				options={subjectSelect}
				on:change={handleSubject}
			/>
		</InputGroup>
		<InputGroup label="Meeting" class="col-span-2 xl:col-span-1">
			<Select
				placeholder="Select Meeting"
				bind:value={meeting}
				options={meetingSelect}
				on:change={handleMeetingChange}
			/>
		</InputGroup>
	</div>
	{#if meetingCount}
		<Badge class="mb-3 h-auto min-h-8 font-extrabold" color="yellow">Meeting Count For The Program Name {programName} is : {meetingCount}</Badge>
	{/if}
	{#if formBdata || formAtable || meetingSelect.length > 0 || icaChartData}
		<Tabs class="overflow-auto">
			{#if newTableData}
				<TabItem open>
					<span slot="title">Program Level Data</span>
					<!-- <FormB datas={formBdata} readOnly isRemarksDisabled isProgramExcelDownload /> -->
					<NewFormB newTableData={newTableData} acad_year={acadYear} program_lid={program} readOnly={true}/>
				</TabItem>
			{/if}
			{#if icaChartData}
				<TabItem>
					<span slot="title">ICA Percentage</span>
					<AnalyticsPie {icaChartData} />
				</TabItem>
			{/if}
			{#if meetingSelect.length > 0}
				<TabItem>
					<span slot="title">Absent Faculty Report</span>
					<Chart bind:options />
				</TabItem>
			{/if}

			{#if formAtable}
				<TabItem>
					<span slot="title">Course Level Data</span>
					<FormA datas={formAtable} readOnly isCourseExcelDownload />
				</TabItem>
			{/if}
		</Tabs>
	{/if}
</div>
