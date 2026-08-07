<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import { edgePath, getCanvasContext, type CanvasPoint, type EdgePathType } from './ctx.svelte';

	const uid = $props.id();
	const markerId = `canvas-edge-arrow-${uid}`;

	let {
		from,
		to,
		fromNode,
		toNode,
		type = 'bezier',
		strokeWidth = 2,
		animated = false,
		arrow = true,
		selected = false,
		class: className,
		label,
		...rest
	}: {
		/** Explicit endpoints in canvas space. Ignored when the node variants are set. */
		from?: CanvasPoint;
		to?: CanvasPoint;
		/** Anchor to a registered node instead — right edge to left edge. */
		fromNode?: string;
		toNode?: string;
		type?: EdgePathType;
		strokeWidth?: number;
		animated?: boolean;
		arrow?: boolean;
		selected?: boolean;
		class?: string;
		label?: Snippet;
		[key: string]: unknown;
	} = $props();

	const canvas = getCanvasContext('Canvas.Edge');

	/** Right edge of the source node, left edge of the target — the usual graph flow. */
	function anchor(id: string | undefined, side: 'source' | 'target') {
		if (!id) return null;
		const rect = canvas.nodes[id];
		if (!rect) return null;

		return {
			x: side === 'source' ? rect.x + rect.width : rect.x,
			y: rect.y + rect.height / 2
		};
	}

	const start = $derived(anchor(fromNode, 'source') ?? from ?? { x: 0, y: 0 });
	const end = $derived(anchor(toNode, 'target') ?? to ?? { x: 0, y: 0 });
	const d = $derived(edgePath(start, end, type));
	const midpoint = $derived({ x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 });
</script>

<!-- A 1x1 SVG with visible overflow lets the path use raw canvas coordinates
     without every edge having to size itself to the graph. -->
<svg
	width="1"
	height="1"
	class={cn('pointer-events-none absolute left-0 top-0 overflow-visible', className)}
	aria-hidden="true"
	{...rest}
>
	{#if arrow}
		<defs>
			<marker
				id={markerId}
				viewBox="0 0 10 10"
				refX="9"
				refY="5"
				markerWidth="6"
				markerHeight="6"
				markerUnits="strokeWidth"
				orient="auto-start-reverse"
			>
				<path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
			</marker>
		</defs>
	{/if}

	<path
		{d}
		fill="none"
		stroke="currentColor"
		stroke-width={strokeWidth}
		stroke-linecap="round"
		marker-end={arrow ? `url(#${markerId})` : undefined}
		class={cn(
			'text-muted-foreground/60 transition-colors',
			selected && 'text-primary',
			animated && 'animate-[canvas-edge-dash_1s_linear_infinite] [stroke-dasharray:6_4]'
		)}
	/>
</svg>

{#if label}
	<div
		class="pointer-events-auto absolute left-0 top-0"
		style:transform="translate({midpoint.x}px, {midpoint.y}px) translate(-50%, -50%)"
	>
		<span class="rounded-full border bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
			{@render label()}
		</span>
	</div>
{/if}

<style>
	/* Global so the Tailwind arbitrary animation can reference it by name. */
	@keyframes -global-canvas-edge-dash {
		to {
			stroke-dashoffset: -10;
		}
	}
</style>
