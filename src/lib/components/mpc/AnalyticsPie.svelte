<script lang="ts">
	import type { ApexOptions } from "apexcharts";
    import Chart from "../charts/Chart.svelte";
	import { onMount } from "svelte";

    export let icaChartData : number;
    
    let options: ApexOptions;

    onMount(() => {
        options  = {
            series: [icaChartData, (100 - icaChartData)],
            chart: {
                width: 480,
                type: 'pie',
            },
            labels: ['% Ica Completed', '% ICA Pending'],
            responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 400,
                },
                legend: {
                  position: 'bottom'
                }
            }
            }]
        };
    })
</script>

{#if options}
    <Chart options={options} />
{/if}
