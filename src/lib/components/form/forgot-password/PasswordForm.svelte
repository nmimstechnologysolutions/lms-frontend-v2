<script lang="ts">
	import { PUBLIC_AUTH_BASE_URL } from '$env/static/public';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import { addToast } from '$lib/stores/toast-store';
	import { fetchApi } from '$lib/utils/helper/fetchApi';

	type ApiResponse = {
		message: string;
		email: string;
		redirect: boolean;
		userLid: number;
	};

	import { Input, Spinner } from 'flowbite-svelte';
	let isLoading:boolean = false;
    let password:string;
    let confirmPassword:string;

    export let formStage: "USERNAME" | "OTP" | "PASSWORD";
    export let isModalOpen: boolean;
	export let userLid: number;
	async function changePassword(isResend = false) {
		const { json, error } = await fetchApi<ApiResponse>(
			`${PUBLIC_AUTH_BASE_URL}/auth/change-password`,
			'POST',{password,confirmPassword,userLid}
		);

		if (error || !json) {
			addToast({
				color: 'red',
				heading: 'Error',
				message: error?.message ?? "Something went wrong",
				position: 'bottom-right',
				error: true
			});
			return;
		}

		console.log("JOSN : ",json);
		isModalOpen = false
		addToast({
			color: 'green',
			heading: 'Success',
			message: "Password Changed Successfully!",
			position: 'bottom-right',
			error: false
		});

		formStage = "USERNAME"
	}
</script>
<InputGroup isRequired label="New Password">
    <Input
        type="password"
        name="password"
        bind:value={password}
    />
</InputGroup>
<InputGroup isRequired label="Confirm Password">
    <Input
    type="password"
    name="confirm password" 
    bind:value={confirmPassword}
    />
</InputGroup>

<button
    class="bg-primary-700 text-base text-white rounded-md px-3 py-2"
    disabled={isLoading}
	on:click={() => changePassword(false)}
>
    {#if isLoading}
        <Spinner color="purple" size="6" />
    {/if}
    Submit
</button>