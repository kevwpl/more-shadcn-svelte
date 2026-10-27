<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getWheelContext } from './ctx.svelte';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	let {
		value,
		class: className,
		children
	}: {
		value: string;
		class?: string;
		children: Snippet;
	} = $props();

	const ITEM_HEIGHT = 32;
	const ctx = getWheelContext();

	let ref: HTMLElement | undefined = $state();
	let offsetTop = $state(0);

	onMount(() => {
		ctx.register();
		if (ref) offsetTop = ref.offsetTop;
		return () => ctx.unregister();
	});

	let parentY = $derived(ctx.state.translateY);
	let loop = $derived(ctx.state.loop);
	let totalCount = $derived(ctx.state.totalCount);

	let style = $derived.by(() => {
		let dist = parentY + offsetTop;
		let loopOffset = 0;

		if (loop && totalCount > 0) {
			const totalHeight = totalCount * ITEM_HEIGHT;
			const halfHeight = totalHeight / 2;

			if (dist > halfHeight) {
				const offset = -totalHeight * Math.ceil((dist - halfHeight) / totalHeight);
				dist += offset;
				loopOffset = offset;
			} else if (dist < -halfHeight) {
				const offset = totalHeight * Math.ceil((-dist - halfHeight) / totalHeight);
				dist += offset;
				loopOffset = offset;
			}
		}

		const rotateX = -dist * 0.4;

		if (Math.abs(rotateX) > 90) {
			return {
				transform: 'scale(0)',
				opacity: 0,
				color: 'transparent',
				pointerEvents: 'none'
			};
		}

		const opacity = Math.max(0.3, 1 - Math.abs(dist) / 250);
		const isSelected = Math.abs(dist) < ITEM_HEIGHT / 2;

		return {
			transform: `translateY(${loopOffset}px) rotateX(${rotateX}deg) translateZ(${Math.abs(dist) * 0.3}px)`,
			opacity,
			color: isSelected ? 'var(--foreground)' : 'var(--muted-foreground)',
			fontWeight: isSelected ? '600' : '400',
			pointerEvents: isSelected ? 'auto' : 'none'
		};
	});

	function handleClick() {
		if (!ctx.state.isDragging) ctx.onSelect(value);
	}
</script>

<div
	bind:this={ref}
	data-value={value}
	onclick={handleClick}
	role="option"
	aria-selected={Math.abs(parentY + offsetTop) < 16}
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	class={cn(
		'flex h-[32px] w-full items-center justify-center text-[15px] cursor-pointer select-none backface-hidden whitespace-nowrap',
		className
	)}
	style:transform={style.transform}
	style:opacity={style.opacity}
	style:color={style.color}
	style:font-weight={style.fontWeight}
	style:pointer-events={style.pointerEvents}
>
	{@render children()}
</div>
