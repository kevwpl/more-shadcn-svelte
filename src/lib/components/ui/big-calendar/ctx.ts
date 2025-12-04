import { getContext, setContext } from 'svelte';

const CALENDAR_KEY = Symbol('big-calendar');

export type CalendarEvent = {
	id: string;
	title: string;
	date: Date;
	type?: 'default' | 'warning' | 'success' | 'destructive';
	[key: string]: any;
};

type CalendarContext = {
	currentDate: () => Date;
	selectedDate: () => Date | undefined;
	events: () => CalendarEvent[];
	setDate: (d: Date) => void;
	selectDate: (d: Date) => void;
	next: () => void;
	prev: () => void;
	today: () => void;
};

export function setCalendarContext(props: CalendarContext) {
	setContext(CALENDAR_KEY, props);
}

export function getCalendarContext() {
	return getContext<CalendarContext>(CALENDAR_KEY);
}
