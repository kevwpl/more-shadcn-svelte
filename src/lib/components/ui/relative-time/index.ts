import RelativeTime from './relative-time.svelte';

export { RelativeTime, RelativeTime as Root };
export { formatRelative, relativeParts, SECOND, MINUTE, HOUR, DAY } from './format';
export type { DateInput, FormatRelativeOptions, RelativeParts } from './format';
