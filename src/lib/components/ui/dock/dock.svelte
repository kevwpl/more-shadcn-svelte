<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { setDockContext } from './ctx';
	import { useMotionValue } from 'svelte-motion';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		magnification = 60,
		distance = 140,
		children
	}: {
		class?: string;
		magnification?: number;
		distance?: number;
		children: Snippet;
	} = $props();

	let mouseX = useMotionValue(Infinity);

	setDockContext({
		mouseX,
		magnification,
		distance
	});

	function handleMouseMove(e: MouseEvent) {
		mouseX.set(e.pageX);
	}

	function handleMouseLeave() {
		mouseX.set(Infinity);
	}
</script>

<div
	class={cn(
		'mx-auto flex h-[58px] w-max items-center gap-2 rounded-2xl border bg-white px-4 dark:bg-black',
		className
	)}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
>
	{@render children()}
</div>
