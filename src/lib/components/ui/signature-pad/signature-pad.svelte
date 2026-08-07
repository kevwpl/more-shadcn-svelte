<script lang="ts" module>
	export type SignaturePoint = { x: number; y: number; w: number };
	export type SignatureStroke = { color: string; points: SignaturePoint[] };

	export type SignatureSegment = {
		x0: number;
		y0: number;
		cx: number;
		cy: number;
		x1: number;
		y1: number;
		w: number;
	};

	const mid = (a: SignaturePoint, b: SignaturePoint) => ({
		x: (a.x + b.x) / 2,
		y: (a.y + b.y) / 2
	});

	/**
	 * Turns a stroke into quadratic segments (control point = the sampled point,
	 * endpoints = the midpoints of its neighbours). Shared by the canvas renderer
	 * and the SVG exporter so both produce the exact same curve.
	 */
	export function strokeToSegments(stroke: SignatureStroke): SignatureSegment[] {
		const p = stroke.points;
		if (p.length < 2) return [];

		const segments: SignatureSegment[] = [];
		let start = { x: p[0].x, y: p[0].y };

		for (let i = 1; i < p.length; i++) {
			const end = i === p.length - 1 ? { x: p[i].x, y: p[i].y } : mid(p[i], p[i + 1]);
			segments.push({
				x0: start.x,
				y0: start.y,
				cx: p[i].x,
				cy: p[i].y,
				x1: end.x,
				y1: end.y,
				w: p[i].w
			});
			start = end;
		}

		return segments;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let {
		strokes = $bindable([]),
		penColor = 'currentColor',
		backgroundColor = 'transparent',
		minWidth = 0.7,
		maxWidth = 2.6,
		velocityWeight = 0.7,
		disabled = false,
		class: className,
		onbegin,
		onend,
		onchange,
		...rest
	}: {
		strokes?: SignatureStroke[];
		penColor?: string;
		backgroundColor?: string;
		minWidth?: number;
		maxWidth?: number;
		velocityWeight?: number;
		disabled?: boolean;
		class?: string;
		onbegin?: () => void;
		onend?: (stroke: SignatureStroke) => void;
		onchange?: (strokes: SignatureStroke[]) => void;
		[key: string]: unknown;
	} = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);
	let ctx: CanvasRenderingContext2D | null = null;
	let size = $state({ width: 0, height: 0 });

	let drawing = false;
	let current: SignatureStroke | null = null;
	let lastWidth = maxWidth;
	let lastTime = 0;

	export const isEmpty = () => strokes.length === 0;

	const colorCache = new Map<string, string>();

	/**
	 * Normalises any CSS color to `#rrggbb` / `rgba()`. Themes resolve to modern
	 * color spaces such as `oklch()`, which older SVG viewers do not understand.
	 */
	function normalizeColor(color: string) {
		const cached = colorCache.get(color);
		if (cached) return cached;

		const probe = document.createElement('canvas');
		probe.width = probe.height = 1;
		const pctx = probe.getContext('2d', { willReadFrequently: true });

		let output = color;
		if (pctx) {
			pctx.fillStyle = color;
			pctx.fillRect(0, 0, 1, 1);
			const [r, g, b, a] = pctx.getImageData(0, 0, 1, 1).data;
			const hex = (n: number) => n.toString(16).padStart(2, '0');
			output =
				a === 255
					? `#${hex(r)}${hex(g)}${hex(b)}`
					: `rgba(${r}, ${g}, ${b}, ${Math.round((a / 255) * 1000) / 1000})`;
		}

		colorCache.set(color, output);
		return output;
	}

	/** Resolves `currentColor` against the canvas' inherited text color. */
	function resolvedPen() {
		if (penColor !== 'currentColor') return normalizeColor(penColor);
		return canvas ? normalizeColor(getComputedStyle(canvas).color) : '#000000';
	}

	function paintSegment(c: CanvasRenderingContext2D, seg: SignatureSegment, color: string) {
		c.strokeStyle = color;
		c.lineWidth = seg.w;
		c.lineCap = 'round';
		c.lineJoin = 'round';
		c.beginPath();
		c.moveTo(seg.x0, seg.y0);
		c.quadraticCurveTo(seg.cx, seg.cy, seg.x1, seg.y1);
		c.stroke();
	}

	function paintDot(c: CanvasRenderingContext2D, p: SignaturePoint, color: string) {
		c.fillStyle = color;
		c.beginPath();
		c.arc(p.x, p.y, Math.max(p.w, minWidth) / 2, 0, Math.PI * 2);
		c.fill();
	}

	function redraw() {
		if (!ctx || !canvas) return;

		ctx.clearRect(0, 0, size.width, size.height);

		if (backgroundColor !== 'transparent') {
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, size.width, size.height);
		}

		for (const stroke of strokes) {
			const color = stroke.color === 'currentColor' ? resolvedPen() : stroke.color;
			if (stroke.points.length === 1) {
				paintDot(ctx, stroke.points[0], color);
				continue;
			}
			for (const seg of strokeToSegments(stroke)) paintSegment(ctx, seg, color);
		}
	}

	function resize() {
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const ratio = window.devicePixelRatio || 1;

		size = { width: rect.width, height: rect.height };
		canvas.width = Math.round(rect.width * ratio);
		canvas.height = Math.round(rect.height * ratio);

		ctx = canvas.getContext('2d');
		ctx?.scale(ratio, ratio);
		redraw();
	}

	/** Pressure when the device reports it, otherwise a velocity taper. */
	function widthFor(point: { x: number; y: number }, pressure: number, now: number) {
		if (pressure > 0 && pressure !== 0.5) {
			return minWidth + (maxWidth - minWidth) * pressure;
		}

		const last = current?.points.at(-1);
		if (!last) return maxWidth;

		const dt = Math.max(now - lastTime, 1);
		const distance = Math.hypot(point.x - last.x, point.y - last.y);
		const velocity = distance / dt;
		const target = Math.max(maxWidth - velocity * 4, minWidth);

		return velocityWeight * target + (1 - velocityWeight) * lastWidth;
	}

	function positionOf(e: PointerEvent) {
		const rect = canvas!.getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	function addPoint(e: PointerEvent) {
		if (!current || !ctx) return;

		const pos = positionOf(e);
		const now = e.timeStamp;
		const w = widthFor(pos, e.pressure, now);

		lastWidth = w;
		lastTime = now;
		current.points.push({ ...pos, w });

		// Draw only the newest segment so live strokes stay cheap.
		const segments = strokeToSegments(current);
		const seg = segments.at(-1);
		if (seg) paintSegment(ctx, seg, resolvedPen());
	}

	function handlePointerDown(e: PointerEvent) {
		if (disabled || e.button !== 0) return;

		canvas?.setPointerCapture(e.pointerId);
		drawing = true;
		lastWidth = maxWidth;
		lastTime = e.timeStamp;

		const pos = positionOf(e);
		current = { color: penColor, points: [{ ...pos, w: maxWidth }] };
		onbegin?.();
	}

	function handlePointerMove(e: PointerEvent) {
		if (!drawing) return;
		e.preventDefault();

		const events = e.getCoalescedEvents?.() ?? [];
		if (events.length > 0) for (const ev of events) addPoint(ev);
		else addPoint(e);
	}

	function handlePointerUp(e: PointerEvent) {
		if (!drawing || !current) return;

		drawing = false;
		canvas?.releasePointerCapture(e.pointerId);

		if (current.points.length === 1 && ctx) {
			paintDot(ctx, current.points[0], resolvedPen());
		}

		const finished = current;
		current = null;
		strokes = [...strokes, finished];

		onend?.(finished);
		onchange?.(strokes);
	}

	export function clear() {
		strokes = [];
		current = null;
		redraw();
		onchange?.(strokes);
	}

	export function undo() {
		if (strokes.length === 0) return;
		strokes = strokes.slice(0, -1);
		redraw();
		onchange?.(strokes);
	}

	export function toDataURL(type = 'image/png', quality?: number) {
		if (!canvas) return '';
		if (backgroundColor !== 'transparent' || type === 'image/png') {
			return canvas.toDataURL(type, quality);
		}

		// JPEG has no alpha channel, so flatten onto white first.
		const flat = document.createElement('canvas');
		flat.width = canvas.width;
		flat.height = canvas.height;
		const fctx = flat.getContext('2d')!;
		fctx.fillStyle = '#ffffff';
		fctx.fillRect(0, 0, flat.width, flat.height);
		fctx.drawImage(canvas, 0, 0);
		return flat.toDataURL(type, quality);
	}

	export function toSVG() {
		const { width, height } = size;
		const round = (n: number) => Math.round(n * 100) / 100;
		const parts: string[] = [];

		if (backgroundColor !== 'transparent') {
			parts.push(
				`<rect width="${round(width)}" height="${round(height)}" fill="${normalizeColor(backgroundColor)}"/>`
			);
		}

		for (const stroke of strokes) {
			const color = stroke.color === 'currentColor' ? resolvedPen() : stroke.color;

			if (stroke.points.length === 1) {
				const p = stroke.points[0];
				parts.push(
					`<circle cx="${round(p.x)}" cy="${round(p.y)}" r="${round(Math.max(p.w, minWidth) / 2)}" fill="${color}"/>`
				);
				continue;
			}

			for (const seg of strokeToSegments(stroke)) {
				parts.push(
					`<path d="M${round(seg.x0)} ${round(seg.y0)} Q${round(seg.cx)} ${round(seg.cy)} ${round(seg.x1)} ${round(seg.y1)}" fill="none" stroke="${color}" stroke-width="${round(seg.w)}" stroke-linecap="round"/>`
				);
			}
		}

		return `<svg xmlns="http://www.w3.org/2000/svg" width="${round(width)}" height="${round(height)}" viewBox="0 0 ${round(width)} ${round(height)}">${parts.join('')}</svg>`;
	}

	export function toSVGDataURL() {
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(toSVG())}`;
	}

	onMount(() => {
		resize();

		const observer = new ResizeObserver(resize);
		if (canvas) observer.observe(canvas);

		return () => observer.disconnect();
	});

	// Re-render when the stroke list is replaced from the outside.
	$effect(() => {
		strokes;
		if (!drawing) redraw();
	});
</script>

<canvas
	bind:this={canvas}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	onpointerleave={(e) => drawing && handlePointerUp(e)}
	class={cn(
		'h-48 w-full touch-none rounded-md border border-input bg-background',
		disabled ? 'cursor-not-allowed opacity-60' : 'cursor-crosshair',
		className
	)}
	{...rest}
></canvas>
