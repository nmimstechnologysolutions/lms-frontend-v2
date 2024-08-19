<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_AUTH_BASE_URL } from '$env/static/public';
	import { addToast } from '$lib/stores/toast-store';
	import { fetchApi } from '$lib/utils/helper/fetchApi';

	import { Button, Label, Modal, Input } from 'flowbite-svelte';

	export let maskedEmail: string;
    export let formStage: "EMAIL" | "MOBILE" | "PASSWORD";

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
			`${PUBLIC_AUTH_BASE_URL}/otp/verify-forgot-password`,
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

        formStage = "EMAIL";
	}


	let isLoading:boolean = false;
    let username:string;


	
	async function sendOtp() {
		const { json, error } = await fetchApi<ApiResponse>(
			`${PUBLIC_AUTH_BASE_URL}/otp/profile-email-otp`,
			'POST',
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
		formStage = "EMAIL";
		username = ''
	}

	
</script>

<div class="flex flex-col space-y-6">
	{#if isOtpSent}
		<h5>
			Please Enter OTP Sent to your Registered Email address <strong>{maskedEmail}</strong>
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
				<!-- <Button on:click={() => sendOtp(true)} disabled={timeLeft !== 0}
						>Resend Otp
						{#if timeLeft > 0}
							in {timeLeft} seconds
						{/if}
					</Button> -->
			</div>
		</div>
	{:else}
		<Button on:click={sendOtp} class="w-full">SEND OTP</Button>
	{/if}
	
</div>
