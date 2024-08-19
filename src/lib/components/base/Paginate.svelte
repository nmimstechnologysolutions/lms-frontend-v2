<script lang="ts">
	import { Input, Pagination, Select } from 'flowbite-svelte';
	import { browser } from '$app/environment';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { PUBLIC_DEFAULT_PAGINATION_LIMIT } from '$env/static/public';
	import { Search } from 'lucide-svelte';
	import { PAGINATION_LIMIT } from '$lib/utils/constants/pagination';
	import type { CustomError } from '$lib/types/error';

	export let tableData: any = null;
	export let url = '';
	export let fetchError: CustomError;
	export let showSearch = true;

	let limit = Number.parseInt(PUBLIC_DEFAULT_PAGINATION_LIMIT);
	let total = 0, page = 1, searchText = '', size = 0;
	let previousButton: any, nextButton: any;

	let searchTextU = '';

	$: pagesTotal = Array.from({ length: Math.ceil(total / limit) }, (_, i) => {
		return {
			name: i + 1,
			active: i + 1 === page
		};
	});

	let pagesLimited: any[] = [];

	$: {
		pagesLimited = pagesTotal.length < 4 ? pagesTotal : pagesTotal.slice(0, 5);
		if (page > 3) {
			pagesLimited = pagesTotal.slice(page - 2, page + 3);
		}
	}

	$: isPreviousDisabled = page === 1;
	$: {
		if (previousButton && previousButton.parentElement) {
			previousButton.parentElement.disabled = isPreviousDisabled;
		}
	}

	$: isNextDisabled = page === pagesTotal.length;
	$: {
		if (nextButton && nextButton.parentElement) {
			nextButton.parentElement.disabled = isNextDisabled;
		}
	}

	const previous = () => {
		if (page == 1) return;
		if (isPreviousDisabled) return;
		page = page - 1;
	};

	const next = () => {
		if (page == total) return;
		if (isNextDisabled) return;
		page = page + 1;
	};

	const handleClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		let value = parseInt(target.innerText);
		if (isNaN(value)) {
			return;
		}

		if (value === page) {
			return;
		}
		page = value;
	};

	const handleSearch = () => {
		page = 1
		searchText = searchTextU
	};

	const handleEmptySearch = () => {
		let emptySearchValue = searchTextU;
		if (emptySearchValue === '') {
			searchText = '';
		}
	};

	$: {
		browser && handlePagination(limit, page, searchText, url);
	}

	const handlePagination = async (
		_limit: number,
		_page: number,
		_search: string | null,
		_url: string
	) => {
		tableData = null;
		const offset = (_page - 1) * _limit;
		const url = _url.includes('?')
			? `${_url}&limit=${_limit}&offset=${offset}&search=${_search}`
			: `${_url}?limit=${_limit}&offset=${offset}&search=${_search}`;
		const { json, error } = await fetchApi<any>(url, 'GET', null);
		if (error) {
			const err = error.message || error.status;
			console.log(err);
			fetchError = {
				message: err,
				status: error.status,
				code: Number(error.code) || 500
			};
			total = 0
			return;
		}
		console.log({
			json,
		});
		
		tableData = json.data.items;
		size = json.data.items.length ?? 1;
		total = json.data.total ?? json.data.items.length ?? 1;

		if(searchText !== '') {
			setTimeout(() => {
				highlightSearchText();
			}, 100);
		}
	};

	function highlightSearchText() {
		const cells = document.getElementById('pagination-wrapper')?.querySelectorAll('td');
		if(!cells) return;
		// Loop through each cell and check if it contains the search text
		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];
			
			// Check if the cell's text content contains the search text
			if (cell.textContent?.toLowerCase().includes(searchText.toLocaleLowerCase())) {
				// Apply a CSS class to highlight the cell
				cell.classList.add('highlighted-cell');
			}
		}
	}
</script>

<div id="pagination-wrapper" {...$$props}>
	<div class="flex items-center justify-between">
		<span class="text-slate-500">Show entries
			<Select
				class="my-2 w-20 form-select"
				placeholder="Limit"
				items={PAGINATION_LIMIT}
				aria-label="Table Limit"
				bind:value={limit}
			/>
		</span>
		<form on:submit|preventDefault={handleSearch}>
			{#if showSearch}
				<Input
					on:input={handleEmptySearch}
					id="search"
					placeholder="Search..."
					bind:value={searchTextU}
					size="lg"
					class="pr-0 form-input w-40 md:w-64"
				>
					<svelte:fragment slot="right">
						<button aria-label="Table Content Search Button" on:click={handleSearch} class="bg-white">
							<Search class="text-primary-custom-600 dark:text-base-200 cursor-pointer" />
						</button>
					</svelte:fragment>
				</Input>
			{/if}
		</form>
	</div>
	<slot />
	<Pagination
		class="pagination my-2 float-right"
		activeClass="active"
		pages={pagesLimited}
		on:previous={previous}
		on:next={next}
		on:click={handleClick}
	>
		<span bind:this={previousButton} slot="prev">
			<!-- <span>First Page</span> -->
			<span>previous</span>
		</span>
		<span bind:this={nextButton} slot="next">
			<span>Next</span>
			<!-- <span>Last Page</span> -->
		</span>
	</Pagination>
	<span class="my-2 sm:block hidden">
		Showing <span class="text-primary-custom-600"> {size} </span> of
		<span class="text-primary-custom-600"> {total} </span> entries
	</span>
</div>
