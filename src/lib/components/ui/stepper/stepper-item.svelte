<script lang="ts">
	import { cn } from '$lib/utils';
	import { getStepperContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		step,
		class: className,
		children
	}: {
		step: number;
		class?: string;
		children: Snippet;
	} = $props();

	const ctx = getStepperContext();

	let isCompleted = $derived(step < ctx.activeStep());
	let isActive = $derived(step === ctx.activeStep());
	let isVertical = $derived(ctx.orientation() === 'vertical');
</script>

<div
	data-state={isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}
	class={cn(
		'group flex items-center',
		!isVertical && 'flex-1 gap-4 last:flex-none',
		isVertical && 'flex-col items-start relative gap-0',
		className
	)}
>
	{@render children()}
</div>
