<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getStepperContext } from './ctx';

	let { class: className }: { class?: string } = $props();
	const ctx = getStepperContext();
	let isVertical = $derived(ctx.orientation() === 'vertical');
</script>

<div
	class={cn(
		'bg-muted flex-1',

		!isVertical && 'h-[2px] -mt-8 ml-4 mr-4',

		isVertical && 'absolute left-[27px] top-14 -bottom-4 w-[2px]',

		className
	)}
>
	<div
		class={cn(
			'bg-primary transition-all duration-200 ease-in-out',
			!isVertical && 'h-full w-full scale-x-0 group-data-[state=completed]:scale-x-100 origin-left',
			isVertical && 'w-full h-full scale-y-0 group-data-[state=completed]:scale-y-100 origin-top'
		)}
	/>
</div>
