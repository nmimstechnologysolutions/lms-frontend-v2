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
    let username:string;

    export let formStage: "USERNAME" | "OTP" | "PASSWORD";
	export let maskedEmail: string;
	export let userLid: number;
	async function sendOtp(isResend = false) {
		const { json, error } = await fetchApi<ApiResponse>(
			`${PUBLIC_AUTH_BASE_URL}/otp/forgot-password`,
			'POST',{username}
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
		formStage = "OTP";
		username = ''
		maskedEmail = json.email
		userLid = json.userLid
	}
</script>
<InputGroup isRequired label="username">
    <Input
        type="text"
        name="username"
        bind:value={username}
    />
</InputGroup>
<button
    class="bg-primary-700 text-base text-white rounded-md px-3 py-2"
    disabled={isLoading}
	on:click={() => sendOtp(false)}
>
    {#if isLoading}
        <Spinner color="purple" size="6" />
    {/if}
    Send OTP
</button>