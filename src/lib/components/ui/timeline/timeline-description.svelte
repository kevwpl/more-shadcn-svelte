<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';

	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<p class={cn('text-sm text-muted-foreground mt-1', className)}>
	{@render children()}
</p>
