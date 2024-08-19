<script>
	import BreadCrumbs from '$lib/components/base/BreadCrumbs.svelte';
	import Sidebar from '$lib/components/partials/Sidebar.svelte';
	import BottomNavigation from '$lib/components/partials/BottomNavigation.svelte';
	import Header from '$lib/components/partials/Header.svelte';
	import { isSidebarOpen } from '$lib/stores/index.store';

	export let data;

	$: urls = data.json.accessible_url.filter(v => v.module === null || v.module === 'null')
</script>

<Sidebar dashboardObj={urls} />
<main class="{$isSidebarOpen ? "md:ml-64" : "md:ml-[60px]"} transition-all ml-0 pb-20 md:pb-0 min-h-screen">
	<Header />
	<div class="md:px-4 py-5 px-2">
		<BreadCrumbs />
		<div class="main-content">
			<slot />
		</div>
	</div>
</main>
<BottomNavigation  object={urls}/>
