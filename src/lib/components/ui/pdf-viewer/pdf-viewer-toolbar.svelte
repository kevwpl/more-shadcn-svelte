<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import PdfViewerSidebarToggle from './pdf-viewer-sidebar-toggle.svelte';
	import PdfViewerPageNav from './pdf-viewer-page-nav.svelte';
	import PdfViewerZoom from './pdf-viewer-zoom.svelte';
	import PdfViewerRotate from './pdf-viewer-rotate.svelte';
	import PdfViewerDownload from './pdf-viewer-download.svelte';
	import { getPdfViewerContext } from './ctx.svelte';

	let {
		class: className,
		children,
		...rest
	}: {
		class?: string;
		/** Your own controls. Leave empty for the default set. */
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	const ctx = getPdfViewerContext('PdfViewer.Toolbar');
</script>

<div
	role="toolbar"
	aria-label="Document controls"
	class={cn(
		// Wraps on narrow screens instead of widening the page; containment keeps
		// the full single-row width from leaking out as the viewer's minimum width.
		'flex shrink-0 flex-wrap items-center gap-x-1 gap-y-1 border-b bg-background px-2 py-1.5 [contain:inline-size]',
		className
	)}
	{...rest}
>
	{#if children}
		{@render children()}
	{:else}
		{#if !ctx.compact}
			<PdfViewerSidebarToggle />
			<div class="mx-1 h-5 w-px shrink-0 bg-border"></div>
		{/if}
		<PdfViewerPageNav />
		<div class="flex-1"></div>
		<PdfViewerZoom />
		<div class="mx-1 h-5 w-px shrink-0 bg-border"></div>
		<PdfViewerRotate />
		<PdfViewerDownload />
	{/if}
</div>
