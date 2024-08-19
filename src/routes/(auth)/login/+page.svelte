<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_AUTH_BASE_URL } from '$env/static/public';
	import ForgotPassword from '$lib/components/modals/ForgotPassword.svelte';
	import OtpModal from '$lib/components/modals/OtpModal.svelte';
	import { addToast } from '$lib/stores/toast-store';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import { Input, Checkbox, Spinner } from 'flowbite-svelte';
	import { Eye, EyeOffIcon } from 'lucide-svelte'
	type ApiResponse = {
		message: string;
		isDirectLogin: boolean;
	};

	let isOtpRedirect = false;

	let username = ''
	let password = ''
	let rememberMe = false;
	let isLoading = false;
	
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()
		isLoading = true
		if (username === '' || password === '') {
			addToast({
				color: 'red',
				heading: 'Error',
				message: 'Please fill all the fields',
				position: 'bottom-right',
				error: true
			});
			isLoading = false;
			return;
		}

		const { json, error } = await fetchApi<ApiResponse>(`${PUBLIC_AUTH_BASE_URL}/auth/authenticate`, 'POST', {
			username,
			password,
			rememberMe
		});

		if (error || !json) {
			console.log(error);
			addToast({
				color: 'red',
				heading: 'Error',
				message: error?.message ?? "Something went wrong",
				position: 'bottom-right',
				error: true
			});
			isLoading = false;
			return;
		}

		if(json.isDirectLogin === false) {
			console.log('redirecting');
			console.log(json);
			isOtpRedirect = true;
			isLoading = false;
			return;
		}
		isLoading = false;
		goto('/mpc');
	}

	let showPassword = false;
	$: isForgotModalOpen = false;

	$: console.log(isForgotModalOpen);
	
</script>

<div class="h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
	<div class="relative py-3 sm:max-w-xl sm:mx-auto min-w-full md:min-w-[450px]">
		<div
			class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
		/>
		<div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl ">
			<img src="/images/logo-nmims.png" alt="logo" class="h-12 w-auto mx-auto" />
			<div class="max-w-md mx-auto sm:p-10">
				<h1 class="text-4xl font-bold text-center">Login</h1>
				<form on:submit|preventDefault={handleSubmit} class="divide-y divide-gray-200">
					<div class="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
						<div class="relative">
							<Input
								autocomplete="off"
								id="username"
								bind:value={username}
								disabled={isLoading}
								type="text"
								class="form-input px-4 border-b-2 border-l-0 border-r-0 border-t-0 border-slate-300 peer placeholder-transparent h-10 w-full text-gray-900 outline-none focus:border-none focus:outline-none"
								placeholder="Username"
							/>
							<label
								for="username"
								class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:top-[-20px] peer-focus:text-gray-600 peer-focus:text-sm"
								>Username</label
							>
						</div>
						<div class="relative">
							<Input
								autocomplete="off"
								id="password"
								bind:value={password}
								disabled={isLoading}
								type={showPassword ? 'text' : 'password'}
								class="form-input px-4 border-b-2 border-l-0 border-r-0 border-t-0 border-slate-300 peer placeholder-transparent h-10 w-full text-gray-900 outline-none"
								placeholder="Password"
							/>
							<label
								for="password"
								class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:top-[-20px] peer-focus:text-gray-600 peer-focus:text-sm"
								>Password</label
							>
							<button class="absolute right-2 top-2.5 text-gray-500"  type="button" on:click={() => showPassword = !showPassword}>
								{#if showPassword}
									<Eye size="20"  />
								{:else}
									<EyeOffIcon size="20" />
								{/if}
							</button>
						</div>
						<div class="flex justify-between">
							<Checkbox class="form-input" bind:checked={rememberMe}>Remember me</Checkbox>
							<button type="button" on:click|preventDefault={() => isForgotModalOpen = true}>
								<div class="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500"> Forgot password? </div>
							</button>
						  </div>
						<div class="relative">
							<button 
								class="bg-primary-700 text-base text-white rounded-md px-3 py-2"
								disabled={isLoading}
							>
								{#if isLoading}
									<Spinner color="purple" size="6" />
								{/if}
								Submit
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<OtpModal isOpen={isOtpRedirect} />
<ForgotPassword bind:isOpen={isForgotModalOpen} />