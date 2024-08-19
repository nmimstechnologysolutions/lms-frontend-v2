<script lang="ts">
	import { page } from '$app/stores';
	import { Sparkles } from 'lucide-svelte';
	import SidebarList from './SidebarList.svelte';
	import { findClosestURL } from '$lib/utils/helper/index.js';
	import { componentLookup } from '$lib/utils/helper/icons/icon-helper';
	import { isSidebarOpen } from '$lib/stores/index.store';
	import type { AccessibleUrl } from '$lib/types';
	
	export let dashboardObj: AccessibleUrl[];

</script>

<aside
	class="transition-all hidden overflow-hidden md:block fixed left-0 top-0 bottom-0 {$isSidebarOpen ? 'w-64' : 'w-[60px]'} bg-primary-800 text-white dark:bg-primary-dark-950 rounded-r-3xl"
>
	<div
		class="sidebar-cover bg-primary-600 dark:bg-primary-dark-900 rounded-tr-3xl rounded-br-3xl h-full fixed left-0 top-0 bottom-0 w-[60px]"
	/>
	<div>
		<!-- <div class="pl-[60px] h-28 flex items-center justify-center">
			<a class:hidden={!$isSidebarOpen} href="/dashboard" class="w-full h-full">
				<img
					class="w-full h-full mix-blend-color-dodge"
					src="/images/nmims-logo.jpg"
					alt="Nmims Logo"
				/>
			</a>
		</div> -->
		<ul id="sidebar" class="list overflow-y-auto relative pb-5 pt-20">
			{#each dashboardObj as item}
				<li>
					<SidebarList
						active={item.url === findClosestURL($page.url.pathname, dashboardObj)}
						label={item.label}
						href={item.url}
					>
						<svelte:fragment slot="icon">
							<svelte:component this={componentLookup[item.icon] ?? Sparkles} />
						</svelte:fragment>
					</SidebarList>
				</li>
			{/each}
		</ul>
	</div>
</aside>

<style>
	/* width */
	::-webkit-scrollbar {
		display: none;
	}
</style>
