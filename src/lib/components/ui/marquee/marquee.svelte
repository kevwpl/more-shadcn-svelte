<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		direction = 'left',
		speed = 40,
		gap = 32,
		pauseOnHover = true,
		fade = true,
		fadeSize = '10%',
		class: className,
		children,
		...rest
	}: {
		direction?: 'left' | 'right' | 'up' | 'down';
		/** Pixels per second — stays the same whatever the content length. */
		speed?: number;
		/** Space between items and between repeats, in px. */
		gap?: number;
		pauseOnHover?: boolean;
		/** Fade the content out towards the edges. */
		fade?: boolean;
		fadeSize?: string;
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	const vertical = $derived(direction === 'up' || direction === 'down');
	const reverse = $derived(direction === 'right' || direction === 'down');

	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let copyWidth = $state(0);
	let copyHeight = $state(0);

	const containerSize = $derived(vertical ? containerHeight : containerWidth);
	const copySize = $derived(vertical ? copyHeight : copyWidth);

	/** One full step of the loop: a copy plus the gap that follows it. */
	const distance = $derived(copySize + gap);

	// Enough repeats to cover the container plus the one sliding in, so there
	// is never an empty stretch at the trailing edge.
	const copies = $derived(copySize > 0 ? Math.max(2, Math.ceil(containerSize / distance) + 1) : 2);

	const duration = $derived(distance / Math.max(speed, 1));

	const mask = $derived.by(() => {
		if (!fade) return undefined;
		const to = vertical ? 'to bottom' : 'to right';
		return `linear-gradient(${to}, transparent, black ${fadeSize}, black calc(100% - ${fadeSize}), transparent)`;
	});
</script>

<div
	bind:clientWidth={containerWidth}
	bind:clientHeight={containerHeight}
	role="marquee"
	class={cn(
		'marquee flex min-w-0 overflow-hidden',
		// The track is as wide as every copy laid end to end. Without inline-size
		// containment, a parent that sizes to its content (a grid track, a flex
		// row) takes on that width and the marquee runs off the page.
		vertical ? 'flex-col' : '[contain:inline-size]',
		className
	)}
	class:pause-on-hover={pauseOnHover}
	style:mask-image={mask}
	style:-webkit-mask-image={mask}
	{...rest}
>
	<div
		class={cn('marquee-track flex shrink-0', vertical ? 'h-max flex-col' : 'w-max')}
		class:vertical
		class:reverse
		class:running={copySize > 0}
		style:gap="{gap}px"
		style:--marquee-distance="{distance}px"
		style:--marquee-duration="{duration}s"
	>
		{#each Array.from({ length: copies }) as _, i}
			{#if i === 0}
				<div
					bind:clientWidth={copyWidth}
					bind:clientHeight={copyHeight}
					class={cn('flex shrink-0 items-center', vertical && 'flex-col')}
					style:gap="{gap}px"
				>
					{@render children()}
				</div>
			{:else}
				<!-- Repeats are decoration: hidden from screen readers and out of the tab order. -->
				<div
					aria-hidden="true"
					inert
					class={cn('flex shrink-0 items-center', vertical && 'flex-col')}
					style:gap="{gap}px"
				>
					{@render children()}
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.marquee-track.running {
		animation: marquee-x var(--marquee-duration) linear infinite;
	}

	.marquee-track.running.vertical {
		animation-name: marquee-y;
	}

	.marquee-track.reverse {
		animation-direction: reverse;
	}

	/* Pause for pointer and keyboard users alike. */
	.marquee.pause-on-hover:hover .marquee-track,
	.marquee:focus-within .marquee-track {
		animation-play-state: paused;
	}

	@keyframes marquee-x {
		to {
			transform: translateX(calc(-1 * var(--marquee-distance)));
		}
	}

	@keyframes marquee-y {
		to {
			transform: translateY(calc(-1 * var(--marquee-distance)));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track.running {
			animation-play-state: paused;
		}
	}
</style>
