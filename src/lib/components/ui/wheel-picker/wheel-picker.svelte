<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		collapsed = false,
		children
	}: { class?: string; collapsed?: boolean; children: Snippet } = $props();
</script>

<div
	class={cn(
		'relative flex w-full touch-none overflow-hidden bg-background select-none',
		className,
		collapsed ? 'h-10 transition-all hover:h-[200px] active:h-[200px]' : 'h-[200px]'
	)}
>
	<div
		class="pointer-events-none absolute left-2 right-2 top-1/2 -translate-y-1/2 h-[32px] rounded-md bg-muted z-1"
	/>

	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-2"
	/>
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent z-2"
	/>

	<div class="flex h-full w-full justify-center px-4 z-2 perspective-container">
		{@render children()}
	</div>
</div>

<style>
	.perspective-container {
		perspective: 1000px;
	}
</style>
