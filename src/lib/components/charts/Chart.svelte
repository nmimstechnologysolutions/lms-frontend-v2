<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import { WidgetPlaceholder } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let options: ApexOptions;

	let ApexCharts: any;
	let loaded = false;

	const chart = (node: HTMLElement, options: ApexOptions) => {
		if (!loaded) return;

		let myChart = new ApexCharts(node, options);
		myChart.render();

		return {
			update(options: ApexOptions) {
				myChart.updateOptions(options);
			},
			destroy() {
				myChart.destroy();
			}
		};
	};

	onMount(async () => {
		const module = await import('apexcharts');
		ApexCharts = module.default;
		window.ApexCharts = ApexCharts;
		loaded = true;
	});
</script>

{#if loaded}
	<div class="dark:!text-slate-200 flex justify-center !min-h-[30vh]" use:chart={options} />
{:else}
	<WidgetPlaceholder />
{/if}
