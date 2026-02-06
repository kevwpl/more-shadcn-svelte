<script lang="ts">
	import { cn } from '$lib/utils';
	import { MapPin } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div class={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
	<MapPin class="h-3 w-3" />
	<span class="truncate">{@render children()}</span>
</div>
