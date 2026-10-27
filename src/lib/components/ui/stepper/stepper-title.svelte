<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<h3 class={cn('text-sm font-medium leading-none', className)}>{@render children()}</h3>
