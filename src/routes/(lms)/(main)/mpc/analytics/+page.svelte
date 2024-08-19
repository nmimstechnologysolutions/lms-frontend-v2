<script lang="ts">
	import Chart from '$lib/components/charts/Chart.svelte';
	import AnalyticsModal from '$lib/components/mpc/AnalyticsModal.svelte';
	import type { ApexOptions } from 'apexcharts';

	export let data;
	console.log('data in modal::::::::::::', data);
	$: organizationAbbr = data.organizationJson[0]?.organization_abbr ?? '';

	let showChart = true;
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
				data: data ? data.organizationJson.map((i) => i.meeting_count) : [],
				name: 'Meetings Count'
			}
		],
		chart: {
			height: 350,
			type: 'bar',
			events: {
				click: function (event, chartContext, config) {
					organizationAbbr = config.config.xaxis.categories[config.dataPointIndex];
				}
			}
		},
		colors: colors,
		plotOptions: {
			bar: {
				columnWidth: '25%',
				distributed: true
			}
		},
		dataLabels: {
			enabled: true
		},
		legend: {
			show: false
		},
		xaxis: {
			categories: data ? data.organizationJson.map((i) => i.organization_abbr) : [],
			labels: {
				style: {
					colors: colors,
					fontSize: '12px'
				}
			}
		}
	};
</script>

<div class="pb-20">
	{#if showChart && data.organizationJson.length > 0}
		<h2 class="text-lg font-bold pb-2">Kindly Click on the School for Analytics</h2>
		<div class="grid grid-cols-1 items-center gap-x-10 card mb-10">
			<div class="w-[100%] lg:w-[100%]">
				<Chart bind:options />
			</div>
		</div>
	{:else}
		<h2 class="text-4xl text-center font-semibold pt-10">No Data Present</h2>
	{/if}

	{#if organizationAbbr !== ''}
		<h3 class="text-lg font-semibold pb-2 text-blue-500">Analytics for {organizationAbbr ? organizationAbbr : 'SELECT SCHOOL'}</h3>
		<AnalyticsModal bind:organizationAbbr />
	{/if}
</div>
