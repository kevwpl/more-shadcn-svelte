<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeftRight, Scan, ZoomIn, ZoomOut } from '@lucide/svelte';
	import { getPdfViewerContext } from './ctx.svelte';

	let {
		showFit = true,
		class: className,
		...rest
	}: { showFit?: boolean; class?: string; [key: string]: unknown } = $props();

	const ctx = getPdfViewerContext('PdfViewer.Zoom');

	// The button offers whichever fit is not active, so it doubles as a toggle.
	const nextFit = $derived(ctx.fit === 'width' ? 'page' : 'width');
</script>

<div class={cn('flex items-center gap-1', className)} {...rest}>
	<Button
		variant="ghost"
		size="icon-sm"
		aria-label="Zoom out"
		disabled={!ctx.doc || ctx.scale <= ctx.minScale}
		onclick={ctx.zoomOut}
	>
		<ZoomOut />
	</Button>

	<span class="w-12 text-center text-sm tabular-nums text-muted-foreground" aria-live="polite">
		{Math.round(ctx.scale * 100)}%
	</span>

	<Button
		variant="ghost"
		size="icon-sm"
		aria-label="Zoom in"
		disabled={!ctx.doc || ctx.scale >= ctx.maxScale}
		onclick={ctx.zoomIn}
	>
		<ZoomIn />
	</Button>

	{#if showFit}
		<Button
			variant="ghost"
			size="icon-sm"
			aria-label={nextFit === 'width' ? 'Fit to width' : 'Fit whole page'}
			title={nextFit === 'width' ? 'Fit to width' : 'Fit whole page'}
			disabled={!ctx.doc}
			onclick={() => (ctx.fit = nextFit)}
		>
			{#if nextFit === 'width'}
				<ArrowLeftRight />
			{:else}
				<Scan />
			{/if}
		</Button>
	{/if}
</div>
