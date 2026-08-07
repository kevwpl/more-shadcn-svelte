<script lang="ts">
	import { cn } from '$lib/utils';
	import { untrack, type Snippet } from 'svelte';
	import {
		clamp,
		nodeBounds,
		setCanvasContext,
		type CanvasPoint,
		type CanvasRect
	} from './ctx.svelte';

	let {
		x = $bindable(0),
		y = $bindable(0),
		zoom = $bindable(1),
		minZoom = 0.2,
		maxZoom = 3,
		zoomSpeed = 0.0015,
		grid = 'dots',
		gridSize = 24,
		snap = 0,
		pannable = true,
		zoomable = true,
		panOnMiddleClick = true,
		class: className,
		onpan,
		onzoom,
		children,
		...rest
	}: {
		/** Pan offset in screen pixels. */
		x?: number;
		y?: number;
		zoom?: number;
		minZoom?: number;
		maxZoom?: number;
		zoomSpeed?: number;
		grid?: 'dots' | 'lines' | 'none';
		gridSize?: number;
		/** Grid step nodes snap to while dragging. 0 disables snapping. */
		snap?: number;
		pannable?: boolean;
		zoomable?: boolean;
		panOnMiddleClick?: boolean;
		class?: string;
		onpan?: (offset: CanvasPoint) => void;
		onzoom?: (zoom: number) => void;
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	let viewport = $state<HTMLDivElement | null>(null);
	let overlay = $state<HTMLDivElement | null>(null);
	let panning = $state(false);
	let spaceHeld = $state(false);
	let nodes = $state<Record<string, CanvasRect>>({});

	let panStart: { x: number; y: number; originX: number; originY: number } | null = null;

	function toCanvas(clientX: number, clientY: number): CanvasPoint {
		const rect = viewport?.getBoundingClientRect();
		if (!rect) return { x: 0, y: 0 };
		return { x: (clientX - rect.left - x) / zoom, y: (clientY - rect.top - y) / zoom };
	}

	function toScreen(point: CanvasPoint): CanvasPoint {
		return { x: point.x * zoom + x, y: point.y * zoom + y };
	}

	function panBy(dx: number, dy: number) {
		x += dx;
		y += dy;
		onpan?.({ x, y });
	}

	function panTo(nextX: number, nextY: number) {
		x = nextX;
		y = nextY;
		onpan?.({ x, y });
	}

	/**
	 * Scales around a viewport-relative origin so the point under the cursor
	 * stays put. Defaults to the centre when no origin is given.
	 */
	function zoomTo(next: number, origin?: CanvasPoint) {
		const rect = viewport?.getBoundingClientRect();
		const target = clamp(next, minZoom, maxZoom);
		if (target === zoom) return;

		const pivot = origin ?? { x: (rect?.width ?? 0) / 2, y: (rect?.height ?? 0) / 2 };
		const ratio = target / zoom;

		x = pivot.x - (pivot.x - x) * ratio;
		y = pivot.y - (pivot.y - y) * ratio;
		zoom = target;

		onzoom?.(zoom);
		onpan?.({ x, y });
	}

	function zoomBy(factor: number, origin?: CanvasPoint) {
		zoomTo(zoom * factor, origin);
	}

	function fitView(padding = 48) {
		const rect = viewport?.getBoundingClientRect();
		const bounds = nodeBounds(nodes);
		if (!rect || !bounds || bounds.width === 0 || bounds.height === 0) return;

		const next = clamp(
			Math.min(
				(rect.width - padding * 2) / bounds.width,
				(rect.height - padding * 2) / bounds.height
			),
			minZoom,
			maxZoom
		);

		zoom = next;
		x = rect.width / 2 - (bounds.x + bounds.width / 2) * next;
		y = rect.height / 2 - (bounds.y + bounds.height / 2) * next;

		onzoom?.(zoom);
		onpan?.({ x, y });
	}

	function reset() {
		zoom = 1;
		panTo(0, 0);
		onzoom?.(zoom);
	}

	setCanvasContext({
		get x() {
			return x;
		},
		get y() {
			return y;
		},
		get zoom() {
			return zoom;
		},
		get minZoom() {
			return minZoom;
		},
		get maxZoom() {
			return maxZoom;
		},
		get snap() {
			return snap;
		},
		get panning() {
			return panning;
		},
		get viewport() {
			return viewport;
		},
		get overlay() {
			return overlay;
		},
		get nodes() {
			return nodes;
		},
		toCanvas,
		toScreen,
		panBy,
		panTo,
		zoomBy,
		zoomTo,
		fitView,
		reset,
		// Nodes register from an effect that also writes to `nodes`, so the read
		// has to be untracked or the two would trigger each other forever.
		registerNode: (id, rect) => {
			nodes = { ...untrack(() => nodes), [id]: rect };
		},
		unregisterNode: (id) => {
			const { [id]: _removed, ...remaining } = untrack(() => nodes);
			nodes = remaining;
		}
	});

	function handleWheel(e: WheelEvent) {
		if (!zoomable) return;
		e.preventDefault();

		const rect = viewport!.getBoundingClientRect();
		const origin = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		// Exponential so a trackpad and a mouse wheel feel the same at any scale.
		zoomTo(zoom * Math.exp(-e.deltaY * zoomSpeed), origin);
	}

	function handlePointerDown(e: PointerEvent) {
		if (!pannable) return;

		const middle = panOnMiddleClick && e.button === 1;
		const left = e.button === 0;
		if (!middle && !left) return;

		// A left drag only pans from the background, so nodes keep their own drag.
		if (left && e.target !== e.currentTarget && !spaceHeld) return;

		e.preventDefault();
		panning = true;
		panStart = { x: e.clientX, y: e.clientY, originX: x, originY: y };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!panning || !panStart) return;
		panTo(panStart.originX + (e.clientX - panStart.x), panStart.originY + (e.clientY - panStart.y));
	}

	function handlePointerUp(e: PointerEvent) {
		if (!panning) return;
		panning = false;
		panStart = null;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.code === 'Space' && !spaceHeld) {
			spaceHeld = true;
			e.preventDefault();
		}
	}

	const gridStyle = $derived.by(() => {
		if (grid === 'none') return '';

		const step = gridSize * zoom;
		const position = `${x}px ${y}px`;

		if (grid === 'lines') {
			return [
				`background-image: linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
				`background-size: ${step}px ${step}px`,
				`background-position: ${position}`
			].join(';');
		}

		const dot = clamp(zoom, 0.5, 2);
		return [
			`background-image: radial-gradient(currentColor ${dot}px, transparent ${dot}px)`,
			`background-size: ${step}px ${step}px`,
			`background-position: ${position}`
		].join(';');
	});
</script>

<svelte:window
	onkeydown={handleKeydown}
	onkeyup={(e) => {
		if (e.code === 'Space') spaceHeld = false;
	}}
/>

<div
	bind:this={viewport}
	role="application"
	aria-label="Canvas"
	tabindex="-1"
	onwheel={handleWheel}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	class={cn(
		'relative size-full touch-none overflow-hidden overscroll-none bg-background select-none',
		pannable && (panning ? 'cursor-grabbing' : spaceHeld ? 'cursor-grab' : 'cursor-default'),
		className
	)}
	{...rest}
>
	{#if grid !== 'none'}
		<!-- The grid lives in the background layer, so panning it is free. -->
		<div class="pointer-events-none absolute inset-0 text-border" style={gridStyle}></div>
	{/if}

	<!-- The layer itself is transparent to pointers so clicks on empty space reach
	     the viewport and start a pan. Children opt back in individually. -->
	<div
		class="pointer-events-none absolute left-0 top-0 origin-top-left"
		style:transform="translate({x}px, {y}px) scale({zoom})"
	>
		{@render children()}
	</div>

	<!-- Controls and the minimap move themselves in here, so they keep their own
	     size and position no matter how the canvas is panned or zoomed. -->
	<div bind:this={overlay} class="pointer-events-none absolute inset-0 z-20"></div>
</div>
