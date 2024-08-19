<script lang="ts">
	import type { UserRoleResult } from '$lib/types/mpc';
	import { MPC_USER_ROLE } from '$lib/utils/constants/mpc.constants';
	import { addRoleInStoreForChecked } from '$lib/utils/helper/mpc/index.utils';
	import { Checkbox, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	export let item: UserRoleResult;
	export let isOpened = false;

	async function handleCheckboxClick(e: Event, role: string) {
		console.log({
			role
		});
		const target = e.target as HTMLInputElement;
		const sidebarButton = document.getElementById('second-sidebar-card-button');

		if (!isOpened && sidebarButton) {
			sidebarButton.click();
			isOpened = true;
		}

		addRoleInStoreForChecked(item, role, target.checked);
	}
</script>

<TableBodyRow class="capitalize">
	<TableBodyCell>{item.username}</TableBodyCell>
	<TableBodyCell>{item.first_name + ' ' + item.last_name}</TableBodyCell>
	<TableBodyCell>{item.program_name + ' - ' + item.program_code}</TableBodyCell>
	<TableBodyCell>{item.subject_name + ' - ' + item.subject_abbr}</TableBodyCell>
	<TableBodyCell>{item.acad_session}</TableBodyCell>
	<TableBodyCell>{item.campus_name}</TableBodyCell>
	<!-- <TableBodyCell>{item.organization_name ?? 'N.A'}</TableBodyCell> -->
	<TableBodyCell>
		<Checkbox
			on:change={(e) => handleCheckboxClick(e, MPC_USER_ROLE.PROGRAM_ANCHOR)}
			checked={item.is_program_anchor}
			data-role={MPC_USER_ROLE.PROGRAM_ANCHOR}
			data-user-session-lid={item.user_session_lid}
			aria-label="Program Anchor / Program Chair"
			class="md:ml-5"
		/>
	</TableBodyCell>
	<TableBodyCell>
		<Checkbox
			on:change={(e) => handleCheckboxClick(e, MPC_USER_ROLE.COURSE_ANCHOR)}
			checked={item.is_course_anchor}
			data-role={MPC_USER_ROLE.COURSE_ANCHOR}
			data-user-session-lid={item.user_session_lid}
			aria-label="Course Anchor"
			class="md:ml-2"
		/>
	</TableBodyCell>
</TableBodyRow>
