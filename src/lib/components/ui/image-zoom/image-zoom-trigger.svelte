<script lang="ts">
	import { getImageZoomContext } from './ctx';
	import { cn } from '#lib/utils.js';
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { onMount } from 'svelte';

	type Props = HTMLImgAttributes & {
		class?: string;
	};

	let { src, alt, class: className, ...rest }: Props = $props();

	const { registerImage, openImage } = getImageZoomContext();

	let myIndex: number;

	onMount(() => {
		if (!src) {
			console.warn("ImageZoom.Trigger requires a 'src' prop.");
			return;
		}
		myIndex = registerImage({ src, alt: alt || '' });
	});

	function handleOpenZoom() {
		if (myIndex !== undefined) {
			openImage(myIndex);
		}
	}
</script>

<img
	src={src || ''}
	alt={alt || ''}
	class={cn(
		'cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] hover:brightness-90',
		className
	)}
	onclick={handleOpenZoom}
	{...rest}
/>
