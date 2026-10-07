<script lang="ts">
	import { cn } from '$lib/utils';
	import { getPdfViewerContext } from './ctx.svelte';
	import PdfViewerPage from './pdf-viewer-page.svelte';

	let {
		width = 104,
		class: className,
		...rest
	}: {
		/** Thumbnail width in px. Height follows each page's own aspect ratio. */
		width?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const ctx = getPdfViewerContext('PdfViewer.Thumbnails');

	let container = $state<HTMLDivElement | null>(null);

	const pageNumbers = $derived(Array.from({ length: ctx.numPages }, (_, i) => i + 1));

	// Follow along as the reader moves through the document. Measured against
	// the list itself rather than scrollIntoView, which would scroll the page too.
	$effect(() => {
		const n = ctx.page;
		if (!container) return;

		const item = container.querySelector<HTMLElement>(`[data-thumbnail="${n}"]`);
		if (!item) return;

		const top = item.offsetTop;
		const bottom = top + item.offsetHeight;
		if (top < container.scrollTop) {
			container.scrollTo({ top: top - 8 });
		} else if (bottom > container.scrollTop + container.clientHeight) {
			container.scrollTo({ top: bottom - container.clientHeight + 8 });
		}
	});
</script>

<div
	bind:this={container}
	role="navigation"
	aria-label="Page thumbnails"
	class={cn('relative overflow-y-auto bg-muted/40 p-3', className)}
	{...rest}
>
	{#if ctx.doc}
		<div class="flex flex-col items-center gap-3">
			{#each pageNumbers as n (n)}
				{@const current = ctx.page === n}
				<button
					type="button"
					data-thumbnail={n}
					onclick={() => ctx.goTo(n)}
					aria-label="Go to page {n}"
					aria-current={current ? 'page' : undefined}
					class="flex flex-col items-center gap-1.5 rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<PdfViewerPage
						pageNumber={n}
						{width}
						rotation={ctx.rotation}
						root={container}
						rootMargin="50% 0px"
						class={cn(
							'rounded-[2px] shadow-sm transition-shadow',
							current ? 'ring-2 ring-primary' : 'ring-1 ring-border'
						)}
					/>
					<span
						class={cn(
							'text-[11px] tabular-nums',
							current ? 'font-medium text-foreground' : 'text-muted-foreground'
						)}
					>
						{n}
					</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
