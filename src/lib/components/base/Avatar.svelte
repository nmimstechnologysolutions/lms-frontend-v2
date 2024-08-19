<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_AUTH_BASE_URL } from '$env/static/public';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { Button, Dropdown, DropdownItem, Avatar } from 'flowbite-svelte';
	import type { UserDetails } from '$lib/types';

	async function logout() {
		await fetchApi(`${PUBLIC_AUTH_BASE_URL}/auth/logout`, 'POST');

		goto('/login');
	}

	$: userDetails = $page.data.json.user_detail as UserDetails

	$: console.log("userDetails:::::::", userDetails);
	
</script>

<Button pill color="light" id="profile-avatar" class="!p-1 !bg-inherit flex-1">
	<Avatar
		src="https://images.unsplash.com/photo-1618641986557-1ecd230959aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
		class="mr-2 !w-10 !h-10"
	/>
	{userDetails.first_name ?? 'Profile'} {userDetails.last_name ?? ''}
</Button>
<Dropdown class="z-[99999999999] base profile-card" triggeredBy="#profile-avatar">
	<div slot="header" class="px-4 py-2 base">
		{#if userDetails.first_name || userDetails.last_name}
			 <span class="block text-sm text-gray-900 dark:text-white">{userDetails.first_name ?? '-'} {userDetails.last_name ?? '-'}</span>
		{/if}
		<span class="block text-sm text-gray-900 dark:text-white">{userDetails.username ?? '-'}</span>
		<!-- {#if userDetails.email}
			<span class="block truncate text-sm font-medium">{userDetails.email}</span>
		{/if} -->
	</div>
	<DropdownItem href="/profile">
		Profile
	</DropdownItem>
	<DropdownItem slot="footer" class="base" on:click={logout}>Sign out</DropdownItem>
</Dropdown>
