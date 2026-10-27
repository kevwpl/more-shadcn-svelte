<!-- $lib/components/ui/plus-grid/plus-grid.svelte -->
<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		spacing = 40,
		opacity = 0.4,
		color = 'currentColor'
	}: {
		class?: string;
		children?: Snippet;
		spacing?: number;
		opacity?: number;
		color?: string;
	} = $props();

	// SVG pattern for a single "plus"
	// We use `fill='currentColor'` so it inherits text color, making it theme-aware (dark/light mode)
	const svgPattern = encodeURIComponent(
		`<svg width="${spacing}" height="${spacing}" viewBox="0 0 ${spacing} ${spacing}" xmlns="http://www.w3.org/2000/svg"><path d="M${spacing / 2} 0v${spacing}M0 ${spacing / 2}h${spacing}" stroke="${color}" stroke-opacity="${opacity}" fill="none" /></svg>`
	);

	// A cleaner, sharper plus sign using paths instead of strokes for pixel perfection at small sizes
	// This version creates a 3px by 3px cross in the center of the tile
	const plusPath = `M${spacing / 2 - 4} ${spacing / 2}h8M${spacing / 2} ${spacing / 2 - 4}v8`;

	const svgBg = `url("data:image/svg+xml,%3Csvg width='${spacing}' height='${spacing}' viewBox='0 0 ${spacing} ${spacing}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M${spacing / 2} ${spacing / 2}h1v1h-1v-1z' fill='${color}' fill-opacity='${opacity}'/%3E%3Cpath d='M${spacing / 2 - 3} ${spacing / 2}h7M${spacing / 2} ${spacing / 2 - 3}v7' stroke='${color}' stroke-opacity='${opacity}' stroke-width='1' fill='none'/%3E%3C/svg%3E")`;

	// Pure Plus Version
	// This creates a + shape.
	const bgImage = `url("data:image/svg+xml,%3Csvg width='${spacing}' height='${spacing}' viewBox='0 0 ${spacing} ${spacing}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${color}' fill-opacity='${opacity}'%3E%3Cpath d='M${spacing / 2 - 1} ${spacing / 2 - 4} h2 v3 h3 v2 h-3 v3 h-2 v-3 h-3 v-2 h3 z' /%3E%3C/g%3E%3C/svg%3E")`;
</script>

<div class={cn('relative h-full w-full bg-background', className)} style:background-image={bgImage}>
	{#if children}
		<div class="relative z-10">
			{@render children()}
		</div>
	{/if}
</div>
