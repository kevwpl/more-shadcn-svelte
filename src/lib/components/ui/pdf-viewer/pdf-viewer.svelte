<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { untrack, type Snippet } from 'svelte';
	import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
	import { cdnAssets, loadPdfjs } from './pdfjs';
	import {
		clamp,
		nextZoom,
		PDF_TO_CSS,
		setPdfViewerContext,
		type PdfFit,
		type PdfSize,
		type PdfSource
	} from './ctx.svelte';
	import PdfViewerToolbar from './pdf-viewer-toolbar.svelte';
	import PdfViewerPages from './pdf-viewer-pages.svelte';
	import PdfViewerThumbnails from './pdf-viewer-thumbnails.svelte';

	let {
		src,
		page = $bindable(1),
		scale = $bindable(1),
		rotation = $bindable(0),
		fit = $bindable<PdfFit>('width'),
		sidebar = $bindable(false),
		minScale = 0.25,
		maxScale = 4,
		password,
		filename = 'document.pdf',
		standardFontDataUrl,
		cMapUrl,
		wasmUrl,
		class: className,
		onload,
		onerror,
		children,
		...rest
	}: {
		/** A URL, or the raw bytes. Bytes are copied, so your buffer stays usable. */
		src: PdfSource | null | undefined;
		page?: number;
		scale?: number;
		rotation?: number;
		fit?: PdfFit;
		/** Whether the default layout shows the thumbnail sidebar. */
		sidebar?: boolean;
		minScale?: number;
		maxScale?: number;
		password?: string;
		/** Name used by the download control. */
		filename?: string;
		/** pdf.js asset locations. Default to the CDN copy matching the installed version. */
		standardFontDataUrl?: string;
		cMapUrl?: string;
		wasmUrl?: string;
		class?: string;
		onload?: (doc: PDFDocumentProxy) => void;
		onerror?: (error: Error) => void;
		/** Compose your own layout from the parts. Leave empty for the default viewer. */
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	// Raw: the proxy is a large class instance that must not be deeply proxied.
	let doc = $state.raw<PDFDocumentProxy | null>(null);
	let loading = $state(false);
	let error = $state<Error | null>(null);
	/** First page at 100%, with the document's own rotation but not the user's. */
	let firstPage = $state<PdfSize | null>(null);
	let viewportSize = $state<PdfSize>({ width: 0, height: 0 });
	let rootWidth = $state(0);

	/**
	 * Below this width a 160px thumbnail column leaves too little room for the
	 * pages, so the default layout drops it. Measured on the viewer itself
	 * rather than the screen, since it can sit in a container of any width.
	 */
	const COMPACT_BELOW = 560;
	const compact = $derived(rootWidth > 0 && rootWidth < COMPACT_BELOW);

	/** Last page the pages view reported as on screen. */
	let visiblePage = $state(1);
	let scroller: ((page: number) => void) | null = null;

	const numPages = $derived(doc?.numPages ?? 0);

	const baseSize = $derived.by(() => {
		if (!firstPage) return null;
		const sideways = (((rotation % 360) + 360) % 360) % 180 !== 0;
		return sideways
			? { width: firstPage.height, height: firstPage.width }
			: { width: firstPage.width, height: firstPage.height };
	});

	/** Sizes reported by each page as it loads, at 100% with rotation applied. */
	let pageSizes = $state<Record<number, PdfSize>>({});

	/**
	 * What fitting is measured against: the widest and tallest page, not just
	 * the first. Fitting to the first page lets a wider page in a mixed
	 * document overflow, which pushes every other page off-centre.
	 */
	const fitSize = $derived.by(() => {
		if (!baseSize) return null;
		let width = baseSize.width;
		let height = baseSize.height;
		for (const size of Object.values(pageSizes)) {
			width = Math.max(width, size.width);
			height = Math.max(height, size.height);
		}
		return { width, height };
	});

	$effect(() => {
		const source = src;
		// Read synchronously so a change to any of them reloads the document.
		const options = { password, standardFontDataUrl, cMapUrl, wasmUrl };

		if (!source) {
			doc = null;
			firstPage = null;
			return;
		}

		let cancelled = false;
		let task: PDFDocumentLoadingTask | null = null;
		loading = true;
		error = null;

		loadPdfjs()
			.then(async (lib) => {
				if (cancelled) return;

				const assets = cdnAssets(lib.version);
				// pdf.js transfers byte input to its worker, which detaches the
				// buffer — copy it so the caller's data stays usable.
				const input =
					typeof source === 'string' || source instanceof URL
						? { url: source }
						: {
								data:
									source instanceof ArrayBuffer ? new Uint8Array(source.slice(0)) : source.slice()
							};

				task = lib.getDocument({
					...input,
					password: options.password,
					standardFontDataUrl: options.standardFontDataUrl ?? assets.standardFontDataUrl,
					cMapUrl: options.cMapUrl ?? assets.cMapUrl,
					cMapPacked: true,
					wasmUrl: options.wasmUrl ?? assets.wasmUrl
				});

				const loaded = await task.promise;
				const first = await loaded.getPage(1);
				if (cancelled) return;

				const viewport = first.getViewport({ scale: PDF_TO_CSS });
				firstPage = { width: viewport.width, height: viewport.height };
				doc = loaded;
				loading = false;

				const start = clamp(
					untrack(() => page),
					1,
					loaded.numPages
				);
				visiblePage = 1;
				page = start;

				onload?.(loaded);
			})
			.catch((reason: unknown) => {
				if (cancelled) return;
				error = reason instanceof Error ? reason : new Error(String(reason));
				doc = null;
				loading = false;
				onerror?.(error);
			});

		return () => {
			cancelled = true;
			// Destroying the loading task also tears down its document and worker port.
			task?.destroy();
			doc = null;
			firstPage = null;
			pageSizes = {};
		};
	});

	// Keep the zoom fitted while a fit mode is active. Writes `scale` without
	// reading it, so it never feeds back into itself.
	$effect(() => {
		if (fit === 'none' || !fitSize || !viewportSize.width) return;

		// Matches the padding around the pages in PdfViewer.Pages.
		const gutter = 32;
		const byWidth = (viewportSize.width - gutter) / fitSize.width;
		const byHeight = (viewportSize.height - gutter) / fitSize.height;
		const next = fit === 'width' ? byWidth : Math.min(byWidth, byHeight);

		scale = clamp(Math.floor(next * 100) / 100, minScale, maxScale);
	});

	// A page change that did not come from scrolling — a control, or the bound
	// prop — scrolls the view. Scrolling reports `visiblePage` first, so it
	// never triggers a scroll of its own.
	$effect(() => {
		const target = page;
		if (!doc) return;
		if (target !== untrack(() => visiblePage)) scroller?.(target);
	});

	function goTo(next: number) {
		page = clamp(Math.round(next), 1, Math.max(numPages, 1));
	}

	async function download() {
		if (!doc) return;

		const data = await doc.getData();
		const url = URL.createObjectURL(new Blob([data as BlobPart], { type: 'application/pdf' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	setPdfViewerContext({
		get doc() {
			return doc;
		},
		get numPages() {
			return numPages;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get page() {
			return page;
		},
		set page(value) {
			goTo(value);
		},
		get scale() {
			return scale;
		},
		set scale(value) {
			// A manual zoom takes over from fitting.
			fit = 'none';
			scale = clamp(value, minScale, maxScale);
		},
		get rotation() {
			return rotation;
		},
		set rotation(value) {
			rotation = (((Math.round(value / 90) * 90) % 360) + 360) % 360;
		},
		get fit() {
			return fit;
		},
		set fit(value) {
			fit = value;
		},
		get sidebar() {
			return sidebar;
		},
		set sidebar(value) {
			sidebar = value;
		},
		get minScale() {
			return minScale;
		},
		get maxScale() {
			return maxScale;
		},
		get baseSize() {
			return baseSize;
		},
		get compact() {
			return compact;
		},
		goTo,
		next: () => goTo(page + 1),
		prev: () => goTo(page - 1),
		zoomIn: () => {
			fit = 'none';
			scale = nextZoom(scale, 1, minScale, maxScale);
		},
		zoomOut: () => {
			fit = 'none';
			scale = nextZoom(scale, -1, minScale, maxScale);
		},
		rotate: (direction = 1) => {
			rotation = (rotation + direction * 90 + 360) % 360;
		},
		download,
		setViewportSize: (size) => {
			viewportSize = size;
		},
		reportPageSize: (n, size) => {
			// Untracked: pages report from an effect, which must not depend on the map it writes.
			const known = untrack(() => pageSizes[n]);
			if (known && known.width === size.width && known.height === size.height) return;
			pageSizes = { ...untrack(() => pageSizes), [n]: size };
		},
		registerScroller: (scrollTo) => {
			scroller = scrollTo;
			return () => {
				if (scroller === scrollTo) scroller = null;
			};
		},
		reportVisiblePage: (value) => {
			// Order matters: the scroll effect compares against visiblePage.
			visiblePage = value;
			if (page !== value) page = value;
		}
	});
</script>

<div
	bind:clientWidth={rootWidth}
	class={cn(
		'relative flex flex-col overflow-hidden',
		!children && 'rounded-lg border bg-muted/30',
		className
	)}
	{...rest}
>
	{#if children}
		{@render children()}
	{:else}
		<PdfViewerToolbar />
		<div class="flex min-h-0 flex-1">
			{#if sidebar && !compact}
				<PdfViewerThumbnails class="w-40 shrink-0 border-r" />
			{/if}
			<PdfViewerPages class="min-w-0 flex-1" />
		</div>
	{/if}
</div>
