<script lang="ts">
	import CustomToast from '$lib/components/modals/CustomToast.svelte';
	import '../app.css';
	import { navigating } from '$app/stores'
	import Confirm from '$lib/components/modals/Confirm.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		localStorage.setItem('color-theme', 'light');
	})
</script>

{#if $navigating}
	<div class="fixed inset-0 flex items-center justify-center w-screen h-screen z-[99999999]">
		<div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
			
					<svg fill='none' class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
						<path clip-rule='evenodd'
							d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
							fill='currentColor' fill-rule='evenodd' />
					</svg>

			
			<div>Loading ...</div>
		</div>
	</div>
{/if}
<slot />
<CustomToast />
<Confirm />
