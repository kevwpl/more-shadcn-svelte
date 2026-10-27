<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { setCompareContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		value = $bindable(50),
		orientation = 'horizontal',
		class: className,
		children
	}: {
		value?: number;
		orientation?: 'horizontal' | 'vertical';
		class?: string;
		children: Snippet;
	} = $props();

	let container: HTMLDivElement | undefined = $state();
	let isDragging = $state(false);

	function handleDown(e: PointerEvent) {
		if (e.button !== 0 && e.pointerType === 'mouse') return;

		isDragging = true;
		updatePosition(e.clientX, e.clientY);

		(e.target as Element).setPointerCapture(e.pointerId);
	}

	function handleMove(e: PointerEvent) {
		if (!isDragging) return;
		updatePosition(e.clientX, e.clientY);
	}

	function handleUp(e: PointerEvent) {
		isDragging = false;
		(e.target as Element).releasePointerCapture(e.pointerId);
	}

	function updatePosition(clientX: number, clientY: number) {
		if (!container) return;

		const rect = container.getBoundingClientRect();

		if (orientation === 'horizontal') {
			const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
			value = (x / rect.width) * 100;
		} else {
			const y = Math.min(Math.max(0, clientY - rect.top), rect.height);
			value = (y / rect.height) * 100;
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		const step = e.shiftKey ? 10 : 1;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			value = Math.max(0, value - step);
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			value = Math.min(100, value + step);
		} else if (e.key === 'Home') {
			e.preventDefault();
			value = 0;
		} else if (e.key === 'End') {
			e.preventDefault();
			value = 100;
		}
	}

	setCompareContext({
		position: () => value,
		orientation: () => orientation,
		isDragging: () => isDragging
	});
</script>

<div
	bind:this={container}
	role="slider"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={100}
	tabindex="0"
	onpointerdown={handleDown}
	onpointermove={handleMove}
	onpointerup={handleUp}
	onkeydown={handleKeyDown}
	class={cn(
		'group relative select-none overflow-hidden touch-none',
		orientation === 'horizontal' ? 'cursor-ew-resize' : 'cursor-ns-resize',
		className
	)}
	style="--pos: {value}%"
>
	{@render children()}
</div>
