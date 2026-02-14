<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Command from '$lib/components/ui/command';
	import { Check } from '@lucide/svelte';
	import { getDynamicSelectContext } from './ctx';
	import type { Snippet } from 'svelte';

	let { value, children }: { value: string; children: Snippet } = $props();
	const ctx = getDynamicSelectContext();
	const isSelected = $derived(ctx.value.value === value);
</script>

<Command.Item
	{value}
	onSelect={() => ctx.setValue(value)}
	class="flex cursor-pointer items-center justify-between"
>
	{@render children()}
	<Check class={cn('h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
</Command.Item>
