<script lang="ts">
	import { cn } from '$lib/utils';
	import { setScrollContext } from './ctx';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	let {
		class: className,
		sensitivity = 1.5,
		damping = 0.1,
		children
	}: {
		class?: string;
		sensitivity?: number;
		damping?: number;
		children: Snippet;
	} = $props();

	let scrollContainer: HTMLDivElement | undefined = $state();

	let targetScroll = 0;
	let currentScroll = 0;
	let isAnimating = false;
	let animationFrame: number;

	onMount(() => {
		return () => {
			if (animationFrame) cancelAnimationFrame(animationFrame);
		};
	});

	function update() {
		if (!scrollContainer) return;

		const diff = targetScroll - currentScroll;

		if (Math.abs(diff) < 0.5) {
			currentScroll = targetScroll;
			scrollContainer.scrollLeft = currentScroll;
			isAnimating = false;
			return;
		}

		currentScroll += diff * damping;
		scrollContainer.scrollLeft = currentScroll;

		animationFrame = requestAnimationFrame(update);
	}

	function handleWheel(e: WheelEvent) {
		if (!scrollContainer) return;
		if (e.deltaY === 0) return;

		const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
		if (maxScroll <= 0) return;

		e.preventDefault();

		if (!isAnimating) {
			currentScroll = scrollContainer.scrollLeft;
			targetScroll = currentScroll;
			isAnimating = true;
			animationFrame = requestAnimationFrame(update);
		}

		targetScroll += e.deltaY * sensitivity;

		targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
	}

	setScrollContext({
		scrollLeft: () => {
			if (!scrollContainer) return;
			if (!isAnimating) {
				currentScroll = scrollContainer.scrollLeft;
				targetScroll = currentScroll;
				isAnimating = true;
				animationFrame = requestAnimationFrame(update);
			}
			targetScroll = Math.max(0, targetScroll - 300);
		},
		scrollRight: () => {
			if (!scrollContainer) return;
			const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
			if (!isAnimating) {
				currentScroll = scrollContainer.scrollLeft;
				targetScroll = currentScroll;
				isAnimating = true;
				animationFrame = requestAnimationFrame(update);
			}
			targetScroll = Math.min(maxScroll, targetScroll + 300);
		},
		getElement: () => scrollContainer
	});
</script>

<div
	bind:this={scrollContainer}
	onwheel={handleWheel}
	class={cn('flex w-full overflow-x-auto overflow-y-hidden select-none', className)}
	style="scrollbar-width: none; -ms-overflow-style: none;"
>
	{@render children()}
</div>

<style>
	div::-webkit-scrollbar {
		display: none;
	}
</style>
