<script lang="ts">
	import type { SelectFieldOption } from '$lib/types/form';
	import { Label, Helper } from 'flowbite-svelte';
	import Select from 'svelte-select';
	import { createEventDispatcher } from 'svelte';

	export let options: SelectFieldOption[] = [];
	export let errorMessage = '';
	export let label = '';
	export let placeholder = 'Choose option';
	$: _value = { label: placeholder, value: '-1' };
	export let value: string | number | undefined;

	$: {
		value = _value?.value;
	}
	$: id = Math.random().toString(36).substring(7);

	const dispatch = createEventDispatcher();
	function handleChange(event: CustomEvent<{ value: SelectFieldOption }>) {
		dispatch('change', event.detail.value.value);
		const input = document.getElementById(id);

		if (input) {
			input.blur();
		}
	}
</script>

<Label>
	<p class:mt-5={!label}>{label}</p>
	<Select
		{placeholder}
		items={options}
		{...$$restProps}
		bind:value={_value}
		on:change={handleChange}
		{id}
	/>
	{#if errorMessage}
		<Helper class="mt-2 text-base" color="red">
			<span class="font-bold">Error! </span>
			{errorMessage}
		</Helper>
	{/if}
</Label>
