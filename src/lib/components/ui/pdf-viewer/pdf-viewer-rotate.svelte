<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { RotateCcw, RotateCw } from '@lucide/svelte';
	import { getPdfViewerContext } from './ctx.svelte';

	let {
		direction = 1,
		class: className,
		...rest
	}: { direction?: 1 | -1; class?: string; [key: string]: unknown } = $props();

	const ctx = getPdfViewerContext('PdfViewer.Rotate');
	const label = $derived(direction > 0 ? 'Rotate clockwise' : 'Rotate counter-clockwise');
</script>

<Button
	variant="ghost"
	size="icon-sm"
	aria-label={label}
	title={label}
	disabled={!ctx.doc}
	onclick={() => ctx.rotate(direction)}
	class={className}
	{...rest}
>
	{#if direction > 0}
		<RotateCw />
	{:else}
		<RotateCcw />
	{/if}
</Button>
