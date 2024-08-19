<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	export let data;

	$: mpcUrls = data.json.accessible_url.filter(v => v.module !== null && v.module !== 'null');
	onMount(() => {
		goto(mpcUrls[0].url);
	});
</script>
