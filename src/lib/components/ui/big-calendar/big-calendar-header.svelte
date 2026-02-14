<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight, Calendar as CalIcon } from '@lucide/svelte';
	import { getCalendarContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children
	}: {
		class?: string;
		children?: Snippet<
			[
				{
					next: () => void;
					prev: () => void;
					today: () => void;
					currentDate: Date;
				}
			]
		>;
	} = $props();

	const ctx = getCalendarContext();

	let label = $derived(
		ctx.currentDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
	);
</script>

<div
	class={cn('flex items-center justify-between px-6 py-4 border-b bg-card min-h-[72px]', className)}
>
	{#if children}
		{@render children({
			next: ctx.next,
			prev: ctx.prev,
			today: ctx.today,
			currentDate: ctx.currentDate()
		})}
	{:else}
		<div class="flex items-center gap-4">
			<div class="p-2 bg-primary/10 rounded-md hidden sm:block">
				<CalIcon class="h-5 w-5 text-primary" />
			</div>
			<h2 class="text-xl font-bold tracking-tight">{label}</h2>
		</div>
		<div class="flex items-center gap-1">
			<Button variant="outline" size="icon" class="h-8 w-8" onclick={ctx.prev}
				><ChevronLeft class="h-4 w-4" /></Button
			>
			<Button variant="outline" class="h-8 px-4 text-xs font-medium" onclick={ctx.today}
				>Today</Button
			>
			<Button variant="outline" size="icon" class="h-8 w-8" onclick={ctx.next}
				><ChevronRight class="h-4 w-4" /></Button
			>
		</div>
	{/if}
</div>
