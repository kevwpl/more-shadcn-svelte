<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PanelLeft, PanelLeftClose } from '@lucide/svelte';
	import { getPdfViewerContext } from './ctx.svelte';

	let { class: className, ...rest }: { class?: string; [key: string]: unknown } = $props();

	const ctx = getPdfViewerContext('PdfViewer.SidebarToggle');
	const label = $derived(ctx.sidebar ? 'Hide thumbnails' : 'Show thumbnails');
</script>

<!-- Hidden when the viewer is too narrow for thumbnails: the default layout
     drops them there, so the toggle would do nothing. -->
{#if !ctx.compact}
	<Button
		variant="ghost"
		size="icon-sm"
		aria-label={label}
		title={label}
		aria-pressed={ctx.sidebar}
		onclick={() => (ctx.sidebar = !ctx.sidebar)}
		class={className}
		{...rest}
	>
		{#if ctx.sidebar}
			<PanelLeftClose />
		{:else}
			<PanelLeft />
		{/if}
	</Button>
{/if}
