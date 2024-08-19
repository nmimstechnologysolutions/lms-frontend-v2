<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { InfoIcon } from 'lucide-svelte';
	import { backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import AssignRoleCard from '../mpc/AssignRoleCard.svelte';
	import { facultyRoleStore } from '$lib/stores/mpc/faculty-role';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import type { FetchResponse } from '$lib/types/response';
	import { goto } from '$app/navigation';
	import { addToast } from '$lib/stores/toast-store';

	async function clearStore() {
		facultyRoleStore.set([]);
		goto('/mpc');
	}

	async function handleSubmit() {
		const obj = $facultyRoleStore.map((item) => {
			return {
				usersessionLid: item.usersessionLid,
				isProgramAnchor: item.isProgramAnchor,
				isCourseAnchor: item.isCourseAnchor
			};
		});

		console.log(obj);
		
		const data = {
			data: obj
		};

		const { json, error } = await fetchApi<FetchResponse>(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/assign-role`,
			'POST',
			data
		);
		
		if (error) {
			console.log(error);
			addToast({
				color: "red",
				heading: error.status,
				message: error.message,
				position: "bottom-right",
				error: false,
			});
			return;
		}
		console.log(json);

		facultyRoleStore.set([]);

		addToast({
			color: "green",
			heading: json.status,
			message: json.message,
			position: "bottom-right",
			error: false,
		});

		const sidebarButton = document.getElementById('second-sidebar-card-button');

		if(sidebarButton && !sidebarButton.classList.contains('active')) {
			sidebarButton.click();
		}
	}
</script>

{#if $facultyRoleStore.length > 0}
	<div
		in:fly={{
			x: 100,
			easing: backOut,
			delay: 150
		}}
		out:fly={{
			x: 100,
			easing: backOut
		}}
		class="min-w-[200px] max-w-[300px] border-l-2 dark:border-slate-500 pl-3"
	>
		<div class="flex items-center border-b-2 dark:border-slate-400 border-slate-300">
			<h5 id="drawer-label" class="inline-flex items-center mb-4 text-lg font-bold">
				<InfoIcon class="w-4 h-4 me-2.5 text-blue-600 " />Assign Anchor Role
			</h5>
		</div>
		<div class="mt-3 h-[55vh] lg:h-[64vh] overflow-y-auto">
			{#each $facultyRoleStore as item}
				<AssignRoleCard data={item} />
			{/each}
		</div>
		<div>
			<Button on:click={clearStore} class="mt-3 w-full" color="red">Clear</Button>
			<Button on:click={handleSubmit} class="mt-3 w-full" color="primary">Submit</Button>
		</div>
	</div>
{/if}

<style>
	::-webkit-scrollbar {
		width: 2px;
	}
</style>
