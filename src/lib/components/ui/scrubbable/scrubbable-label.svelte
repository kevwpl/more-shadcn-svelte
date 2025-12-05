<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<span class={cn('text-xs font-medium opacity-70 mr-2 pointer-events-none', className)}>
	{@render children()}
</span>
