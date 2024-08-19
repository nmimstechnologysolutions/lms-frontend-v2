<script lang="ts">
	import { findClosestURL } from '$lib/utils/helper/index.js';
	import { page } from '$app/stores';
	import { Drawer } from 'flowbite-svelte';
	import { ArrowLeft, ArrowRight, Info, Menu, Sparkles } from 'lucide-svelte';
	import { backOut, sineIn } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { componentLookup } from '$lib/utils/helper/icons/icon-helper';
	import type { AccessibleUrl } from '$lib/types';

	let isDrawerHidden = true;
	let transitionParamsTop = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	export let object: AccessibleUrl[];
	export let label: string | undefined;

	let isSidebarClosed = false;
</script>

<div id="second-sidebar" class="w-fit hidden lg:block !sticky !top-24 max-h-screen">
	<button
		id="second-sidebar-card-button"
		class:active={!isSidebarClosed}
		on:click={() => (isSidebarClosed = !isSidebarClosed)}
	>
		{#if isSidebarClosed}
			<ArrowRight />
		{:else}
			<ArrowLeft />
		{/if}
	</button>
	{#if !isSidebarClosed}
		<div
			in:fly={{
				y: -100,
				easing: backOut
			}}
			out:fly={{
				y: -100,
				easing: backOut
			}}
			class="lg:col-span-3 xl:col-span-2 !min-w-[250px] flex-none"
		>
			<div
				id="secondary-sidebar"
				class="w-[100%] shadow-md cursor-pointer base text-sm flex flex-col h-fit"
			>
				<div>
					<h2 class="text-xl font-semibold py-4 px-3">{label ?? ''}</h2>
				</div>
				{#each object as item}
					{@const active = item.url === findClosestURL($page.url.pathname, object)}
					{#if active}
						<a
							href={item.url}
							class="flex items-center gap-x-3 px-5 py-3 border-b-base-100 border-b-2 dark:border-b-[0.2px]
								 text-primary-600 bg-primary-100 dark:bg-primary-dark-800 dark:text-white font-semibold
								   border-r-4 border-primary-600"
						>
							<svelte:component class="text-primary-700 dark:text-primary-50" this={componentLookup[item.icon] ?? Sparkles} />
							<div class="flex-1">
								{item.label}
							</div>
						</a>
					{:else}
						<a
							href={item.url}
							class="flex items-center gap-x-3 animated-border relative overflow-hidden hover:before:border-r-4
							hover:before:border-r-primary-600 px-5 py-3
							border-b-base-100 border-b-2 dark:border-b-[0.2px]
							hover:bg-slate-200/50 dark:hover:bg-base-dark-900"
						>
							<svelte:component this={componentLookup[item.icon] ?? Sparkles} />
							<div>
								{item.label}
							</div>
						</a>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>

<div class="lg:hidden">
	<div class="ml-2">
		<button aria-label="Second Sidebar Menu Button" on:click={() => (isDrawerHidden = false)}>
			<Menu />
		</button>
	</div>

	<Drawer
		placement="left"
		transitionType="fly"
		transitionParams={transitionParamsTop}
		bind:hidden={isDrawerHidden}
	>
		<h5
			id="drawer-label"
			class="text-3xl inline-flex items-center mb-4 font-semibold text-gray-500 dark:text-gray-400"
		>
			<Info class="w-4 h-4 mr-2.5" />MPC
		</h5>
		{#each object as item}
			{@const active = $page.url.pathname === item.url}
			{#if active}
				<a href={item.url}>
					<div
						class="px-8 py-3 border-b-base-100 border-b-2 dark:border-b-[0.2px]
								text-primary-600 bg-primary-100 dark:bg-primary-dark-800 dark:text-white font-semibold
								  border-r-4 border-primary-600"
					>
						{item.label}
					</div>
				</a>
			{:else}
				<a href={item.url}>
					<div
						class="animated-border relative overflow-hidden hover:before:border-r-4
								hover:before:border-r-primary-600 px-8 py-3
								border-b-base-100 border-b-2 dark:border-b-[0.2px]
								hover:bg-slate-200/50 dark:hover:bg-base-dark-900"
					>
						{item.label}
					</div>
				</a>
			{/if}
		{/each}
	</Drawer>
</div>

<style>
	.animated-border::before {
		content: '';
		position: absolute;
		top: 0;
		width: 0;
		height: 100%;
		transition: width 0.6s ease-in-out;
	}

	.animated-border::before {
		left: 0;
	}

	.animated-border::after {
		right: 0;
	}

	.animated-border:hover::before {
		width: 100%;
	}
</style>
