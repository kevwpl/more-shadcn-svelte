<script lang="ts">
	import { cn } from '$lib/utils';
	import { setDateStripContext } from './ctx';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { type DateValue, getLocalTimeZone, today, startOfWeek } from '@internationalized/date';

	let {
		value = $bindable(),
		class: className,
		daysToShow = 5,
		isDateDisabled = () => false,
		onDateChange,
		children
	}: {
		value?: DateValue | undefined;
		class?: string;
		daysToShow?: number;
		isDateDisabled?: (date: DateValue) => boolean;
		onDateChange?: (date: DateValue) => void;
		children: Snippet<[{ date: DateValue }]>;
	} = $props();

	let startDate = $state(startOfWeek(today(getLocalTimeZone()), 'en-US'));
	let slideDirection = $state<'start' | 'end'>('end');

	const displayedDates = $derived(
		Array.from({ length: daysToShow }, (_, i) => startDate.add({ days: i }))
	);

	function handlePrev() {
		slideDirection = 'start';
		startDate = startDate.add({ days: -daysToShow });
	}

	function handleNext() {
		slideDirection = 'end';
		startDate = startDate.add({ days: daysToShow });
	}

	setDateStripContext({
		selectedValue: () => value,
		onSelect: (d) => {
			value = d;
			onDateChange?.(d);
		},
		isDateDisabled,
		direction: () => slideDirection
	});
</script>

<div class={cn('flex items-center gap-2 rounded-xl border bg-card p-1 shadow-sm', className)}>
	<Button variant="ghost" size="icon" class="h-7 w-7 shrink-0" onclick={handlePrev}>
		<ChevronLeft class="h-4 w-4" />
	</Button>

	<div class="flex flex-1 justify-between gap-1 overflow-hidden">
		{#each displayedDates as date (date.toString())}
			{@render children({ date })}
		{/each}
	</div>

	<Button variant="ghost" size="icon" class="h-7 w-7 shrink-0" onclick={handleNext}>
		<ChevronRight class="h-4 w-4" />
	</Button>
</div>
