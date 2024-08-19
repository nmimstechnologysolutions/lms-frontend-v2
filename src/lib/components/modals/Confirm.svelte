<script lang="ts" context="module">
	import { Button, Modal } from 'flowbite-svelte';
	import { ShieldHalf } from 'lucide-svelte';
	import { writable } from 'svelte/store';

	let resolveFunc: (value: boolean) => void;

	export const confirmStore = writable({
		isVisible: false,
		confirmText: 'Are you sure?'
	});

	export function showConfirmation(confirmText = 'Are you sure?'): Promise<boolean> {
		confirmStore.set({
			isVisible: true,
			confirmText
		});

		return new Promise<boolean>((resolve) => {
			resolveFunc = resolve;
		});
	}

	function handleYesClick() {
		confirmStore.set({
			isVisible: false,
			confirmText: 'Are you sure?'
		});
		resolveFunc(true);
	}

	function handleNoClick() {
		confirmStore.set({
			isVisible: false,
			confirmText: 'Are you sure?'
		});
		resolveFunc(false);
	}
</script>

{#if $confirmStore.isVisible}
	<Modal bind:open={$confirmStore.isVisible} size="xs" autoclose={false} on:close={handleNoClick} class="border-[0.5px] border-black">
		<div class="text-center">
			<ShieldHalf class="mx-auto mb-4 text-red-400 w-12 h-12 dark:text-red-200" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				{@html $confirmStore.confirmText ?? 'Are you Sure?'}
			</h3>
			<Button color="red" class="mr-2" on:click={handleYesClick}>Yes, I'm sure</Button>
			<Button color="alternative" on:click={handleNoClick}>No, cancel</Button>
		</div>
	</Modal>
{/if}
