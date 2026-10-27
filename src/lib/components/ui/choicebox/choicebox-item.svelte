<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getChoiceboxContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		value,
		class: className,
		children,
		disabled = false
	}: {
		value: string;
		class?: string;
		children: Snippet;
		disabled?: boolean;
	} = $props();

	const ctx = getChoiceboxContext();
	let isSelected = $derived(ctx.activeValue() === value);

	function handleClick() {
		if (!disabled) {
			ctx.setActive(value);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}
</script>

<div
	role="radio"
	aria-checked={isSelected}
	tabindex={disabled ? -1 : 0}
	onclick={handleClick}
	onkeydown={handleKeyDown}
	data-state={isSelected ? 'checked' : 'unchecked'}
	class={cn(
		'relative flex cursor-pointer items-start gap-4 rounded-lg border p-4 shadow-sm outline-none transition-all',
		'border-input bg-card hover:bg-accent/50 hover:text-accent-foreground',
		'data-[state=checked]:border-primary data-[state=checked]:ring-1 data-[state=checked]:ring-primary',
		disabled && 'cursor-not-allowed opacity-50',
		className
	)}
>
	{@render children()}
</div>
