export function api<T>(url: string): Promise<T> {
	return fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			return response.json();
		})
		.then((data) => {
			return data as T;
		})
		.catch((error: Error) => {
			console.error(error); /* <-- made up logging service */
			throw error; /* <-- rethrow the error so consumer can still catch it */
		});
}

// Consumer - consumer remains the same
api<{ title: string; message: string }>('v1/posts/1')
	.then(({ title, message }) => {
		console.log(title, message);
	})
	.catch((error) => {
		/* show error message */
		console.log(error);
	});
