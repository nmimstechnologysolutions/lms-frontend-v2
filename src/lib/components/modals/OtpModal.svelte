<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_AUTH_BASE_URL } from '$env/static/public';
	import { fetchApi } from '$lib/utils/helper/fetchApi';

	import { Button, Label, Modal, Input } from 'flowbite-svelte';

	export let isOpen = false;
	let apiError = false;
	let requiredError = false;

	let isOtpSent = false;
    let isResendDisabled = false;

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
</script>

<Modal bind:open={isOpen} size="xs" autoclose={false} dismissable={false} class="card w-full">
	<div class="flex flex-col space-y-6">
		<h3 class="mb-3 font-bold text-2xl text-gray-900 dark:text-white">Verify OTP</h3>
		{#if !isOtpSent}
			<p>kindly click on the button below to receive OTP on your registered email address.</p>
			<Button class="w-full" on:click={() => sendOtp(false)}>Send OTP</Button>
		{:else}
			<h5>
				Please Enter OTP Sent to your Registered Email address <strong>sam******@gmail.com</strong>
			</h5>
			<Label class="space-y-2">
				<div id="otpContainer" class="flex gap-x-3">
					{#each inputs as digit, i (i)}
						<Input
							class="input ${apiError || requiredError
								? '!border-3 border-red-600 focus:!border-red-600 focus:!ring-0 focus:!ring-red-600'
								: ''}"
							type="text"
							id={`input-${i}`}
							maxlength="1"
							on:input={handleInput}
						/>
					{/each}
				</div>
				{#if apiError}
					<p class="text-red-600 mt-2">Invalid OTP</p>
				{:else if requiredError}
					<p class="text-red-600 mt-2">OTP Required</p>
				{/if}
			</Label>
			<div class="space-y-2">
				<Button on:click={handleVerify} class="w-full">Verify</Button>
				<div class="flex justify-between items-center">
					<p class="text-center text-sm font-semibold">Didn't receive OTP?</p>
					<Button on:click={() => sendOtp(true)} disabled={timeLeft !== 0}
						>Resend Otp
						{#if timeLeft > 0}
							in {timeLeft} seconds
						{/if}
					</Button>
				</div>
			</div>
		{/if}
	</div>
</Modal>

<style>
	:global(input.input) {
		text-align: center;
		margin: 0 0.2em;
	}
</style>
