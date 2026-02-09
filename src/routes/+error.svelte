<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	onMount(() => {
		if ($page.status === 404) {
			goto('/', { replaceState: true });
		}
	});
</script>

<div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
	<h1>404 - Page Not Found</h1>
	<p>Redirecting to home...</p>
</div>
