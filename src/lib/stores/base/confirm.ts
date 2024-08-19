import { writable } from "svelte/store";

type ConfirmStore = {
  isVisible: boolean;
  confirmText: string;
  resolve: null | ((value: boolean) => void);
}

export const confirmStore = writable<ConfirmStore>({
  isVisible: false,
  confirmText: 'Are you sure?',
  resolve: null,
});