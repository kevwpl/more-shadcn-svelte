<script lang="ts" module>
	export const SCRAMBLE_CHARACTERS =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}=+*^?#';

	export type ScrambleReveal = 'start' | 'end' | 'center' | 'random';

	function graphemes(value: string) {
		if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
			const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
			return Array.from(segmenter.segment(value), (s) => s.segment);
		}
		return Array.from(value);
	}
</script>

<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { MediaQuery } from 'svelte/reactivity';

	let {
		text,
		trigger = 'mount',
		duration = 900,
		interval = 45,
		characters = SCRAMBLE_CHARACTERS,
		reveal = 'start',
		class: className,
		oncomplete,
		...rest
	}: {
		text: string;
		/** `manual` only plays when you call `play()` through `bind:this`. */
		trigger?: 'mount' | 'hover' | 'view' | 'manual';
		/** Total time until every character has settled, in ms. */
		duration?: number;
		/** How often the unsettled characters change, in ms. Lower is busier. */
		interval?: number;
		characters?: string;
		/** Which end settles first. */
		reveal?: ScrambleReveal;
		class?: string;
		oncomplete?: () => void;
		[key: string]: unknown;
	} = $props();

	const reducedMotion = new MediaQuery('prefers-reduced-motion: reduce');

	const finalChars = $derived(graphemes(text));
	const pool = $derived(Array.from(characters));

	// Starts as the real text, so server rendering and no-JS readers see it.
	let display = $state<string[] | null>(null);
	let running = $state(false);
	let root = $state<HTMLSpanElement | null>(null);
	let ghost = $state<HTMLSpanElement | null>(null);
	let frame = 0;

	/**
	 * Whether the real text itself wraps. The noise is laid over it at exactly
	 * its width, so on a single line a frame of wider glyphs would otherwise
	 * break onto a second line — only text that genuinely wraps should.
	 */
	let multiline = $state(false);

	$effect(() => {
		const el = ghost;
		void text;
		if (!el) return;

		// An inline span returns one rect per line box it occupies.
		const measure = () => (multiline = el.getClientRects().length > 1);
		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(root ?? el);
		return () => observer.disconnect();
	});

	const randomChar = () => pool[Math.floor(Math.random() * pool.length)] ?? '';

	/** When each character settles, as a fraction of the duration. */
	function settleOrder(count: number): number[] {
		const span = Math.max(count - 1, 1);
		return Array.from({ length: count }, (_, i) => {
			if (reveal === 'end') return (count - 1 - i) / span;
			if (reveal === 'center') return Math.abs(i - (count - 1) / 2) / (span / 2 || 1);
			if (reveal === 'random') return Math.random();
			return i / span;
		});
	}

	export function play() {
		cancelAnimationFrame(frame);

		const chars = finalChars;
		if (reducedMotion.current || chars.length === 0) {
			display = null;
			oncomplete?.();
			return;
		}

		// Everything scrambles for the first fifth, then settles in order — so
		// even the first character gets a moment of noise.
		const settleAt = settleOrder(chars.length).map((f) => duration * (0.2 + f * 0.8));
		const start = performance.now();
		let last = -Infinity;
		running = true;

		const step = (now: number) => {
			const elapsed = now - start;

			if (elapsed >= duration) {
				display = null;
				running = false;
				oncomplete?.();
				return;
			}

			if (now - last >= interval) {
				last = now;
				display = chars.map((c, i) => (/\s/.test(c) || elapsed >= settleAt[i] ? c : randomChar()));
			}

			frame = requestAnimationFrame(step);
		};

		frame = requestAnimationFrame(step);
	}

	export function reset() {
		cancelAnimationFrame(frame);
		display = null;
		running = false;
	}

	$effect(() => {
		// Replay whenever the text itself changes after the first run.
		void finalChars;
		if (trigger !== 'mount') return;
		play();
	});

	$effect(() => {
		if (trigger !== 'view' || !root) return;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				play();
				observer.disconnect();
			}
		});
		observer.observe(root);
		return () => observer.disconnect();
	});

	// An effect cleanup rather than onDestroy: onDestroy also runs during server
	// rendering, where requestAnimationFrame does not exist.
	$effect(() => () => cancelAnimationFrame(frame));
</script>

<span
	bind:this={root}
	role={trigger === 'hover' ? 'presentation' : undefined}
	onmouseenter={() => {
		if (trigger === 'hover' && !running) play();
	}}
	class={cn('relative inline-block', className)}
	{...rest}
>
	<span class="sr-only">{text}</span>
	<!-- The invisible copy alone sizes the box. The noise is laid over it
	     absolutely, so wider glyphs can spill over but never resize anything —
	     a shared grid cell would still grow to fit the widest frame. -->
	<span bind:this={ghost} class="invisible whitespace-pre-wrap" aria-hidden="true">{text}</span>
	<span
		class={cn('absolute inset-0', multiline ? 'whitespace-pre-wrap' : 'whitespace-pre')}
		aria-hidden="true">{display ? display.join('') : text}</span
	>
</span>
