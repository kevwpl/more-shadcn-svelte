<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { setCalendarContext, type CalendarEvent, type DateRange } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		date = $bindable(new Date()),
		selected = $bindable({ start: undefined, end: undefined }),
		events = [],
		weekStartsOn = 1,
		showWeekends = true,
		isDateDisabled = () => false,
		children
	}: {
		class?: string;
		date?: Date;
		selected?: DateRange;
		events?: CalendarEvent[];
		weekStartsOn?: 0 | 1;
		showWeekends?: boolean;
		isDateDisabled?: (date: Date) => boolean;
		children: Snippet;
	} = $props();

	let isDragging = $state(false);

	let layoutMap = $derived.by(() => {
		const map = new Map<string, number>();
		const takenSlots = new Map<string, number[]>();

		const sorted = [...events].sort((a, b) => {
			const lenA = a.end.getTime() - a.start.getTime();
			const lenB = b.end.getTime() - b.start.getTime();
			if (lenA !== lenB) return lenB - lenA;
			return a.start.getTime() - b.start.getTime();
		});

		const getKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

		for (const ev of sorted) {
			let s = new Date(ev.start);
			s.setHours(0, 0, 0, 0);
			let e = new Date(ev.end);
			e.setHours(0, 0, 0, 0);

			let row = 0;
			let isRowFree = false;

			while (!isRowFree) {
				isRowFree = true;
				let curr = new Date(s);
				while (curr <= e) {
					const key = getKey(curr);
					const taken = takenSlots.get(key) || [];
					if (taken.includes(row)) {
						isRowFree = false;
						break;
					}
					curr.setDate(curr.getDate() + 1);
				}
				if (!isRowFree) row++;
			}

			let curr = new Date(s);
			while (curr <= e) {
				const key = getKey(curr);
				const taken = takenSlots.get(key) || [];
				taken.push(row);
				takenSlots.set(key, taken);

				map.set(`${key}::${ev.id}`, row);

				curr.setDate(curr.getDate() + 1);
			}
		}
		return map;
	});

	function getEventSlot(d: Date, id: string) {
		const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}::${id}`;
		return layoutMap.get(key) ?? 0;
	}

	function setDate(d: Date) {
		date = d;
	}

	function startSelection(d: Date, e?: MouseEvent) {
		if (isDateDisabled(d)) return;
		if (e?.shiftKey && selected.start) {
			isDragging = false;
			const currentStart = selected.start;
			const newEnd = d;
			selected =
				newEnd < currentStart
					? { start: newEnd, end: currentStart }
					: { start: currentStart, end: newEnd };
			return;
		}
		isDragging = true;
		selected = { start: d, end: d };
	}

	function updateSelection(d: Date) {
		if (isDateDisabled(d) || !isDragging || !selected.start) return;
		selected = { ...selected, end: d };
	}

	function endSelection() {
		isDragging = false;
		if (selected.start && selected.end && selected.start > selected.end) {
			selected = { start: selected.end, end: selected.start };
		}
	}

	function next() {
		const d = new Date(date);
		d.setMonth(d.getMonth() + 1);
		date = d;
	}
	function prev() {
		const d = new Date(date);
		d.setMonth(d.getMonth() - 1);
		date = d;
	}
	function today() {
		date = new Date();
	}

	setCalendarContext({
		currentDate: () => date,
		selectedRange: () => selected,
		events: () => events,
		weekStartsOn: () => weekStartsOn,
		showWeekends: () => showWeekends,
		isDragging: () => isDragging,
		isDateDisabled,
		getEventSlot,

		setDate,
		startSelection,
		updateSelection,
		endSelection,
		next,
		prev,
		today
	});
</script>

<svelte:window onmouseup={endSelection} />

<div
	class={cn(
		'flex flex-col h-full w-full bg-background border rounded-lg shadow-sm overflow-hidden select-none',
		className
	)}
>
	{@render children()}
</div>
