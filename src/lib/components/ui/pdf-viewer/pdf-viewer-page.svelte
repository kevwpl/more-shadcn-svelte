<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { PDFPageProxy } from 'pdfjs-dist';
	import { effectiveRotation, getPdfViewerContext, PDF_TO_CSS } from './ctx.svelte';

	/** Browsers refuse or silently blank canvases past roughly this many pixels. */
	const MAX_CANVAS_PIXELS = 16_777_216;

	let {
		pageNumber,
		scale = 1,
		width,
		rotation = 0,
		root = null,
		rootMargin = '100% 0px',
		class: className,
		...rest
	}: {
		pageNumber: number;
		/** Zoom, where 1 is the physical page size. Ignored when `width` is set. */
		scale?: number;
		/** Render to this CSS width instead of a zoom — used by thumbnails. */
		width?: number;
		rotation?: number;
		/** The scroll container, so pages just outside it can render ahead of time. */
		root?: Element | null;
		rootMargin?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const ctx = getPdfViewerContext('PdfViewer.Page');

	let proxy = $state.raw<PDFPageProxy | null>(null);
	let frame = $state<HTMLDivElement | null>(null);
	let canvas = $state<HTMLCanvasElement | null>(null);
	let visible = $state(false);

	$effect(() => {
		const doc = ctx.doc;
		const n = pageNumber;
		proxy = null;
		if (!doc) return;

		let cancelled = false;
		doc
			.getPage(n)
			.then((p) => {
				if (!cancelled) proxy = p;
			})
			.catch(() => {
				// The document was torn down mid-request; nothing to draw.
			});

		return () => {
			cancelled = true;
		};
	});

	/** This page at 100%. Falls back to the first page's size until it has loaded. */
	const unit = $derived.by(() => {
		if (!proxy) return ctx.baseSize;
		const viewport = proxy.getViewport({
			scale: PDF_TO_CSS,
			rotation: effectiveRotation(proxy.rotate, rotation)
		});
		return { width: viewport.width, height: viewport.height };
	});

	// Report this page's real size once known, so fit-to-width can use the widest page.
	$effect(() => {
		if (proxy && unit) ctx.reportPageSize(pageNumber, unit);
	});

	const zoom = $derived(width && unit ? width / unit.width : scale);
	const size = $derived(unit ? { width: unit.width * zoom, height: unit.height * zoom } : null);

	// Only pages near the viewport hold a bitmap; the rest stay empty frames.
	$effect(() => {
		if (!frame) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
			},
			{ root, rootMargin }
		);
		observer.observe(frame);
		return () => observer.disconnect();
	});

	$effect(() => {
		const page = proxy;
		const target = canvas;
		const isVisible = visible;
		const renderZoom = zoom;
		const extraRotation = rotation;

		if (!page || !target) return;

		if (!isVisible) {
			// Release the bitmap — a long document would otherwise keep every page in memory.
			target.width = 0;
			target.height = 0;
			return;
		}

		const viewport = page.getViewport({
			scale: renderZoom * PDF_TO_CSS,
			rotation: effectiveRotation(page.rotate, extraRotation)
		});

		// Render at device resolution for crisp text, but back off at extreme zoom
		// rather than exceed what the browser will allocate.
		const ratio = window.devicePixelRatio || 1;
		const output = Math.min(
			ratio,
			Math.sqrt(MAX_CANVAS_PIXELS / (viewport.width * viewport.height))
		);

		// Draw offscreen and swap in when done, so the old bitmap stays up while
		// re-rendering after a zoom instead of the page flashing blank.
		const offscreen = document.createElement('canvas');
		offscreen.width = Math.floor(viewport.width * output);
		offscreen.height = Math.floor(viewport.height * output);

		const task = page.render({
			canvas: offscreen,
			viewport,
			transform: output !== 1 ? [output, 0, 0, output, 0, 0] : undefined
		});

		let cancelled = false;
		task.promise
			.then(() => {
				if (cancelled) return;
				target.width = offscreen.width;
				target.height = offscreen.height;
				target.getContext('2d')?.drawImage(offscreen, 0, 0);
			})
			.catch((reason: unknown) => {
				// Superseded by a newer render — expected while zooming.
				if ((reason as { name?: string })?.name === 'RenderingCancelledException') return;
				console.error(reason);
			});

		return () => {
			cancelled = true;
			task.cancel();
		};
	});
</script>

<div
	bind:this={frame}
	data-pdf-page={pageNumber}
	role="img"
	aria-label="Page {pageNumber}"
	style:width="{size?.width ?? 0}px"
	style:height="{size?.height ?? 0}px"
	class={cn('relative shrink-0 overflow-hidden bg-white', className)}
	{...rest}
>
	<canvas bind:this={canvas} class="block size-full"></canvas>
</div>
