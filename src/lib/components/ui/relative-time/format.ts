export type DateInput = Date | string | number;

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/**
 * Largest first: [unit, length in ms, how many make up the next unit up].
 * The count is what rounding is compared against — comparing milliseconds
 * fails for months, since twelve 30-day months never reach a 365-day year.
 * Weeks never need it: anything 30 days or older is already counted in months.
 */
const UNITS: [Intl.RelativeTimeFormatUnit, number, number][] = [
	['year', 365 * DAY, Infinity],
	['month', 30 * DAY, 12],
	['week', 7 * DAY, Infinity],
	['day', DAY, 7],
	['hour', HOUR, 24],
	['minute', MINUTE, 60],
	['second', SECOND, 60]
];

export function toTime(input: DateInput) {
	return input instanceof Date ? input.getTime() : new Date(input).getTime();
}

export type RelativeParts = { value: number; unit: Intl.RelativeTimeFormatUnit };

/**
 * Rounds halves away from zero. Math.round(-1.5) is -1 but Math.round(1.5) is
 * 2, which would make a past date and a future one round differently.
 */
const round = (n: number) => Math.sign(n) * Math.round(Math.abs(n));

/**
 * Picks the largest unit that fits and rounds within it. Rounding matters for
 * future dates: truncating would make something 47 hours away read "tomorrow".
 * When rounding reaches the next unit up — 59.6 minutes — that unit is used
 * instead, so it reads "1 hour" rather than "60 minutes".
 */
export function relativeParts(diff: number, nowThreshold = 10 * SECOND): RelativeParts {
	if (Math.abs(diff) < nowThreshold) return { value: 0, unit: 'second' };

	const index = UNITS.findIndex(([, ms]) => Math.abs(diff) >= ms);
	const i = index === -1 ? UNITS.length - 1 : index;
	const [unit, ms, perLarger] = UNITS[i];
	const value = round(diff / ms);

	const larger = UNITS[i - 1];
	if (larger && Math.abs(value) >= perLarger) {
		return { value: round(diff / larger[1]), unit: larger[0] };
	}

	return { value, unit };
}

export type FormatRelativeOptions = {
	locale?: string | string[];
	style?: Intl.RelativeTimeFormatStyle;
	/** `auto` gives "yesterday" and "now"; `always` gives "1 day ago" and "in 0 seconds". */
	numeric?: Intl.RelativeTimeFormatNumeric;
	/** Within this many ms of now, read "now". */
	nowThreshold?: number;
	now?: number;
};

/** Formats a date relative to now, e.g. "3 minutes ago" or "in 2 days". */
export function formatRelative(input: DateInput, options: FormatRelativeOptions = {}) {
	const { locale, style = 'long', numeric = 'auto', nowThreshold, now = Date.now() } = options;
	const time = toTime(input);
	if (Number.isNaN(time)) return '';

	const { value, unit } = relativeParts(time - now, nowThreshold);
	return new Intl.RelativeTimeFormat(locale, { style, numeric }).format(value, unit);
}
