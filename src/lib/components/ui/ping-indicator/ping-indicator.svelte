<script lang="ts" module>
	export type PingStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'offline' | 'idle';

	export type PingThresholds = {
		/** Below this many ms every bar lights up. */
		excellent: number;
		good: number;
		fair: number;
	};

	export const PING_SIZES = {
		sm: { track: 'h-3 w-4', gap: 'gap-[1.5px]', text: 'text-[10px]' },
		md: { track: 'h-4 w-5', gap: 'gap-[2px]', text: 'text-xs' },
		lg: { track: 'h-6 w-8', gap: 'gap-[3px]', text: 'text-sm' }
	} as const;

	export type PingSize = keyof typeof PING_SIZES;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount, type Snippet } from 'svelte';

	let {
		url,
		probe,
		latency = $bindable<number | null>(null),
		bars = 4,
		interval = 3000,
		timeout = 5000,
		smoothing = 3,
		paused = false,
		pauseWhenHidden = true,
		thresholds = { excellent: 80, good: 200, fair: 500 },
		size = 'md',
		showLatency = false,
		label,
		class: className,
		onsample,
		children,
		...rest
	}: {
		/** Endpoint to time. Defaults to the current origin. Ignored when `probe` is set. */
		url?: string;
		/** Custom probe. Resolve with the round trip in ms, reject to show offline. */
		probe?: () => Promise<number>;
		/** Latest round trip, or null when the last probe failed. */
		latency?: number | null;
		bars?: number;
		interval?: number;
		timeout?: number;
		/** Number of recent samples to take the median of, so one blip cannot flicker the bars. */
		smoothing?: number;
		paused?: boolean;
		pauseWhenHidden?: boolean;
		thresholds?: PingThresholds;
		size?: PingSize;
		showLatency?: boolean;
		label?: string;
		class?: string;
		onsample?: (ms: number | null) => void;
		children?: Snippet<[{ status: PingStatus; level: number; latency: number | null }]>;
		[key: string]: unknown;
	} = $props();

	// Deliberately not reactive: the polling effect reads it, so tracking it here
	// would make every probe re-run the effect.
	let inFlight = false;
	let hidden = $state(false);
	let recent = $state<(number | null)[]>([]);

	/** Median of the recent window, ignoring failures unless every sample failed. */
	const smoothed = $derived.by(() => {
		const ok = recent.filter((v): v is number => v !== null);
		if (recent.length === 0) return undefined;
		if (ok.length === 0) return null;

		const sorted = [...ok].sort((a, b) => a - b);
		return sorted[Math.floor(sorted.length / 2)];
	});

	const status = $derived.by<PingStatus>(() => {
		if (smoothed === undefined) return 'idle';
		if (smoothed === null) return 'offline';
		if (smoothed <= thresholds.excellent) return 'excellent';
		if (smoothed <= thresholds.good) return 'good';
		if (smoothed <= thresholds.fair) return 'fair';
		return 'poor';
	});

	/** How many bars are lit, scaled to whatever `bars` is set to. */
	const level = $derived.by(() => {
		const ratio = { excellent: 1, good: 0.75, fair: 0.5, poor: 0.25, offline: 0, idle: 0 }[status];
		return Math.round(ratio * bars);
	});

	const STATUS_COLOR: Record<PingStatus, string> = {
		excellent: 'bg-emerald-500',
		good: 'bg-emerald-500',
		fair: 'bg-amber-500',
		poor: 'bg-orange-500',
		offline: 'bg-destructive',
		idle: 'bg-muted-foreground'
	};

	const STATUS_TEXT: Record<PingStatus, string> = {
		excellent: 'text-emerald-500',
		good: 'text-emerald-500',
		fair: 'text-amber-500',
		poor: 'text-orange-500',
		offline: 'text-destructive',
		idle: 'text-muted-foreground'
	};

	const STATUS_LABEL: Record<PingStatus, string> = {
		excellent: 'Excellent connection',
		good: 'Good connection',
		fair: 'Fair connection',
		poor: 'Poor connection',
		offline: 'Offline',
		idle: 'Checking connection'
	};

	const dimensions = $derived(PING_SIZES[size]);

	function record(ms: number | null) {
		latency = ms;
		recent = [...recent, ms].slice(-Math.max(1, smoothing));
		onsample?.(ms);
	}

	async function defaultProbe() {
		const target = url ?? (typeof window === 'undefined' ? '/' : window.location.origin);
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeout);
		const started = performance.now();

		try {
			await fetch(`${target}${target.includes('?') ? '&' : '?'}_ping=${Date.now()}`, {
				method: 'HEAD',
				cache: 'no-store',
				// Opaque responses still carry accurate timing and avoid CORS failures.
				mode: 'no-cors',
				signal: controller.signal
			});
			return performance.now() - started;
		} finally {
			clearTimeout(timer);
		}
	}

	export async function ping() {
		if (inFlight) return;
		inFlight = true;

		try {
			const ms = await (probe ?? defaultProbe)();
			record(Number.isFinite(ms) ? Math.round(ms) : null);
		} catch {
			record(null);
		} finally {
			inFlight = false;
		}
	}

	export function reset() {
		recent = [];
		latency = null;
	}

	const running = $derived(!paused && !(pauseWhenHidden && hidden));

	onMount(() => {
		const onVisibility = () => (hidden = document.visibilityState === 'hidden');
		onVisibility();
		document.addEventListener('visibilitychange', onVisibility);
		return () => document.removeEventListener('visibilitychange', onVisibility);
	});

	$effect(() => {
		if (!running) return;

		ping();
		const timer = setInterval(ping, interval);
		return () => clearInterval(timer);
	});
</script>

<span
	class={cn('inline-flex items-center gap-1.5', className)}
	role="status"
	aria-live="off"
	title={label ?? STATUS_LABEL[status]}
	aria-label={`${label ? `${label}: ` : ''}${STATUS_LABEL[status]}${
		latency === null ? '' : `, ${latency} ms`
	}`}
	{...rest}
>
	{#if children}
		{@render children({ status, level, latency })}
	{:else}
		<span class={cn('inline-flex items-end', dimensions.track, dimensions.gap)} aria-hidden="true">
			{#each Array.from({ length: bars }) as _, i}
				{@const lit = i < level}
				<span
					class={cn(
						'flex-1 rounded-[1px] transition-colors duration-300',
						lit ? STATUS_COLOR[status] : 'bg-muted-foreground/25',
						// The tallest lit bar breathes while a probe is in flight.
						lit && i === level - 1 && running && 'animate-pulse'
					)}
					style:height="{((i + 1) / bars) * 100}%"
				></span>
			{/each}
		</span>

		{#if status === 'offline'}
			<!-- Colour alone would not carry the state, so name it. -->
			<span class={cn('font-medium', dimensions.text, STATUS_TEXT.offline)}>offline</span>
		{:else if showLatency}
			<span class={cn('font-mono tabular-nums text-muted-foreground', dimensions.text)}>
				{latency === null ? '—' : `${latency} ms`}
			</span>
		{/if}

		{#if label && status !== 'offline' && !showLatency}
			<span class={cn('text-muted-foreground', dimensions.text)}>{label}</span>
		{/if}
	{/if}
</span>
