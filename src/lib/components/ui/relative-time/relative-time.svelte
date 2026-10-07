<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { clock } from './clock.svelte';
	import { DAY, HOUR, MINUTE, relativeParts, toTime, type DateInput } from './format';

	let {
		date,
		locale,
		style = 'long',
		numeric = 'auto',
		live = true,
		nowThreshold = 10_000,
		absoluteAfter,
		absoluteFormat,
		tooltipFormat = { dateStyle: 'full', timeStyle: 'short' },
		tooltip = true,
		class: className,
		...rest
	}: {
		date: DateInput;
		locale?: string | string[];
		style?: Intl.RelativeTimeFormatStyle;
		/** `auto` reads "yesterday" and "now"; `always` reads "1 day ago". */
		numeric?: Intl.RelativeTimeFormatNumeric;
		/** Keep the label current. Off renders once and stays put. */
		live?: boolean;
		/** Within this many ms of now, read "now". */
		nowThreshold?: number;
		/** Past this age in ms, switch to a plain date — "Mar 3" reads better than "7 months ago". */
		absoluteAfter?: number;
		/** Format for the plain date. Defaults to month and day, plus the year when it differs. */
		absoluteFormat?: Intl.DateTimeFormatOptions;
		/** Format for the exact timestamp shown on hover. */
		tooltipFormat?: Intl.DateTimeFormatOptions;
		tooltip?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const id = Symbol('relative-time');

	const time = $derived(toTime(date));
	const valid = $derived(!Number.isNaN(time));
	const age = $derived(Math.abs(clock.now - time));

	// Constructing Intl formatters is not free, so they are rebuilt only when
	// their options change, not on every tick.
	const relativeFormatter = $derived(new Intl.RelativeTimeFormat(locale, { style, numeric }));
	const tooltipFormatter = $derived(new Intl.DateTimeFormat(locale, tooltipFormat));

	const absoluteFormatter = $derived.by(() => {
		if (absoluteFormat) return new Intl.DateTimeFormat(locale, absoluteFormat);
		const sameYear = valid && new Date(time).getFullYear() === new Date(clock.now).getFullYear();
		return new Intl.DateTimeFormat(
			locale,
			sameYear ? { month: 'short', day: 'numeric' } : { dateStyle: 'medium' }
		);
	});

	const showAbsolute = $derived(absoluteAfter !== undefined && age > absoluteAfter);

	const label = $derived.by(() => {
		if (!valid) return '—';
		if (showAbsolute) return absoluteFormatter.format(time);
		const { value, unit } = relativeParts(time - clock.now, nowThreshold);
		return relativeFormatter.format(value, unit);
	});

	/** How often the label can actually change at this age. */
	const cadence = $derived.by(() => {
		if (!live || !valid || showAbsolute) return 0;
		if (age < MINUTE) return 1000;
		if (age < HOUR) return 10_000;
		if (age < DAY) return 60_000;
		return 10 * MINUTE;
	});

	$effect(() => {
		if (!cadence) return;
		clock.demand(id, cadence);
		return () => clock.release(id);
	});

	// The server rendered this with its own clock, and the shared clock may have
	// been idle — correct both straight away.
	onMount(() => clock.sync());
</script>

<time
	datetime={valid ? new Date(time).toISOString() : undefined}
	title={tooltip && valid ? tooltipFormatter.format(time) : undefined}
	class={cn('tabular-nums', className)}
	{...rest}
>
	{label}
</time>
