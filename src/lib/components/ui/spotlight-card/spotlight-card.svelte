<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		color?: string;
		size?: number;
	};

	let { class: className, children, color, size = 350, ...rest }: Props = $props();

	let div: HTMLDivElement;
	let opacity = $state(0);
	let position = $state({ x: 0, y: 0 });

	const handleMouseMove = (e: MouseEvent) => {
		if (!div) return;
		const rect = div.getBoundingClientRect();
		position = { x: e.clientX - rect.left, y: e.clientY - rect.top };
	};
</script>

<div
	bind:this={div}
	onmousemove={handleMouseMove}
	onmouseenter={() => (opacity = 1)}
	onmouseleave={() => (opacity = 0)}
	class={cn(
		'relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm',
		className
	)}
	{...rest}
>
	<div
		class={cn(
			'pointer-events-none absolute inset-0 transition-opacity duration-300',
			!color && 'bg-black/10 dark:bg-white/10'
		)}
		style="
            opacity: {opacity};
            {color ? `background-color: ${color};` : ''}
            mask-image: radial-gradient(
                {size}px circle at {position.x}px {position.y}px,
                black,
                transparent
            );
            -webkit-mask-image: radial-gradient(
                {size}px circle at {position.x}px {position.y}px,
                black,
                transparent
            );
        "
	></div>

	<div class="relative h-full">
		{@render children()}
	</div>
</div>
