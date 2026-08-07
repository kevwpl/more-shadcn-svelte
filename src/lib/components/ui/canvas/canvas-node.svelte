<script lang="ts">
	import { cn } from '$lib/utils';
	import { onDestroy, type Snippet } from 'svelte';
	import { getCanvasContext, snapTo, type CanvasPoint } from './ctx.svelte';

	const uid = $props.id();

	let {
		id = uid,
		x = $bindable(0),
		y = $bindable(0),
		selected = $bindable(false),
		draggable = true,
		selectable = true,
		width,
		height,
		class: className,
		ondragstart,
		ondrag,
		ondragend,
		children,
		...rest
	}: {
		id?: string;
		/** Position in canvas space. */
		x?: number;
		y?: number;
		selected?: boolean;
		draggable?: boolean;
		selectable?: boolean;
		width?: number;
		height?: number;
		class?: string;
		ondragstart?: (position: CanvasPoint) => void;
		ondrag?: (position: CanvasPoint) => void;
		ondragend?: (position: CanvasPoint) => void;
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	const canvas = getCanvasContext('Canvas.Node');

	let measuredWidth = $state(0);
	let measuredHeight = $state(0);
	let dragging = $state(false);
	let start: { pointerX: number; pointerY: number; x: number; y: number } | null = null;

	// Keep the shared node map in sync so fitView and the minimap have real boxes.
	// Removal is left to onDestroy: an effect cleanup would deregister and
	// re-register on every pointer move while dragging.
	$effect(() => {
		canvas.registerNode(id, {
			x,
			y,
			width: width ?? measuredWidth,
			height: height ?? measuredHeight
		});
	});

	onDestroy(() => canvas.unregisterNode(id));

	/**
	 * Controls inside a node have to keep working. Capturing the pointer would
	 * retarget the click to the node, and preventDefault would block focus, so
	 * a press that starts on one is left alone entirely.
	 */
	const INTERACTIVE =
		'button, a, input, textarea, select, [contenteditable="true"], [data-no-drag]';

	function handlePointerDown(e: PointerEvent) {
		if (e.button !== 0) return;

		const hit = (e.target as HTMLElement | null)?.closest(INTERACTIVE);
		if (hit && hit !== e.currentTarget) return;

		if (selectable) selected = true;
		if (!draggable) return;

		// Stop the canvas from treating this as a background drag.
		e.stopPropagation();
		e.preventDefault();

		dragging = true;
		start = { pointerX: e.clientX, pointerY: e.clientY, x, y };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		ondragstart?.({ x, y });
	}

	function handlePointerMove(e: PointerEvent) {
		if (!dragging || !start) return;

		// Screen deltas have to be divided by the zoom to stay under the cursor.
		const nextX = start.x + (e.clientX - start.pointerX) / canvas.zoom;
		const nextY = start.y + (e.clientY - start.pointerY) / canvas.zoom;

		x = snapTo(nextX, canvas.snap);
		y = snapTo(nextY, canvas.snap);
		ondrag?.({ x, y });
	}

	function handlePointerUp(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		start = null;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		ondragend?.({ x, y });
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!draggable) return;

		const step = e.shiftKey ? 10 : canvas.snap || 1;
		const moves: Record<string, [number, number]> = {
			ArrowLeft: [-step, 0],
			ArrowRight: [step, 0],
			ArrowUp: [0, -step],
			ArrowDown: [0, step]
		};

		const move = moves[e.key];
		if (!move) return;

		e.preventDefault();
		x += move[0];
		y += move[1];
		ondrag?.({ x, y });
	}
</script>

<div
	bind:clientWidth={measuredWidth}
	bind:clientHeight={measuredHeight}
	role="button"
	tabindex="0"
	aria-pressed={selected}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	onkeydown={handleKeydown}
	style:transform="translate({x}px, {y}px)"
	style:width={width ? `${width}px` : undefined}
	style:height={height ? `${height}px` : undefined}
	class={cn(
		'pointer-events-auto absolute left-0 top-0 touch-none outline-none',
		draggable && (dragging ? 'cursor-grabbing' : 'cursor-grab'),
		selected && 'z-10',
		className
	)}
	{...rest}
>
	{@render children()}
</div>
