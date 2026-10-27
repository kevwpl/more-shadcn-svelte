<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { spring } from 'svelte/motion';
	import { onMount } from 'svelte';

	let {
		value = 0,
		initial = 0,
		duration = 1000,
		class: className
	}: {
		value: number;
		initial?: number;
		duration?: number;
		class?: string;
	} = $props();

	const count = spring(initial, {
		stiffness: 0.1,
		damping: 0.4
	});

	let element: HTMLSpanElement;
	let isVisible = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isVisible) {
					isVisible = true;
					count.set(value);
				}
			},
			{ threshold: 0.1 }
		);

		if (element) observer.observe(element);

		return () => observer.disconnect();
	});

	let displayValue = $derived(Math.round($count).toLocaleString('en-US'));
</script>

<span bind:this={element} class={cn('tabular-nums tracking-tight text-foreground', className)}>
	{displayValue}
</span>
