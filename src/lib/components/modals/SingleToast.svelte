<script lang="ts">
	import { removeToast } from '$lib/stores/toast-store';
	import type { ToastType } from '$lib/types/stores';
	import { iconMap } from '$lib/utils/constants/icons.constants';
	import { Button, Toast } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';

	export let toast: ToastType;

	function handleErrorReport() {
		console.log('reporting error.....');

		removeToast(toast);
	}
</script>

<Toast transition={fly} params={{ x: 200 }} dismissable={false} {...toast} class="dark:bg-primary-950 z-[999999999]">
	<span class="flex gap-x-4 items-center text-xl md:text-2xl font-semibold {'text-' + toast.color + '-700'} {'dark:text-' + toast.color + '-400'}">
		<svelte:component this={iconMap[toast.color]} class="w-8 h-8" />
		{toast.heading ?? ''}
	</span>
	<div class="mt-3">
		<div class="my-4 md:text-lg font-normal">{toast.message}</div>
		<!-- {#if toast.error && toast.errorId}
			<div class="flex items-center text-red-500 my-2">
				<span class="text-sm font-semibold">Error ID: {toast.errorId}</span>
			</div>
		{/if} -->
		<div class="flex gap-2">
			<Button on:click={() => removeToast(toast)} size="xs" class="w-full">Ok</Button>
			<!-- {#if toast.error}
				<Button on:click={handleErrorReport} size="xs" class="w-full" color="red"
					>Report Error</Button
				>
			{/if} -->
		</div>
	</div>
</Toast>
