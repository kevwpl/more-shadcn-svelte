<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover';
	import { buttonVariants } from '$lib/components/ui/button';
	import { ChevronDown } from '@lucide/svelte';
	import { getDynamicSelectContext } from './ctx';
	import type { Snippet } from 'svelte';

	let { class: className, children }: { class?: string; children: Snippet } = $props();
	const ctx = getDynamicSelectContext();
</script>

<Popover.Trigger
	class={cn(
		buttonVariants({ variant: 'outline' }),
		'w-full justify-between font-normal',
		className
	)}
>
	{#if ctx.value.value}
		{ctx.value.value}
	{:else}
		{@render children()}
	{/if}
	<ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
</Popover.Trigger>
