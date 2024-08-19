// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	// Add ApexCharts to the global namespace

	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ApexCharts: any;
	}
}

export {};
