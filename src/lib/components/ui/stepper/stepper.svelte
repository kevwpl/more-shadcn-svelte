<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { setStepperContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		value = $bindable(0),
		orientation = 'horizontal',
		class: className,
		children
	}: {
		value: number;
		orientation?: 'horizontal' | 'vertical';
		class?: string;
		children: Snippet;
	} = $props();

	setStepperContext({
		activeStep: () => value,
		setStep: (s: number) => {
			value = s;
		},
		orientation: () => orientation
	});
</script>

<div
	class={cn(
		'flex w-full gap-4',
		orientation === 'vertical' ? 'flex-col' : 'flex-row items-start justify-between',
		className
	)}
>
	{@render children()}
</div>
