<script lang="ts">
	import { Helper } from 'flowbite-svelte';
	export let errorMessage: string | null = null;
	export let isRequired: boolean = false;
	export let label: string | null = null;
</script>

<div class={{ ...$$props }.class ?? '' + ' form-group'}>
	<p />
	<label class:!mt-5={!label}>
		<p class:!mt-5={label == '' || label == null} class="!mb-2">
			{label ?? ''}
			{#if isRequired}
				<span title="Mandatory" class="text-rose-600">*</span>
			{/if}
		</p>
		<slot />
		{#if errorMessage}
			<Helper class="mt-2 text-base" color="red">
				<span class="font-bold">Error! </span>
				{errorMessage}
			</Helper>
		{/if}
	</label>
</div>

<style>
	:global(p) {
		margin: 0 !important;
	}
</style>
