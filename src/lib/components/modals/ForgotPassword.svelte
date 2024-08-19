<script lang="ts">
	import PasswordForm from './../form/forgot-password/PasswordForm.svelte';
	import UsernameForm from './../form/forgot-password/UsernameForm.svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_AUTH_BASE_URL } from '$env/static/public';
	import { fetchApi } from '$lib/utils/helper/fetchApi';

	import { Button, Label, Modal, Input, Spinner } from 'flowbite-svelte';
	import OtpForm from '../form/forgot-password/OtpForm.svelte';

	export let isOpen: boolean;
	let apiError = false;
	let requiredError = false;

	let isOtpSent = false;
    let isResendDisabled = false;

	let formStage: "USERNAME" | "OTP" | "PASSWORD" = "USERNAME";

	let inputs: number[] = new Array(6).fill(null);
	let currentIndex = 0;

	function handleInput(event: Event) {
		apiError = false;
		requiredError = false;
		const input = event.target as HTMLInputElement;

		if (input.value) {
			inputs[currentIndex] = parseInt(input.value, 10);
			currentIndex = (currentIndex + 1) % inputs.length;

			const nextInput = document.getElementById(`input-${currentIndex}`);
			if (nextInput) {
				nextInput.focus();
			}
		}
	}

	type ApiResponse = {
		message: string;
		redirect: boolean;
	};
	async function handleVerify() {
		const otp = inputs.join('');

		if (otp === '') {
			requiredError = true;
			return;
		}

		const { json, error } = await fetchApi<ApiResponse>(
			`${PUBLIC_AUTH_BASE_URL}/otp/verify-otp-login`,
			'POST',
			{
				otp
			}
		);

		if (error || !json) {
			console.log(error);
			apiError = true;
			return;
		}

		console.log({
			json,
			error
		});

		goto('/dashboard');
	}

	async function sendOtp(isResend = false) {
		const { json, error } = await fetchApi<ApiResponse>(
			`${PUBLIC_AUTH_BASE_URL}/otp/send-otp-login`,
			'POST',
			{
				email: '',
                isResend
			}
		);

		if (error || !json) {
			console.log(error);
			apiError = true;
			return;
		}

		isOtpSent = true;
		timerStart();
	}

	let timeLeft = 10;
	function timerStart() {
        isResendDisabled = true;
		const timer = setInterval(() => {
			if (timeLeft <= 0) {
				clearInterval(timer);
                isResendDisabled = false;
			}
			if (timeLeft > 0) {
				timeLeft -= 1;
			}
		}, 1000);
	}

	let maskedEmail = '';
	let userLid = 0;
</script>

<Modal bind:open={isOpen} size="xs" autoclose={false} dismissable={true} class="card w-full">
    <h5 class="mb-3 font-bold text-2xl text-gray-900 dark:text-white">Forgot Password</h5>
	
	{#if formStage === "USERNAME"}
		 <UsernameForm bind:formStage bind:maskedEmail bind:userLid/>
	{:else if  formStage === "OTP"}
		<OtpForm bind:formStage maskedEmail={maskedEmail} userLid={userLid} />
	{:else if formStage === "PASSWORD"}
		<PasswordForm bind:formStage bind:isModalOpen={isOpen} userLid={userLid} />
	{/if}
</Modal>

<style>
	:global(input.input) {
		text-align: center;
		margin: 0 0.2em;
	}
</style>
