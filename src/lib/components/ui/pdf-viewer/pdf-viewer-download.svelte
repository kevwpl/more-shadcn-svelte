<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { Download } from '@lucide/svelte';
	import { getPdfViewerContext } from './ctx.svelte';

	let { class: className, ...rest }: { class?: string; [key: string]: unknown } = $props();

	const ctx = getPdfViewerContext('PdfViewer.Download');
</script>

<Button
	variant="ghost"
	size="icon-sm"
	aria-label="Download"
	title="Download"
	disabled={!ctx.doc}
	onclick={ctx.download}
	class={className}
	{...rest}
>
	<Download />
</Button>
