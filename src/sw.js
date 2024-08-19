self.addEventListener('push', (event) => {
	// @ts-ignore
	const data = event.data;
	const message = data?.text();
	// @ts-ignore
	self.registration.showNotification(message);
	//console.log('message:', message)
});
