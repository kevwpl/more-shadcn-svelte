<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import type { Snippet } from 'svelte';
	import type { VariantProps } from 'class-variance-authority';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	type Props = (HTMLButtonAttributes & HTMLAnchorAttributes) &
		VariantProps<typeof buttonVariants> & {
			children: Snippet;
		};

	let {
		class: className,
		variant = 'default',
		size = 'default',
		href = undefined,
		children,
		...rest
	}: Props = $props();
</script>

{#snippet ButtonContent()}
	<div
		class="shine-element absolute inset-0 -top-[20%] -bottom-[20%] z-0 hidden w-[50%] -translate-x-[200%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-current to-transparent opacity-30 group-hover:animate-none md:block"
		aria-hidden="true"
	></div>

	<span class="relative z-10 flex items-center justify-center">
		{@render children()}
	</span>
{/snippet}

{#if href}
	<a
		class={cn(
			'relative overflow-hidden group cursor-pointer',
			buttonVariants({ variant, size }),
			className
		)}
		{href}
		{...rest}
	>
		{@render ButtonContent()}
	</a>
{:else}
	<button
		class={cn(
			'relative overflow-hidden group cursor-pointer',
			buttonVariants({ variant, size }),
			className
		)}
		{...rest}
	>
		{@render ButtonContent()}
	</button>
{/if}

<style>
	.shine-element {
		animation: shine 4s ease-in-out infinite;
	}

	@keyframes shine {
		0% {
			left: -100%;
		}
		15% {
			left: 210%;
		}
		100% {
			left: 210%;
		}
	}
</style>
