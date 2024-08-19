<script lang="ts">
	import { driver } from 'driver.js';
	import { onMount } from 'svelte';

	onMount(() => {
		const driverObj = driver({
			showProgress: true,
			steps: [
				{
					element: '#sidebar',
					popover: {
						title: 'Modules',
						description: 'There are all the modules at your fingertips in the Side-Bar',
						side: 'left',
						align: 'start'
					}
				},
				{
					element: '#sidebar :nth-child(1)',
					popover: {
						title: 'Home/Dashboard',
						description:
							'Welcome to the Home/Dashboard section. This is where you can access key features and get an overview of your activities. Explore the various options available to make the most out of your experience.',
						side: 'bottom',
						align: 'start'
					}
				},
				{
					element: '#profile-avatar',
					popover: {
						title: 'Your Profile',
						description:
							'Welcome to your profile! This is your personal space where you can manage your information, preferences, and activities. Update your details, customize your experience, and make the most out of your time here.',
						side: 'bottom',
						align: 'start'
					}
				},
				{
					popover: {
						title: 'Happy Coding',
						description: 'And that is all, go ahead and start adding tours to your applications.'
					}
				}
			]
		});

		// driverObj.drive();
		const button = document.querySelector('.show-notification-button');

		button?.addEventListener('click', () => {
			navigator.serviceWorker.register('./src/sw.js').then((registration) => {
				Notification.requestPermission().then((permissionResult) => {
					console.log('permissionResult::::::', permissionResult);
					if (permissionResult === 'granted') {
						registration.showNotification('My first notification', {
							body: 'More details about this notification'
						});
						// registration.pushManager.subscribe({
						// userVisibleOnly: true,
						// applicationServerKey: `${PUBLIC_YOUR_KEY}`
						// }).then(pushSubscription => {
						// 	console.log("My first notification:::::")
						// 	console.log('pushSubscription', JSON.stringify(pushSubscription))
						// })
					}
				});
			});
		});
	});
</script>

<!-- Dashboard -->
<!-- <div class="hidden">
	<Button class="show-notification-button">Show Notification</Button>
</div> -->

<main class="md:pl-12">
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 pt-6 gap-8">
		<a href="/mpc" class="max-w-xs w-64 mx-auto sm:mr-auto">
			<div class="card hover:scale-105 transition-all !rounded-2xl">
				<div class="card-body flex flex-col items-center gap-5">
					<div>
						<img src="/images/university.png" alt="MPC" class="w-16 h-16 dark:mix-blend-soft-light" />
					</div>
					<h2 class="card-title font-[550] text-4xl font-serif">MPC</h2>
				</div>
			</div>
		</a>
		<!-- <a href="/test_module/create-test" class="max-w-xs w-64 mx-auto sm:mr-auto">
			<div class="card hover:scale-105 transition-all !rounded-2xl">
				<div class="card-body flex flex-col items-center gap-5">
					<div>
						<img src="/images/university.png" alt="MPC" class="w-16 h-16 dark:mix-blend-soft-light" />
					</div>
					<h2 class="card-title font-[550] text-4xl font-serif">Test</h2>
				</div>
			</div>
		</a> -->
	</div>
</main>