<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCompareContext } from './ctx';
	import { GripVertical, GripHorizontal } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children
	}: {
		class?: string;
		children?: Snippet;
	} = $props();

	const ctx = getCompareContext();
	let isHorizontal = $derived(ctx.orientation() === 'horizontal');
</script>

<div
	class={cn(
		'absolute pointer-events-none z-2 flex items-center justify-center text-primary-foreground',
		isHorizontal
			? 'top-0 bottom-0 w-1 -ml-0.5 left-[var(--pos)]'
			: 'left-0 right-0 h-1 -mt-0.5 top-[var(--pos)]',
		className
	)}
>
	<div
		class={cn(
			'absolute bg-accent shadow-[0_0_10px_rgba(0,0,0,0.5)]',
			isHorizontal ? 'h-full w-0.5' : 'w-full h-0.5'
		)}
	/>

	<div
		class="relative z-1 w-5 h-5 flex items-center justify-center rounded-xs bg-accent text-primary shadow-md border border-black/10"
	>
		{#if children}
			{@render children()}
		{:else if isHorizontal}
			<GripVertical class="h-4 w-4 opacity-50" />
		{:else}
			<GripHorizontal class="h-4 w-4 opacity-50" />
		{/if}
	</div>
</div>
