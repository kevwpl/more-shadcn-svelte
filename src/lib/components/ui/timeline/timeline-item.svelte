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

<div class={cn('group relative flex items-start pb-8 last:pb-0', className)}>
	{@render children()}
</div>
