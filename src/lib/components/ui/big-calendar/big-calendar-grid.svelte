<script lang="ts">
	import { cn } from '$lib/utils';
	import { getCalendarContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children
	}: {
		class?: string;
		children?: Snippet<[any]>;
	} = $props();

	const ctx = getCalendarContext();
	const todayDate = new Date();

	function getDaysInMonth(d: Date) {
		const year = d.getFullYear();
		const month = d.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		const days = [];
		const startPadding = firstDay.getDay();

		const prevMonthLastDay = new Date(year, month, 0).getDate();
		for (let i = startPadding - 1; i >= 0; i--) {
			days.push({
				date: new Date(year, month - 1, prevMonthLastDay - i),
				isCurrentMonth: false
			});
		}

		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push({
				date: new Date(year, month, i),
				isCurrentMonth: true
			});
		}

		const remaining = 42 - days.length;
		for (let i = 1; i <= remaining; i++) {
			days.push({
				date: new Date(year, month + 1, i),
				isCurrentMonth: false
			});
		}
		return days;
	}

	function isSameDay(d1: Date, d2: Date) {
		return (
			d1.getDate() === d2.getDate() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getFullYear() === d2.getFullYear()
		);
	}

	let days = $derived(getDaysInMonth(ctx.currentDate()));
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<div class={cn('flex-1 flex flex-col min-h-[600px]', className)}>
	<div class="grid grid-cols-7 border-b bg-muted/30">
		{#each weekDays as day}
			<div
				class="py-3 text-center text-xs font-semibold uppercase text-muted-foreground tracking-wider border-r last:border-r-0"
			>
				{day}
			</div>
		{/each}
	</div>

	<div class="grid grid-cols-7 grid-rows-6 flex-1">
		{#each days as day, i}
			{@const isToday = isSameDay(day.date, todayDate)}
			{@const isSelected = ctx.selectedDate() && isSameDay(day.date, ctx.selectedDate()!)}
			{@const dayEvents = ctx.events().filter((e) => isSameDay(e.date, day.date))}

			<div
				class={cn(
					'relative min-h-[100px] p-2 border-b border-r transition-colors flex flex-col gap-1',
					!day.isCurrentMonth && 'bg-muted/5 text-muted-foreground/40',
					day.isCurrentMonth && 'bg-background hover:bg-muted/20',
					isSelected && 'bg-primary/5 ring-1 ring-inset ring-primary/20',
					(i + 1) % 7 === 0 && 'border-r-0',
					i >= 35 && 'border-b-0'
				)}
				onclick={() => ctx.selectDate(day.date)}
			>
				<div class="flex justify-between items-start">
					<span
						class={cn(
							'text-xs font-medium h-6 w-6 flex items-center justify-center rounded-full transition-colors',
							isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
							isSelected && !isToday && 'text-primary font-bold'
						)}
					>
						{day.date.getDate()}
					</span>
					{#if (day.isCurrentMonth && day.date.getDay() === 0) || day.date.getDay() === 6}
						<span class="text-[10px] text-muted-foreground/30 font-medium hidden sm:inline-block"
							>OFF</span
						>
					{/if}
				</div>

				<div class="flex-1 flex flex-col gap-1 mt-1 overflow-y-auto max-h-[100px] scrollbar-hide">
					{#each dayEvents as event}
						{#if children}
							{@render children(event)}
						{:else}
							<div class="text-xs truncate bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
								{event.title}
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
