<script lang="ts">
	import SingleToast from './SingleToast.svelte';
	import { toastStore } from "$lib/stores/toast-store";

</script>

{#if $toastStore && $toastStore.length > 0}
    {#each $toastStore as toast}
        <SingleToast
            toast={toast}
        />
    {/each}
{/if}