<script lang="ts">
	import { cn } from '$lib/utils';
	import { Check } from '@lucide/svelte';
	import { getStepperContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		step,
		class: className,
		children,
		success
	}: {
		step: number;
		class?: string;
		children?: Snippet;
		success?: Snippet;
	} = $props();

	const ctx = getStepperContext();

	let isCompleted = $derived(step < ctx.activeStep());
	let isActive = $derived(step === ctx.activeStep());
</script>

<div
	class={cn(
		'relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-200',
		isActive && 'border-primary text-primary ring-2 ring-primary/20 ring-offset-2',
		isCompleted && 'border-primary bg-primary text-primary-foreground',
		!isActive && !isCompleted && 'border-muted-foreground/25 text-muted-foreground',
		className
	)}
>
	{#if isCompleted}
		{#if success}
			{@render success()}
		{:else}
			<Check class="h-5 w-5" />
		{/if}
	{:else if children}
		{@render children()}
	{:else}
		{step + 1}
	{/if}
</div>
