<script lang="ts">
	import SidebarCard from '$lib/components/cards/SidebarCard.svelte';
	import { trainDriver } from '$lib/utils/helper/trainer';
	import { onMount } from 'svelte';

	onMount(() => {
		const steps = [
			{
				element: '#secondary-sidebar',
				popover: {
					title: 'Sub-Modules',
					description:
						'There are all the sub-modules related to the module at your fingertips in the Secondary Sidebar',
					side: 'left',
					align: 'start'
				}
			},
			{
				element: '#main',
				popover: {
					title: 'Main Page',
					description:
						'Welcome to the Main section. This is where you will find the module related data.',
					side: 'bottom',
					align: 'start'
				}
			},
			{
				popover: {
					title: 'Happy Coding',
					description: 'And that is all, go ahead and start adding tours to your applications.'
				}
			}
		];
		// trainDriver(steps);
	});

	export let data;

	$: urls = data.json.accessible_url.filter(v => v.module !== null && v.module !== 'null')

</script>

<div id="second-main" class="lg:grid py-2 lg:flex-row lg:gap-0 min-h-[83vh]">
	<SidebarCard label="MPC List" object={urls} />
	<div class="transition-all md:ml-5 2xl:ml-14 lg:mr-5 px-3 md:px-0 overflow-x-hidden" id="main">
		<slot />
	</div>
</div>

<style>
	#second-main {
		grid-template-columns: max-content auto;
		gap: 2rem;
	}
</style>