<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getDockContext } from './ctx';
	import { Motion, useSpring, useTransform } from 'svelte-motion';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		tooltip,
		onclick,
		transparent = false
	}: {
		class?: string;
		children: Snippet;
		tooltip?: string;
		onclick?: () => void;
		transparent?: boolean;
	} = $props();

	let ref: HTMLElement | undefined = $state();
	const ctx = getDockContext();
	const mouseX = ctx.mouseX;

	let distanceCalc = useTransform(mouseX, (val: number) => {
		const bounds = ref?.getBoundingClientRect() ?? { x: 0, width: 0 };
		return val - bounds.x - bounds.width / 2;
	});

	let widthSync = useTransform(
		distanceCalc,
		[-ctx.distance, 0, ctx.distance],
		[40, ctx.magnification, 40]
	);

	let width = useSpring(widthSync, {
		mass: 0.1,
		stiffness: 150,
		damping: 12
	});
</script>

{#snippet IconContent()}
	<Motion style={{ width, height: width }} let:motion>
		<button
			use:motion
			bind:this={ref}
			{onclick}
			class={cn(
				'flex aspect-square cursor-pointer items-center justify-center rounded-full transition-colors',
				!transparent && 'hover:bg-gray-100 dark:hover:bg-neutral-800',
				className
			)}
		>
			{@render children()}
		</button>
	</Motion>
{/snippet}

{#if tooltip}
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{@render IconContent()}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{tooltip}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
{:else}
	{@render IconContent()}
{/if}
