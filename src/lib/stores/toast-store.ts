import type { ToastType } from '$lib/types/stores';
import { writable } from 'svelte/store';

export const toastStore = writable<ToastType[]>();

// Function to add a toast directly to the store
export const addToast = (toast: ToastType) => {

    toastStore.update((currentToasts) => {
        if(currentToasts && currentToasts.length > 0) {
            return [...currentToasts, toast];
        } else {
            return [toast];
        }
    });

	// Automatically dismiss the toast after 20 seconds
	setTimeout(() => {
		removeToast(toast);
	}, 20000);
};

// Function to remove a toast from the store
export const removeToast = (toast: ToastType) => {
	toastStore.update((currentToasts) => currentToasts.filter((t) => t !== toast));
};
