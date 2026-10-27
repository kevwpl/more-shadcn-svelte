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

<div class={cn('relative flex flex-col', className)}>
	<div class="absolute left-[11.5px] top-0 bottom-0 w-px bg-border" />
	{@render children()}
</div>
