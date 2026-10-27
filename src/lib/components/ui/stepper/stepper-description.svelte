<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<p class={cn('text-xs text-muted-foreground', className)}>{@render children()}</p>
