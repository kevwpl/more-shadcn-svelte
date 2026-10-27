<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';

	let {
		x,
		y,
		color = '#000',
		name,
		message,
		class: className,
		children
	}: {
		x: number;
		y: number;
		color?: string;
		name?: string;
		message?: string;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div
	class={cn(
		'pointer-events-none absolute left-0 top-0 z-50 transition-transform duration-100 ease-linear will-change-transform',
		className
	)}
	style:transform={`translate3d(${x}px, ${y}px, 0)`}
>
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="relative -top-[1px] -left-[1px] drop-shadow-sm"
	>
		<path
			d="M3 3L9.5 20.5L12.5 13.5L19.5 10.5L3 3Z"
			fill={color}
			stroke={color}
			stroke-width="1"
			stroke-linejoin="round"
		/>
	</svg>

	{#if name || message || children}
		<div
			class="absolute left-3.5 top-5 min-w-[max-content] rounded-xl rounded-tl-none px-3 py-1.5 shadow-sm animate-in fade-in zoom-in-95 duration-200"
			style:background-color={color}
		>
			<div class="flex flex-col text-xs leading-relaxed text-white">
				{#if name}
					<span class="font-bold">{name}</span>
				{/if}
				{#if message}
					<span class="font-medium opacity-90">{message}</span>
				{/if}
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	{/if}
</div>
