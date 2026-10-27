<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children
	}: {
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class={cn('text-muted-foreground mt-2', className)}>
	<h2>
		{@render children()}
	</h2>
</div>
