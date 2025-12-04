<script lang="ts">
	import { cn } from '$lib/utils';
	import { setCalendarContext, type CalendarEvent } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		date = $bindable(new Date()),
		selected = $bindable(),
		events = [],
		children
	}: {
		class?: string;
		date?: Date;
		selected?: Date;
		events?: CalendarEvent[];
		children: Snippet;
	} = $props();

	function setDate(d: Date) {
		date = d;
	}
	function selectDate(d: Date) {
		selected = d;
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
		selectedDate: () => selected,
		events: () => events,
		setDate,
		selectDate,
		next,
		prev,
		today
	});
</script>

<div
	class={cn(
		'flex flex-col h-full w-full bg-background border rounded-lg shadow-sm overflow-hidden',
		className
	)}
>
	{@render children()}
</div>
