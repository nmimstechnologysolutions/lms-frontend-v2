<script lang="ts">
	import { page } from '$app/stores';
	import type { AccessibleUrl } from '$lib/types';
	import { componentLookup } from '$lib/utils/helper/icons/icon-helper';
	import { findClosestURL } from '$lib/utils/helper/index.js';

	export let object: AccessibleUrl[] = [];

	$: mainComponents = object.slice(0, 5);
</script>

<nav
	class="z-[999] bottom-navigation md:hidden flex justify-center items-center base rounded-t-xl fixed bottom-0 left-0 right-0"
>
	<ul class="relative flex">
		{#each mainComponents as item}
			<li
				class="relative list-none w-16 h-16 z-10"
				class:active={item.url === findClosestURL($page.url.pathname, mainComponents)}
			>
				<a
					href={item.url}
					class="cursor-pointer px-5 relative flex justify-center items-center flex-col w-full text-center font-medium"
				>
					<span
						class="icon relative block py-[20px] text-center transition duration-500 text-base-600 dark:text-base-200"
						class:!text-base-200={item.url === findClosestURL($page.url.pathname, mainComponents)}
					>
						<svelte:component this={componentLookup[item.icon]} />
					</span>
					<span
						class="text translate-y-5 absolute text-base-600 font-normal text-sm transition duration-500 opacity-0"
						class:dark:!text-base-200={item.url ===
							findClosestURL($page.url.pathname, mainComponents)}
					>
						{item.label}
					</span>
				</a>
			</li>
		{/each}
		<div
			class="absolute w-16 -top-1/2 h-16 outline outline-primary-600 dark:outline-base-dark-800 outline-2 rounded-full border-[6px] border-base-100 dark:border-base-dark-900 bg-primary-700 transition duration-500"
		/>
	</ul>
</nav>

<style>
	li.active .icon {
		transform: translateY(-32px);
	}

	li.active .text {
		opacity: 1;
		transform: translateY(10px);
	}

	div::before {
		content: '';
		position: absolute;
		top: 50%;
		left: -22px;
		width: 20px;
		height: 20px;
		border-top-right-radius: 20px;
		box-shadow: 0px -10px 0 0 inherit;
	}

	div::after {
		content: '';
		position: absolute;
		top: 50%;
		right: -22px;
		width: 20px;
		height: 20px;
		border-top-left-radius: 20px;
		box-shadow: 0px -10px 0 0 inherit;
	}

	li:nth-child(1).active ~ div {
		transform: translateX(calc(64px * 0));
	}
	li:nth-child(2).active ~ div {
		transform: translateX(calc(64px * 1));
	}
	li:nth-child(3).active ~ div {
		transform: translateX(calc(64px * 2));
	}
	li:nth-child(4).active ~ div {
		transform: translateX(calc(64px * 3));
	}
	li:nth-child(5).active ~ div {
		transform: translateX(calc(64px * 4));
	}
</style>
