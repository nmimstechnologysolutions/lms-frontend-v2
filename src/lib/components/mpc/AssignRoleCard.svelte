<script lang="ts">
	import { facultyRoleStore } from '$lib/stores/mpc/faculty-role';
	import type { FacultyRole } from '$lib/types/mpc';
	import { MPC_USER_ROLE } from '$lib/utils/constants/mpc.constants';
	import { Badge } from 'flowbite-svelte';
	import { Plus, X } from 'lucide-svelte';

	export let data: FacultyRole;

	function addOrRemoveRole(role: string, add: boolean) {

		const checkbox = document.querySelector(
			`input[data-user-session-lid="${data.usersessionLid}"][data-role="${role}"]`
		) as HTMLInputElement;
		checkbox.checked = add;

		facultyRoleStore.update((store) => {
			store = store.map((item) => {
				if (item.usersessionLid === data.usersessionLid) {
					if (role === MPC_USER_ROLE.PROGRAM_ANCHOR) {
						item.isProgramAnchor = add;
					} else if (role === MPC_USER_ROLE.COURSE_ANCHOR) {
						item.isCourseAnchor = add;
					}
				}
				return item;
			});
			return store;
		})
	}
</script>

<div class="flex flex-col gap-2 mb-5">
	<div
		class="pl-4 lg:pr-3 py-3 border-b-base-100 border-b-2 dark:border-b-[0.2px]
             text-black dark:text-slate-200 bg-slate-100 dark:bg-primary-dark-950
                border-r-4 border-primary-600 rounded-md"
	>
		<p class="font-semibold">{data.username} - {data.facultyName}</p>
		<div class="flex flex-col 2xl:flex-row gap-1 mt-2">
			{#if data.isProgramAnchor !== null}
				<div class="text-[10px] xl:text-xs">
					<Badge rounded class="mpc-role-badge md:py-2 !text-black dark:!text-slate-200">
						Program Anchor
						{#if data.isProgramAnchor === true}
							<button title="Remove as Program Anchor" on:click={() => addOrRemoveRole(MPC_USER_ROLE.PROGRAM_ANCHOR, false)}>
								<X class="w-3 h-3 ml-1 cursor-pointer text-rose-700" />
							</button>
						{:else}
							<button title="Add as Program Anchor" on:click={() => addOrRemoveRole(MPC_USER_ROLE.PROGRAM_ANCHOR, true)}>
								<Plus class="w-3 h-3 ml-1 cursor-pointer text-green-700" />
							</button>
						{/if}
					</Badge>
				</div>
			{/if}
			{#if data.isCourseAnchor !== null}
				<div class="text-[10px] xl:text-xs">
					<Badge rounded class="mpc-role-badge md:py-2 !text-black dark:!text-slate-200">
						Course Anchor
						{#if data.isCourseAnchor === true}
							<button title="Remove as Course Anchor" on:click={() => addOrRemoveRole(MPC_USER_ROLE.COURSE_ANCHOR, false)}>
								<X class="w-3 h-3 ml-1 cursor-pointer text-rose-700" />
							</button>
						{:else}
							<button title="Add as Course Anchor" on:click={() => addOrRemoveRole(MPC_USER_ROLE.COURSE_ANCHOR, true)}>
								<Plus class="w-3 h-3 ml-1 cursor-pointer text-green-700" />
							</button>
						{/if}
					</Badge>
				</div>
			{/if}
		</div>
	</div>
</div>
