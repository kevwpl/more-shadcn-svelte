import { getContext, setContext } from 'svelte';
import type { PDFDocumentProxy } from 'pdfjs-dist';

const PDF_VIEWER_CTX_KEY = Symbol('pdf-viewer-ctx');

/** PDF units are points (1/72 in); CSS pixels are 1/96 in. */
export const PDF_TO_CSS = 96 / 72;

export type PdfSource = string | URL | ArrayBuffer | Uint8Array;

/** `width` and `page` keep re-fitting as the viewer resizes; `none` keeps the manual zoom. */
export type PdfFit = 'width' | 'page' | 'none';

export type PdfSize = { width: number; height: number };

export type PdfViewerContext = {
	readonly doc: PDFDocumentProxy | null;
	readonly numPages: number;
	readonly loading: boolean;
	readonly error: Error | null;

	/** 1-based. Setting it scrolls the pages to that page. */
	page: number;
	/** 1 means 100%, i.e. the page's physical size. Setting it switches `fit` to `none`. */
	scale: number;
	/** Extra clockwise rotation on top of the document's own, in multiples of 90. */
	rotation: number;
	fit: PdfFit;
	sidebar: boolean;

	readonly minScale: number;
	readonly maxScale: number;
	/** Size of the first page at 100%, with rotation applied — the basis for fitting. */
	readonly baseSize: PdfSize | null;
	/** The viewer is too narrow for a thumbnail sidebar to leave room for the pages. */
	readonly compact: boolean;

	goTo: (page: number) => void;
	next: () => void;
	prev: () => void;
	zoomIn: () => void;
	zoomOut: () => void;
	rotate: (direction?: 1 | -1) => void;
	download: () => Promise<void>;

	/** Wiring between the root and the pages view. */
	setViewportSize: (size: PdfSize) => void;
	registerScroller: (scrollTo: (page: number) => void) => () => void;
	/** Each page reports its 100% size, so fitting can account for the widest one. */
	reportPageSize: (page: number, size: PdfSize) => void;
	reportVisiblePage: (page: number) => void;
};

export function setPdfViewerContext(ctx: PdfViewerContext) {
	setContext(PDF_VIEWER_CTX_KEY, ctx);
	return ctx;
}

export function getPdfViewerContext(component = 'This component') {
	const ctx = getContext<PdfViewerContext | undefined>(PDF_VIEWER_CTX_KEY);
	if (!ctx) throw new Error(`${component} must be used inside a PdfViewer.Root`);
	return ctx;
}

export const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

/** The rotation pdf.js should render with: the page's own plus the user's. */
export function effectiveRotation(pageRotate: number, extra: number) {
	return (((pageRotate + extra) % 360) + 360) % 360;
}

/** Zoom steps that feel even — 10% steps are too fine at 300% and too coarse at 30%. */
export const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];

export function nextZoom(current: number, direction: 1 | -1, min: number, max: number) {
	const steps = ZOOM_STEPS.filter((s) => s >= min && s <= max);
	const next =
		direction > 0
			? steps.find((s) => s > current + 0.001)
			: [...steps].reverse().find((s) => s < current - 0.001);
	return clamp(next ?? current, min, max);
}
