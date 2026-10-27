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

<div
	class={cn(
		'w-full min-w-0 max-w-3xl p-5 pt-8 animate-in fade-in slide-in-from-right-4',
		className
	)}
>
	{@render children()}
</div>
