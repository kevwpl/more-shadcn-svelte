<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { getPdfViewerContext } from './ctx.svelte';

	let { class: className, ...rest }: { class?: string; [key: string]: unknown } = $props();

	const ctx = getPdfViewerContext('PdfViewer.PageNav');

	function commit(input: HTMLInputElement) {
		const value = Number.parseInt(input.value, 10);
		if (!Number.isNaN(value)) ctx.goTo(value);
		// goTo clamps; if that lands on the current page nothing re-renders,
		// so put the real page number back by hand.
		input.value = String(ctx.page);
	}
</script>

<div class={cn('flex items-center gap-1', className)} {...rest}>
	<Button
		variant="ghost"
		size="icon-sm"
		aria-label="Previous page"
		disabled={!ctx.doc || ctx.page <= 1}
		onclick={ctx.prev}
	>
		<ChevronLeft />
	</Button>

	<input
		value={ctx.page}
		inputmode="numeric"
		aria-label="Page number"
		disabled={!ctx.doc}
		onchange={(e) => commit(e.currentTarget)}
		onkeydown={(e) => {
			if (e.key === 'Enter') e.currentTarget.blur();
		}}
		class="h-8 w-11 rounded-md border border-input bg-background text-center text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
	/>
	<span class="px-1 text-sm tabular-nums text-muted-foreground">/ {ctx.numPages || '–'}</span>

	<Button
		variant="ghost"
		size="icon-sm"
		aria-label="Next page"
		disabled={!ctx.doc || ctx.page >= ctx.numPages}
		onclick={ctx.next}
	>
		<ChevronRight />
	</Button>
</div>
