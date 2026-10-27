<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getCalendarContext, type CalendarEvent } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children
	}: {
		class?: string;
		children?: Snippet<[CalendarEvent, { isStart: boolean; isEnd: boolean; isMiddle: boolean }]>;
	} = $props();

	const ctx = getCalendarContext();
	const todayDate = new Date();
	const ROW_HEIGHT = 28;

	function getDaysInMonth(d: Date, startDay: 0 | 1, showWeekends: boolean) {
		const year = d.getFullYear();
		const month = d.getMonth();
		const firstDayOfMonth = new Date(year, month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);

		const days = [];
		let dayOfWeek = firstDayOfMonth.getDay();
		let diff = (dayOfWeek - startDay + 7) % 7;

		const prevMonthLastDay = new Date(year, month, 0).getDate();

		for (let i = diff - 1; i >= 0; i--) {
			days.push({
				date: new Date(year, month - 1, prevMonthLastDay - i),
				isCurrentMonth: false
			});
		}

		for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
			days.push({
				date: new Date(year, month, i),
				isCurrentMonth: true
			});
		}

		const remaining = 7 - (days.length % 7);
		if (remaining < 7) {
			for (let i = 1; i <= remaining; i++) {
				days.push({
					date: new Date(year, month + 1, i),
					isCurrentMonth: false
				});
			}
		}

		if (!showWeekends) {
			return days.filter((d) => {
				const day = d.date.getDay();
				return day !== 0 && day !== 6;
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

	function isInRange(date: Date) {
		const range = ctx.selectedRange();
		if (!range.start || !range.end) return false;
		const start = range.start < range.end ? range.start : range.end;
		const end = range.start < range.end ? range.end : range.start;
		const d = new Date(date).setHours(0, 0, 0, 0);
		const s = new Date(start).setHours(0, 0, 0, 0);
		const e = new Date(end).setHours(0, 0, 0, 0);
		return d >= s && d <= e;
	}

	function isEventOnDay(event: CalendarEvent, day: Date) {
		const d = new Date(day).setHours(0, 0, 0, 0);
		const s = new Date(event.start).setHours(0, 0, 0, 0);
		const e = new Date(event.end).setHours(0, 0, 0, 0);
		return d >= s && d <= e;
	}

	let allDays = $derived(getDaysInMonth(ctx.currentDate(), ctx.weekStartsOn(), ctx.showWeekends()));
	let weekDays = $derived.by(() => {
		const base = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		let days = ctx.weekStartsOn() === 1 ? [...base.slice(1), base[0]] : base;
		if (!ctx.showWeekends()) return days.filter((d) => d !== 'Sat' && d !== 'Sun');
		return days;
	});
	let cols = $derived(ctx.showWeekends() ? 7 : 5);
</script>

<div class={cn('flex-1 flex flex-col min-h-0', className)}>
	<div
		class="grid border-b bg-muted/30"
		style="grid-template-columns: repeat({cols}, minmax(0, 1fr));"
	>
		{#each weekDays as day}
			<div
				class="py-3 text-center text-xs font-semibold uppercase text-muted-foreground tracking-wider border-r last:border-r-0"
			>
				{day}
			</div>
		{/each}
	</div>

	<div
		class="grid flex-1 auto-rows-fr"
		style="grid-template-columns: repeat({cols}, minmax(0, 1fr));"
	>
		{#each allDays as day, i}
			{@const isToday = isSameDay(day.date, todayDate)}
			{@const inRange = isInRange(day.date)}
			{@const isDisabled = ctx.isDateDisabled(day.date)}
			{@const isStart =
				ctx.selectedRange().start && isSameDay(day.date, ctx.selectedRange().start!)}
			{@const isEnd = ctx.selectedRange().end && isSameDay(day.date, ctx.selectedRange().end!)}
			{@const dayEvents = ctx.events().filter((e) => isEventOnDay(e, day.date))}

			<div
				class={cn(
					'relative border-b border-r transition-colors flex flex-col min-h-[80px]',
					!day.isCurrentMonth && 'bg-muted/5 text-muted-foreground/40',
					day.isCurrentMonth && 'bg-background',
					inRange && 'bg-primary/5',
					(i + 1) % cols === 0 && 'border-r-0',
					isDisabled && 'bg-muted/10 cursor-not-allowed opacity-60'
				)}
				onmousedown={(e) => !isDisabled && ctx.startSelection(day.date, e)}
				onmouseenter={() => !isDisabled && ctx.updateSelection(day.date)}
				onmouseup={() => ctx.endSelection()}
			>
				<div class="flex justify-between items-start p-2 pb-1 relative z-0">
					<span
						class={cn(
							'text-xs font-medium h-6 w-6 flex items-center justify-center rounded-full transition-colors relative z-10',
							isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
							(isStart || isEnd) && !isToday && 'bg-primary text-primary-foreground font-bold',
							isDisabled && 'text-muted-foreground/30'
						)}
					>
						{day.date.getDate()}
					</span>
				</div>

				<div class="relative flex-1 w-full overflow-y-clip hover:overflow-y-visible z-10">
					{#each dayEvents as event (event.id)}
						{@const isEventStart = isSameDay(event.start, day.date)}
						{@const isEventEnd = isSameDay(event.end, day.date)}
						{@const slotIndex = ctx.getEventSlot(day.date, event.id)}

						{@const isWeekStart = i % cols === 0}
						{@const isWeekEnd = (i + 1) % cols === 0}

						{@const visualStart = isEventStart || isWeekStart}
						{@const visualEnd = isEventEnd || isWeekEnd}

						<div
							class="absolute w-full px-0 transition-all duration-200 ease-in-out"
							style="top: {slotIndex * ROW_HEIGHT}px; height: {ROW_HEIGHT}px;"
						>
							{#if children}
								{@render children(event, {
									isStart: visualStart,
									isEnd: visualEnd,
									isMiddle: !visualStart && !visualEnd
								})}
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	div::-webkit-scrollbar {
		display: none;
	}
	div {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
