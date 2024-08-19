<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';
	import Avatar from '$lib/components/base/Avatar.svelte';
	import { isSidebarOpen } from '$lib/stores/index.store';
	import { PanelRightClose, PanelRightOpen } from 'lucide-svelte';

</script>

<header
	class="z-10 border-b-2 border-base-200 sticky top-0 h-20 dark:border-b-[0.1px] bg-base-100 dark:bg-base-dark-900 shadow-md"
>
	<div class="py-2 flex justify-between items-center pl-4 pr-1 md:pr-4 h-full">
		<div class="flex gap-x-5">
			<button
				class="hidden md:block ml-2"
				on:click={() => isSidebarOpen.set(!$isSidebarOpen)}
				title="{$isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}"
				>
				{#if $isSidebarOpen}
					 <span>
						<PanelRightOpen />
					 </span>
				{:else}
				<span>
					<PanelRightClose />
				</span>
				{/if}
			</button>
			<a href="/dashboard" class="w-32 h-12">
				<img
					class="w-full h-full dark:mix-blend-screen"
					src="/images/logo-nmims.png"
					alt="Nmims Logo"
				/>
			</a>
		</div>
		<div class="flex gap-2 md:gap-3">
			<!-- <DarkMode btnClass="w-6" /> -->
			<Avatar />
		</div>
	</div>
</header>
