<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<h3 class={cn('truncate text-base leading-tight', className)}>
	{@render children()}
</h3>
