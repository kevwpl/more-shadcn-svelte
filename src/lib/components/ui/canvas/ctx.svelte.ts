import { getContext, setContext } from 'svelte';

const CANVAS_CTX_KEY = Symbol('canvas-ctx');

export type CanvasPoint = { x: number; y: number };
export type CanvasRect = { x: number; y: number; width: number; height: number };

export type CanvasContext = {
	/** Pan offset in screen pixels. */
	readonly x: number;
	readonly y: number;
	/** Scale factor. 1 means one canvas unit is one CSS pixel. */
	readonly zoom: number;
	readonly minZoom: number;
	readonly maxZoom: number;
	readonly snap: number;
	readonly panning: boolean;
	readonly viewport: HTMLElement | null;
	/** Un-transformed layer above the canvas, for chrome that must not pan or scale. */
	readonly overlay: HTMLElement | null;
	/** Bounding box of every registered node, in canvas space. */
	readonly nodes: Record<string, CanvasRect>;

	/** Converts client (screen) coordinates into canvas space. */
	toCanvas: (clientX: number, clientY: number) => CanvasPoint;
	/** Converts canvas coordinates into client (screen) space. */
	toScreen: (point: CanvasPoint) => CanvasPoint;

	panBy: (dx: number, dy: number) => void;
	panTo: (x: number, y: number) => void;
	zoomBy: (factor: number, origin?: CanvasPoint) => void;
	zoomTo: (zoom: number, origin?: CanvasPoint) => void;
	fitView: (padding?: number) => void;
	reset: () => void;

	registerNode: (id: string, rect: CanvasRect) => void;
	unregisterNode: (id: string) => void;
};

export function setCanvasContext(ctx: CanvasContext) {
	setContext(CANVAS_CTX_KEY, ctx);
	return ctx;
}

export function getCanvasContext(component = 'This component') {
	const ctx = getContext<CanvasContext | undefined>(CANVAS_CTX_KEY);
	if (!ctx) throw new Error(`${component} must be used inside a Canvas.Root`);
	return ctx;
}

export const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

export function snapTo(value: number, step: number) {
	return step > 0 ? Math.round(value / step) * step : value;
}

/** Union of every node box, or null when there is nothing to fit. */
export function nodeBounds(nodes: Record<string, CanvasRect>): CanvasRect | null {
	const list = Object.values(nodes);
	if (list.length === 0) return null;

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const node of list) {
		minX = Math.min(minX, node.x);
		minY = Math.min(minY, node.y);
		maxX = Math.max(maxX, node.x + node.width);
		maxY = Math.max(maxY, node.y + node.height);
	}

	return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export type EdgePathType = 'bezier' | 'smoothstep' | 'straight';

/**
 * Builds an edge path between two canvas points. Bezier and smoothstep both
 * leave horizontally, which is what makes node graphs read left to right.
 */
export function edgePath(from: CanvasPoint, to: CanvasPoint, type: EdgePathType = 'bezier') {
	const round = (n: number) => Math.round(n * 10) / 10;
	const x1 = round(from.x);
	const y1 = round(from.y);
	const x2 = round(to.x);
	const y2 = round(to.y);

	if (type === 'straight') return `M${x1} ${y1} L${x2} ${y2}`;

	if (type === 'smoothstep') {
		const midX = round((x1 + x2) / 2);
		const radius = Math.min(12, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2);
		if (radius < 1) return `M${x1} ${y1} L${x2} ${y2}`;

		const dirY = y2 > y1 ? 1 : -1;
		const dirX = x2 > x1 ? 1 : -1;
		return [
			`M${x1} ${y1}`,
			`L${round(midX - radius * dirX)} ${y1}`,
			`Q${midX} ${y1} ${midX} ${round(y1 + radius * dirY)}`,
			`L${midX} ${round(y2 - radius * dirY)}`,
			`Q${midX} ${y2} ${round(midX + radius * dirX)} ${y2}`,
			`L${x2} ${y2}`
		].join(' ');
	}

	const curve = Math.max(40, Math.abs(x2 - x1) * 0.5);
	return `M${x1} ${y1} C${round(x1 + curve)} ${y1}, ${round(x2 - curve)} ${y2}, ${x2} ${y2}`;
}
