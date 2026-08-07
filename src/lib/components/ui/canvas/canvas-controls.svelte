<script lang="ts">
	import { cn } from '$lib/utils';
	import { Maximize, Minus, Plus, RotateCcw } from '@lucide/svelte';
	import { getCanvasContext } from './ctx.svelte';

	let {
		position = 'bottom-left',
		step = 1.25,
		showZoom = true,
		showFit = true,
		showReset = true,
		class: className,
		...rest
	}: {
		position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
		step?: number;
		showZoom?: boolean;
		showFit?: boolean;
		showReset?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const canvas = getCanvasContext('Canvas.Controls');

	let el = $state<HTMLDivElement | null>(null);

	// Written inside Canvas.Root's children, rendered in its overlay — otherwise
	// the controls would pan and scale along with the content.
	$effect(() => {
		if (el && canvas.overlay && el.parentElement !== canvas.overlay) {
			canvas.overlay.appendChild(el);
		}
	});

	const POSITION = {
		'bottom-left': 'bottom-3 left-3',
		'bottom-right': 'bottom-3 right-3',
		'top-left': 'top-3 left-3',
		'top-right': 'top-3 right-3'
	};

	const button =
		'flex size-8 items-center justify-center rounded-md transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40';
</script>

<div
	bind:this={el}
	role="group"
	aria-label="Canvas controls"
	class={cn(
		'pointer-events-auto absolute z-20 flex items-center gap-1 rounded-lg border bg-popover p-1 text-popover-foreground shadow-sm',
		POSITION[position],
		className
	)}
	{...rest}
>
	{#if showZoom}
		<button
			type="button"
			aria-label="Zoom out"
			title="Zoom out"
			disabled={canvas.zoom <= canvas.minZoom}
			onclick={() => canvas.zoomBy(1 / step)}
			class={button}
		>
			<Minus class="size-4" />
		</button>

		<span class="w-12 text-center font-mono text-xs tabular-nums text-muted-foreground">
			{Math.round(canvas.zoom * 100)}%
		</span>

		<button
			type="button"
			aria-label="Zoom in"
			title="Zoom in"
			disabled={canvas.zoom >= canvas.maxZoom}
			onclick={() => canvas.zoomBy(step)}
			class={button}
		>
			<Plus class="size-4" />
		</button>
	{/if}

	{#if showFit}
		<button
			type="button"
			aria-label="Fit to content"
			title="Fit to content"
			onclick={() => canvas.fitView()}
			class={button}
		>
			<Maximize class="size-4" />
		</button>
	{/if}

	{#if showReset}
		<button
			type="button"
			aria-label="Reset view"
			title="Reset view"
			onclick={() => canvas.reset()}
			class={button}
		>
			<RotateCcw class="size-4" />
		</button>
	{/if}
</div>
