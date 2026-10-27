<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getCompareContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		target = 'first',
		class: className,
		children
	}: {
		target?: 'first' | 'second';
		class?: string;
		children: Snippet;
	} = $props();

	const ctx = getCompareContext();
	let isHorizontal = $derived(ctx.orientation() === 'horizontal');
</script>

<div
	class={cn('absolute inset-0 h-full w-full select-none', className)}
	style:clip-path={target === 'second'
		? isHorizontal
			? 'inset(0 calc(100% - var(--pos)) 0 0)'
			: 'inset(0 0 calc(100% - var(--pos)) 0)'
		: undefined}
>
	{@render children()}
</div>
