<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getDateStripContext } from './ctx';
	import { type DateValue, getLocalTimeZone, isToday } from '@internationalized/date';
	import { DateFormatter } from '@internationalized/date';
	import { Button } from '#lib/components/ui/button/index.js';

	let {
		date,
		class: className
	}: {
		date: DateValue;
		class?: string;
	} = $props();

	const ctx = getDateStripContext();
	const formatterMonth = new DateFormatter('en-US', { month: 'short' });
	const formatterDay = new DateFormatter('en-US', { day: 'numeric' });

	let isSelected = $derived(ctx.selectedValue()?.compare(date) === 0);
	let isDisabled = $derived(ctx.isDateDisabled(date));
	let direction = $derived(ctx.direction());

	function handleClick() {
		if (!isDisabled) {
			ctx.onSelect(date);
		}
	}

	const dateObj = $derived(date.toDate('UTC'));
</script>

<Button
	variant="ghost"
	onclick={handleClick}
	class={cn(
		'flex flex-col items-center justify-center -space-y-1 animate-in fade-in-5',
		'w-12 h-12 shrink-0 rounded-lg',
		direction === 'end' ? 'slide-in-from-right-12' : 'slide-in-from-left-12',
		isToday(date, getLocalTimeZone()) && 'bg-accent',
		isSelected && 'bg-primary text-primary-foreground',
		className
	)}
	disabled={isDisabled}
>
	<span class="text-[8px] font-medium uppercase opacity-70">
		{formatterMonth.format(dateObj)}
	</span>
	<span class="text-base font-bold leading-none">
		{formatterDay.format(dateObj)}
	</span>
</Button>
