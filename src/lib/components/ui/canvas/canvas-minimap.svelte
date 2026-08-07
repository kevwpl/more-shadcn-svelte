<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCanvasContext, nodeBounds } from './ctx.svelte';

	let {
		position = 'bottom-right',
		width = 160,
		height = 110,
		padding = 12,
		interactive = true,
		class: className,
		...rest
	}: {
		position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
		width?: number;
		height?: number;
		padding?: number;
		/** Click to centre the viewport on that spot. */
		interactive?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const canvas = getCanvasContext('Canvas.Minimap');

	let el = $state<HTMLDivElement | null>(null);

	// Rendered in the canvas overlay so it never pans or scales with the content.
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

	/** The visible region of the canvas, in canvas space. */
	const viewRect = $derived.by(() => {
		const rect = canvas.viewport?.getBoundingClientRect();
		if (!rect) return { x: 0, y: 0, width: 0, height: 0 };

		return {
			x: -canvas.x / canvas.zoom,
			y: -canvas.y / canvas.zoom,
			width: rect.width / canvas.zoom,
			height: rect.height / canvas.zoom
		};
	});

	/** Fit the nodes *and* the current viewport, so the map never loses either. */
	const world = $derived.by(() => {
		const bounds = nodeBounds(canvas.nodes);
		const view = viewRect;
		if (!bounds) return view.width ? view : { x: 0, y: 0, width: 1, height: 1 };

		const minX = Math.min(bounds.x, view.x);
		const minY = Math.min(bounds.y, view.y);
		const maxX = Math.max(bounds.x + bounds.width, view.x + view.width);
		const maxY = Math.max(bounds.y + bounds.height, view.y + view.height);

		return { x: minX, y: minY, width: maxX - minX || 1, height: maxY - minY || 1 };
	});

	const scale = $derived(
		Math.min((width - padding * 2) / world.width, (height - padding * 2) / world.height)
	);

	const project = (x: number, y: number) => ({
		x: (x - world.x) * scale + padding,
		y: (y - world.y) * scale + padding
	});

	const viewPoint = $derived(project(viewRect.x, viewRect.y));

	function handleClick(e: MouseEvent) {
		if (!interactive) return;

		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const viewportRect = canvas.viewport?.getBoundingClientRect();
		if (!viewportRect) return;

		// Undo the projection to find the canvas point that was clicked.
		const target = {
			x: (e.clientX - rect.left - padding) / scale + world.x,
			y: (e.clientY - rect.top - padding) / scale + world.y
		};

		canvas.panTo(
			viewportRect.width / 2 - target.x * canvas.zoom,
			viewportRect.height / 2 - target.y * canvas.zoom
		);
	}
</script>

<div
	bind:this={el}
	class={cn(
		'pointer-events-auto absolute z-20 overflow-hidden rounded-lg border bg-popover/90 shadow-sm backdrop-blur',
		POSITION[position],
		interactive && 'cursor-pointer',
		className
	)}
	style:width="{width}px"
	style:height="{height}px"
	role={interactive ? 'button' : 'img'}
	aria-label="Canvas minimap"
	tabindex={interactive ? 0 : undefined}
	onclick={handleClick}
	onkeydown={(e) => {
		if (e.key === 'Enter') canvas.fitView();
	}}
	{...rest}
>
	<svg {width} {height} class="block">
		{#each Object.entries(canvas.nodes) as [id, node] (id)}
			{@const p = project(node.x, node.y)}
			<rect
				x={p.x}
				y={p.y}
				width={Math.max(node.width * scale, 2)}
				height={Math.max(node.height * scale, 2)}
				rx="2"
				class="fill-muted-foreground/40"
			/>
		{/each}

		<rect
			x={viewPoint.x}
			y={viewPoint.y}
			width={viewRect.width * scale}
			height={viewRect.height * scale}
			rx="2"
			class="fill-primary/10 stroke-primary"
			stroke-width="1"
		/>
	</svg>
</div>
