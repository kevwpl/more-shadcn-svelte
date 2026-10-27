<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children
	}: {
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class={cn('grid gap-0 w-full max-w-3xl mt-8 mb-16', className)}>
	{@render children()}
</div>
