<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		playing = true,
		bars = 4,
		class: className,
		barColor = 'bg-primary',
		...rest
	}: {
		playing?: boolean;
		bars?: number;
		class?: string;
		barColor?: string;
		[key: string]: any;
	} = $props();

	let heights = $state(Array(bars).fill(0.25));
	let frame: number;

	function lerp(start: number, end: number, factor: number) {
		return start + (end - start) * factor;
	}

	$effect(() => {
		if (heights.length !== bars) {
			heights = Array(bars).fill(0.25);
		}

		const animate = () => {
			const time = performance.now() / 1000;

			heights = heights.map((h, i) => {
				let target = 0.25;

				if (playing) {
					const input = (time - i * 0.15) * (Math.PI * 2);
					const sine = (Math.sin(input) + 1) / 2;
					target = 0.25 + sine * 0.75;
				}

				return lerp(h, target, 0.15);
			});

			frame = requestAnimationFrame(animate);
		};

		frame = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(frame);
	});
</script>

<div class={cn('flex items-end justify-center gap-0.5 h-8', className)} {...rest}>
	{#each heights as height, i}
		<div class={cn('w-1 rounded-sm', barColor)} style="height: {height * 100}%;"></div>
	{/each}
</div>
