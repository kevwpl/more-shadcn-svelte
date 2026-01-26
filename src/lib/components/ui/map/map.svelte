<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { MapInstance } from './mapInstance';

	let {
		map,
		options = {},
		class: className,
		children,
		...restProps
	}: {
		map: MapInstance;
		options?: Record<string, any>;
		class?: string;
		children?: Snippet;
	} = $props();

	let container: HTMLDivElement | null = $state(null);
	let mounted = $state(false);

	$effect(() => {
		if (container) {
			map.mount(container).then(() => {
				console.log('Map mounted successfully');
				mounted = true;
				map.setCenter(options.center);
			});
		}

		return () => map.destroy();
	});
</script>

<div
	bind:this={container}
	id="map"
	class={cn('flex flex-col gap-4 w-full h-full relative', className)}
	{...restProps}
>
	{#if mounted}
		{@render children?.()}
	{:else}
		<div class="absolute inset-0 flex items-center justify-center">
			<span class="text-muted-foreground">Loading map...</span>
		</div>
	{/if}
</div>
