<script lang="ts">
	import { page } from '$app/stores';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { Home } from 'lucide-svelte';

	import { slugToBreadcrumbText } from '$lib/utils/helper/index.js';

	type Items = {
		name: string;
		url: string;
	};
	let crumbItems: Items[] = [];
	let items: string[];
	$: {
		if ($page) {
			items = $page.url.pathname.split('/');
		}
	}

	$: {
		if (items.length > 0) {
			if ($page.url.pathname === '/dashboard') {
				crumbItems = []
			} else {
				crumbItems = items.map((item: string, i) => {
					
					let newName = item === '' ? 'Home' : slugToBreadcrumbText(item, $page.url.href);
					return {
						name: newName,
						url: item === '' ? '/dashboard' : items.slice(0, i + 1).join('/')
					};
				});
			}
		}
	}
</script>

<Breadcrumb
	aria-label="Solid background breadcrumb"
	class="{crumbItems.length > 0 ? '!py-1' : ''} !bg-inherit"
	solid
	solidClass="pl-1 sm:!pl-5 md:!pl-2 !py-1 !text-sm"
>
	{#each crumbItems as item, i}
		{#if i === 0}
			<BreadcrumbItem href={item.url}>
				<svelte:fragment slot="icon">
					<Home class="w-4 h-4 dark:text-white mb-1.5" />
				</svelte:fragment>
				<span class="item">
					{item.name}
				</span>
			</BreadcrumbItem>
		{:else if item.url === $page.url.pathname}
			<BreadcrumbItem spanClass="dark:text-primary-200 text-primary-600 font-semibold">
				{item.name}
			</BreadcrumbItem>
		{:else}
			<BreadcrumbItem href={item.url}>
				{item.name}
			</BreadcrumbItem>
		{/if}
	{/each}
</Breadcrumb>

<style>
	:global(ol li a::after) {
		content: '';
		display: block;
		width: 0;
		height: 2px;
		background: rgb(90 117 215 / 1);
		transition: width 0.3s;
	}

	:global(ol li a:hover::after),
	:global(ol li a:focus-within::after) {
		width: 100%;
	}
</style>
