<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { tick, untrack } from 'svelte';
	import { FileWarning, LoaderCircle } from '@lucide/svelte';
	import { clamp, getPdfViewerContext } from './ctx.svelte';
	import PdfViewerPage from './pdf-viewer-page.svelte';

	/** Padding around the stack of pages. The root's fit maths assumes 16px. */
	const PADDING = 16;

	let {
		gap = 12,
		class: className,
		...rest
	}: {
		/** Space between pages, in px. */
		gap?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const ctx = getPdfViewerContext('PdfViewer.Pages');

	let container = $state<HTMLDivElement | null>(null);
	let width = $state(0);
	let height = $state(0);

	const pageNumbers = $derived(Array.from({ length: ctx.numPages }, (_, i) => i + 1));

	$effect(() => {
		ctx.setViewportSize({ width, height });
	});

	function frameFor(n: number) {
		return container?.querySelector<HTMLElement>(`[data-pdf-page="${n}"]`) ?? null;
	}

	/**
	 * The page occupying the most of the view. Frames are in document order, so
	 * a binary search finds the first one on screen without walking them all.
	 */
	function visiblePage() {
		if (!container) return null;
		const frames = [...container.querySelectorAll<HTMLElement>('[data-pdf-page]')];
		if (frames.length === 0) return null;

		const top = container.scrollTop;
		const bottom = top + container.clientHeight;

		// At the very end the last page may be too short to ever dominate, but
		// it is clearly the one being read.
		const scrollable = container.scrollHeight > container.clientHeight + 1;
		if (scrollable && bottom >= container.scrollHeight - 2) return frames.length;

		let lo = 0;
		let hi = frames.length - 1;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			if (frames[mid].offsetTop + frames[mid].offsetHeight <= top) lo = mid + 1;
			else hi = mid;
		}

		let best = lo;
		let bestHeight = -1;
		for (let i = lo; i < frames.length && frames[i].offsetTop < bottom; i++) {
			const frame = frames[i];
			const shown =
				Math.min(frame.offsetTop + frame.offsetHeight, bottom) - Math.max(frame.offsetTop, top);
			if (shown > bestHeight) {
				bestHeight = shown;
				best = i;
			}
		}

		return best + 1;
	}

	let frameRequest = 0;
	function handleScroll() {
		cancelAnimationFrame(frameRequest);
		frameRequest = requestAnimationFrame(() => {
			const n = visiblePage();
			if (n) ctx.reportVisiblePage(n);
		});
	}

	$effect(() =>
		ctx.registerScroller((n) => {
			// Wait for the frames to exist and be sized before measuring.
			tick().then(() => {
				const frame = frameFor(n);
				if (frame && container) container.scrollTo({ top: frame.offsetTop - PADDING });
			});
		})
	);

	// Zooming or rotating resizes every page, which would otherwise leave the
	// scroll position pointing somewhere else entirely. Remember how far into
	// the current page the view was, and restore that after the resize.
	$effect.pre(() => {
		void ctx.scale;
		void ctx.rotation;

		const anchor = untrack(() => {
			const frame = frameFor(ctx.page);
			if (!frame || !container) return null;
			return {
				page: ctx.page,
				offset: (container.scrollTop - frame.offsetTop) / Math.max(frame.offsetHeight, 1)
			};
		});

		if (!anchor) return;
		tick().then(() => {
			const frame = frameFor(anchor.page);
			if (frame && container) {
				container.scrollTop = frame.offsetTop + anchor.offset * frame.offsetHeight;
			}
		});
	});

	// Ctrl / Cmd + wheel zooms the document instead of the whole page. Attached
	// manually because it has to be non-passive to cancel the browser zoom.
	$effect(() => {
		const el = container;
		if (!el) return;

		const handleWheel = (e: WheelEvent) => {
			if (!e.ctrlKey && !e.metaKey) return;
			e.preventDefault();
			ctx.scale = clamp(ctx.scale * Math.exp(-e.deltaY * 0.002), ctx.minScale, ctx.maxScale);
		};

		el.addEventListener('wheel', handleWheel, { passive: false });
		return () => el.removeEventListener('wheel', handleWheel);
	});
</script>

<div
	bind:this={container}
	bind:clientWidth={width}
	bind:clientHeight={height}
	onscroll={handleScroll}
	role="region"
	aria-label="Document pages"
	tabindex="0"
	class={cn(
		// Fit-to-width sets the zoom from this element's width, so its width must
		// never depend on the pages inside it. Without inline-size containment, a
		// parent that sizes to content (a grid track, an inline flex item) grows
		// with the pages, which raises the zoom, which grows the pages — until the
		// zoom hits its maximum.
		'relative overflow-auto outline-none [contain:inline-size]',
		// A stable gutter stops fit-to-width from oscillating as the scrollbar
		// appears and disappears.
		'[scrollbar-gutter:stable]',
		className
	)}
	{...rest}
>
	{#if ctx.error}
		<div
			class="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground"
		>
			<FileWarning class="size-6" />
			<span class="font-medium text-foreground">The document could not be opened</span>
			<span class="max-w-sm text-xs">{ctx.error.message}</span>
		</div>
	{:else if ctx.loading || !ctx.doc}
		<div class="flex h-full items-center justify-center">
			<LoaderCircle class="size-6 animate-spin text-muted-foreground" />
		</div>
	{:else}
		<!-- w-max + min-w-full keeps pages centred when narrow, and fully
		     scrollable from the left edge when zoomed wider than the view. -->
		<div
			class="flex w-max min-w-full flex-col items-center"
			style:padding="{PADDING}px"
			style:gap="{gap}px"
		>
			{#each pageNumbers as n (n)}
				<PdfViewerPage
					pageNumber={n}
					scale={ctx.scale}
					rotation={ctx.rotation}
					root={container}
					class="shadow-md ring-1 ring-black/5"
				/>
			{/each}
		</div>
	{/if}
</div>
