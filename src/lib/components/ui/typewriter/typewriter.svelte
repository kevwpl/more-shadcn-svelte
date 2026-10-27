<script lang="ts" module>
	/** Splits into user-perceived characters so emoji and accents are never cut in half. */
	export function graphemes(value: string) {
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
		speed = 60,
		deleteSpeed = 35,
		pause = 1600,
		startDelay = 0,
		loop = true,
		humanize = true,
		cursor = true,
		trigger = 'mount',
		reserveSpace = false,
		class: className,
		cursorClass,
		oncomplete,
		...rest
	}: {
		/** One string types once; several cycle, deleting each before the next. */
		text: string | string[];
		/** Milliseconds per character while typing. */
		speed?: number;
		/** Milliseconds per character while deleting. */
		deleteSpeed?: number;
		/** How long a finished string stays up before it is deleted. */
		pause?: number;
		startDelay?: number;
		/** Keep cycling through several strings. Has no effect on a single one. */
		loop?: boolean;
		/** Vary the per-character delay a little, so it reads as typed rather than printed. */
		humanize?: boolean;
		/** `true` for a caret bar, a string to use that character, `false` for none. */
		cursor?: boolean | string;
		/** `view` waits until the text scrolls into view. */
		trigger?: 'mount' | 'view';
		/** Size to the widest phrase up front, so surrounding layout does not shift. */
		reserveSpace?: boolean;
		class?: string;
		cursorClass?: string;
		oncomplete?: () => void;
		[key: string]: unknown;
	} = $props();

	const reducedMotion = new MediaQuery('prefers-reduced-motion: reduce');

	const items = $derived(Array.isArray(text) ? text : [text]);

	let shown = $state('');
	let typing = $state(false);
	let started = $state(false);
	let root = $state<HTMLSpanElement | null>(null);

	function sleep(ms: number, signal: AbortSignal) {
		return new Promise<void>((resolve, reject) => {
			const timer = setTimeout(resolve, ms);
			signal.addEventListener(
				'abort',
				() => {
					clearTimeout(timer);
					reject(signal.reason);
				},
				{ once: true }
			);
		});
	}

	const jitter = (ms: number) => (humanize ? ms * (0.6 + Math.random() * 0.8) : ms);

	async function run(list: string[], signal: AbortSignal) {
		await sleep(startDelay, signal);

		const cycles = list.length > 1 && loop;
		let index = 0;

		while (true) {
			const chars = graphemes(list[index]);

			typing = true;
			for (let i = 1; i <= chars.length; i++) {
				shown = chars.slice(0, i).join('');
				await sleep(jitter(speed), signal);
			}
			typing = false;

			const isLast = index === list.length - 1;
			if (isLast && !cycles) {
				oncomplete?.();
				return;
			}

			await sleep(pause, signal);

			typing = true;
			for (let i = chars.length - 1; i >= 0; i--) {
				shown = chars.slice(0, i).join('');
				await sleep(deleteSpeed, signal);
			}
			typing = false;

			index = (index + 1) % list.length;
		}
	}

	$effect(() => {
		if (trigger === 'mount') {
			started = true;
			return;
		}
		if (!root) return;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				started = true;
				observer.disconnect();
			}
		});
		observer.observe(root);
		return () => observer.disconnect();
	});

	$effect(() => {
		const list = items;
		// Read so changing any of them restarts the animation.
		void [speed, deleteSpeed, pause, startDelay, loop, humanize];

		if (!started) {
			shown = '';
			return;
		}

		if (reducedMotion.current) {
			shown = list[0] ?? '';
			typing = false;
			return;
		}

		shown = '';
		const controller = new AbortController();
		run(list, controller.signal).catch(() => {
			// Aborted by a restart or unmount.
		});
		return () => controller.abort();
	});
</script>

{#snippet caret()}
	{#if cursor}
		<span
			class={cn(
				typeof cursor === 'string'
					? 'ml-px'
					: 'ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-current',
				cursorClass
			)}
			class:typewriter-blink={!typing}
			aria-hidden="true">{typeof cursor === 'string' ? cursor : ''}</span
		>
	{/if}
{/snippet}

<span bind:this={root} class={cn('whitespace-pre-wrap', className)} {...rest}>
	<!-- Screen readers get the text once, not every keystroke. -->
	<span class="sr-only">{items.join(', ')}</span>

	{#if reserveSpace}
		<span class="inline-grid" aria-hidden="true">
			<!-- Every phrase sits invisibly in the same cell, so the box fits the widest
			     one in pixels. Character count is not enough: "WWW" is wider than "iiiii". -->
			{#each items as item}
				<span class="invisible col-start-1 row-start-1">{item}{@render caret()}</span>
			{/each}
			<span class="col-start-1 row-start-1">{shown}{@render caret()}</span>
		</span>
	{:else}
		<span aria-hidden="true">{shown}{@render caret()}</span>
	{/if}
</span>

<style>
	.typewriter-blink {
		animation: typewriter-blink 1.05s step-end infinite;
	}

	@keyframes typewriter-blink {
		50% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.typewriter-blink {
			animation: none;
		}
	}
</style>
