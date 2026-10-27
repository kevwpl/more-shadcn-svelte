<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { setChoiceboxContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		value = $bindable(),
		class: className,
		children,
		name,
		onValueChange
	}: {
		value?: string;
		class?: string;
		children: Snippet;
		name?: string;
		onValueChange?: (value: string) => void;
	} = $props();

	setChoiceboxContext({
		activeValue: () => value,
		setActive: (v) => {
			value = v;
			if (onValueChange) {
				onValueChange(v);
			}
		}
	});
</script>

<div class={cn('flex flex-col gap-3', className)} role="radiogroup" aria-label={name}>
	{@render children()}
	{#if name}
		<input type="hidden" {name} {value} />
	{/if}
</div>
