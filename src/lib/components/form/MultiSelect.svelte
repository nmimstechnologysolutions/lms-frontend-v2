<script lang="ts">
	import { fly } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import type { Options } from '$lib/types/form';

	type Selected = {
		[key: string]: Options;
	};

	export let id = '';
	export let value: (string | number)[] = [];
	export let readonly = false;
	export let placeholder = '';
	export let options: Options[] = [];

	let input: HTMLElement,
		inputValue: string | number,
		activeOption: any,
		showOptions = false,
		selected: Selected = {};

	$: {
		selected = options.reduce((obj, op) => (op.selected ? { ...obj, [op.value]: op } : obj), {});
		value = Object.values(selected)
			.filter((s) => s.selected)
			.map((s) => s.value);
	}

	$: filtered = options.filter((o) =>
		inputValue ? o.label.toLowerCase().includes((inputValue as string).toLowerCase()) : o
	);

	$: if ((activeOption && !filtered.includes(activeOption)) || (!activeOption && inputValue))
		activeOption = filtered[0];

	function add(token: Options) {
		if (!readonly)
			options = options.map((o) => (o.value == token.value ? { ...o, selected: true } : o));
	}

	function remove(value: string | number) {
		if (!readonly) {
			const { [value]: val, ...rest } = selected;
			selected = rest;
			options = options.map((o) => (o.value == value ? { ...o, selected: false } : o));
		}
	}

	function optionsVisibility(show: boolean) {
		if (readonly) return;
		if (typeof show === 'boolean') {
			showOptions = show;
			show && input.focus();
		} else {
			showOptions = !showOptions;
		}
		if (!showOptions) {
			activeOption = undefined;
		}
	}

	function handleKeyup(e: KeyboardEvent) {
		if (e.keyCode === 13) {
			Object.keys(selected).includes(activeOption.value)
				? remove(activeOption.value)
				: add(activeOption);
			inputValue = '';
		}
		if ([38, 40].includes(e.keyCode)) {
			// up and down arrows
			const increment = e.keyCode === 38 ? -1 : 1;
			const calcIndex = filtered.indexOf(activeOption) + increment;
			activeOption =
				calcIndex < 0
					? filtered[filtered.length - 1]
					: calcIndex === filtered.length
					? filtered[0]
					: filtered[calcIndex];
		}
	}

	function handleBlur(e: FocusEvent) {
		optionsVisibility(false);
	}

	function handleTokenClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.closest('.token-remove')) {
			e.stopPropagation();
			remove((target.closest('.token') as HTMLElement)?.dataset.id as string);
		} else if (target.closest('.remove-all')) {
			selected = {};
			options = options.map((o) => ({ ...o, selected: false }));
			inputValue = '';
		} else {
			optionsVisibility(true);
		}
	}

	function handleOptionMousedown(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.classList.contains('disabled')) return;
		const value = target.dataset.value as string;
		if (selected[value]) {
			remove(value);
		} else {
			add(options.filter((o) => o.value == value)[0]);
			input.focus();
		}
	}
</script>

<div
	class="multiselect relative border-b-primary-500 border-b-2 bg-inherit min-h-[55px]"
	class:readonly
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="tokens min-h-[55px] w-full" class:showOptions on:click={handleTokenClick}>
		{#each Object.values(selected) as s}
			<div class="token" data-id={s.value}>
				<span>{s.label}</span>
				{#if !readonly}
					<div class="token-remove" title="Remove {s.label}">
						<X class="w-3 h-3" />
					</div>
				{/if}
			</div>
		{/each}
		<div class="actions h-full">
			{#if !readonly}
				<input
					{id}
					autocomplete="off"
					bind:value={inputValue}
					bind:this={input}
					on:keyup={handleKeyup}
					on:blur={handleBlur}
					{placeholder}
				/>
				<div class="remove-all" title="Remove All" class:hidden={!Object.keys(selected).length}>
					<X class="w-3 h-3" />
				</div>
				<svg
					class="dropdown-arrow"
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 18 18"><path d="M5 8l4 4 4-4z" /></svg
				>
			{/if}
		</div>
	</div>

	<select class="hidden"><slot /></select>

	{#if showOptions}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<ul
			class="options"
			transition:fly={{ duration: 200, y: 5 }}
			on:mousedown|preventDefault={handleOptionMousedown}
		>
			{#each filtered as option}
				<li
					class:selected={selected[option.value]}
					class:active={activeOption === option}
					data-value={option.value}
				>
					{option.label}
				</li>
			{:else}
				<li class="disabled">No Data Present</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.multiselect:not(.readonly):hover {
		border-bottom-color: hsl(0, 0%, 50%);
	}

	.tokens {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		position: relative;
	}

	.tokens::after {
		background: none repeat scroll 0 0 transparent;
		bottom: -1px;
		content: '';
		display: block;
		height: 2px;
		left: 50%;
		position: absolute;
		background: hsl(217, 67%, 47%);
		transition: width 0.3s ease 0s, left 0.3s ease 0s;
		width: 0;
	}

	.tokens.showOptions::after {
		width: 100%;
		left: 0;
	}

	.token {
		border-radius: 1.25rem;
		display: flex;
		margin: 0.25rem 0.5rem 0.25rem 0;
		max-height: 1.4rem;
		transition: background-color 0.3s;
		white-space: nowrap;
	}

	.token-remove,
	.remove-all {
		align-items: center;
		background-color: hsl(214, 15%, 55%);
		border-radius: 50%;
		color: hsl(214, 17%, 92%);
		display: flex;
		justify-content: center;
		height: 1.25rem;
		margin-left: 0.25rem;
		min-width: 1.25rem;
	}
	.token-remove:hover,
	.remove-all:hover {
		cursor: pointer;
	}

	.actions {
		align-items: center;
		display: flex;
		flex: 1;
	}

	input {
		border: none;
		font-size: 1.5rem;
		line-height: 1.5rem;
		margin: 0;
		outline: none;
		padding: 0;
		width: 100%;
	}

	.dropdown-arrow path {
		fill: hsl(0, 0%, 70%);
	}

	.options {
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), 0px -2px 4px rgba(0, 0, 0, 0.1);
		left: 0;
		list-style: none;
		margin-block-end: 0;
		margin-block-start: 0;
		max-height: 20vh;
		overflow: auto;
		padding-inline-start: 0;
		position: absolute;
		top: calc(100% + 1px);
		width: 100%;
		z-index: 9999999999;
	}

	li:last-child {
		border-bottom-left-radius: 0.2rem;
		border-bottom-right-radius: 0.2rem;
	}

	li.selected {
		background-color: hsl(232, 54%, 41%);
		color: white;
	}
	li.selected:nth-child(even) {
		background-color: hsl(232, 50%, 45%);
		color: white;
	}
	li.active {
		background-color: hsl(214, 17%, 88%);
	}
	li.selected.active,
	li.selected:hover {
		background-color: hsl(232, 48%, 50%);
	}

	::placeholder {
		font-size: medium;
	}
</style>
