<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	/** Message a waiting service worker must handle to activate immediately. */
	export const SKIP_WAITING_MESSAGE = { type: 'SKIP_WAITING' };

	export const updateBannerVariants = tv({
		base: 'z-50 flex items-start gap-3 rounded-lg border bg-popover p-3 text-sm text-popover-foreground shadow-lg',
		variants: {
			position: {
				inline: 'w-full',
				'bottom-right': 'fixed bottom-4 right-4 w-[min(22rem,calc(100vw-2rem))]',
				'bottom-left': 'fixed bottom-4 left-4 w-[min(22rem,calc(100vw-2rem))]',
				'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(28rem,calc(100vw-2rem))]',
				'top-center': 'fixed top-4 left-1/2 -translate-x-1/2 w-[min(28rem,calc(100vw-2rem))]'
			}
		},
		defaultVariants: { position: 'bottom-right' }
	});

	export type UpdateBannerPosition = VariantProps<typeof updateBannerVariants>['position'];
	export type UpdateSource = 'service-worker' | 'manual';
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount, type Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { RefreshCw, Sparkles, X } from '@lucide/svelte';

	let {
		available = $bindable(false),
		source = 'service-worker',
		scope,
		pollInterval = 0,
		position = 'bottom-right',
		title = 'A new version is available',
		description = 'Reload to get the latest version of the app.',
		reloadLabel = 'Reload',
		dismissLabel = 'Later',
		dismissible = true,
		autoReloadAfter,
		reloadTimeout = 3000,
		class: className,
		onreload,
		ondismiss,
		onupdatefound,
		icon,
		children,
		...rest
	}: {
		/** Whether an update is waiting. Bindable so you can drive it yourself. */
		available?: boolean;
		/** `manual` skips all service worker wiring and only uses `available`. */
		source?: UpdateSource;
		/** Service worker scope to look up. Defaults to the closest registration. */
		scope?: string;
		/** Milliseconds between `registration.update()` checks. 0 disables polling. */
		pollInterval?: number;
		position?: UpdateBannerPosition;
		title?: string;
		description?: string;
		reloadLabel?: string;
		dismissLabel?: string;
		dismissible?: boolean;
		/** Seconds to wait before reloading on its own. Omit to always ask first. */
		autoReloadAfter?: number;
		/** How long to wait for `controllerchange` before reloading anyway. */
		reloadTimeout?: number;
		class?: string;
		/** Return `false` to cancel the reload and just close the prompt. */
		onreload?: () => boolean | void;
		ondismiss?: () => void;
		onupdatefound?: (worker: ServiceWorker) => void;
		icon?: Snippet;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	let registration: ServiceWorkerRegistration | null = null;
	let waiting: ServiceWorker | null = null;
	let reloading = $state(false);
	let secondsLeft = $state<number | null>(null);

	function markAvailable(worker: ServiceWorker) {
		waiting = worker;
		available = true;
		onupdatefound?.(worker);
	}

	/** Checks a registration for a worker that has installed but not taken over yet. */
	function inspect(reg: ServiceWorkerRegistration) {
		if (reg.waiting && navigator.serviceWorker.controller) markAvailable(reg.waiting);

		reg.addEventListener('updatefound', () => {
			const installing = reg.installing;
			if (!installing) return;

			installing.addEventListener('statechange', () => {
				// Without an existing controller this is the very first install,
				// which is not an update the user needs to act on.
				if (installing.state === 'installed' && navigator.serviceWorker.controller) {
					markAvailable(installing);
				}
			});
		});
	}

	export async function check() {
		await registration?.update();
	}

	export async function reload() {
		if (reloading) return;

		if (onreload?.() === false) {
			available = false;
			secondsLeft = null;
			return;
		}

		reloading = true;

		if (!waiting) return window.location.reload();

		// Reload once the new worker has actually taken control, with a timeout so
		// a worker that ignores SKIP_WAITING cannot leave the app stuck.
		let done = false;
		const go = () => {
			if (done) return;
			done = true;
			window.location.reload();
		};

		navigator.serviceWorker.addEventListener('controllerchange', go, { once: true });
		setTimeout(go, reloadTimeout);
		waiting.postMessage(SKIP_WAITING_MESSAGE);
	}

	function dismiss() {
		available = false;
		secondsLeft = null;
		ondismiss?.();
	}

	onMount(() => {
		if (source !== 'service-worker' || typeof navigator === 'undefined') return;
		if (!('serviceWorker' in navigator)) return;

		let poll: ReturnType<typeof setInterval> | undefined;

		navigator.serviceWorker.getRegistration(scope).then((reg) => {
			if (!reg) return;
			registration = reg;
			inspect(reg);

			if (pollInterval > 0) poll = setInterval(() => reg.update(), pollInterval);
		});

		return () => clearInterval(poll);
	});

	// Countdown to an unattended reload.
	$effect(() => {
		if (!available || autoReloadAfter === undefined) {
			secondsLeft = null;
			return;
		}

		secondsLeft = autoReloadAfter;
		const timer = setInterval(() => {
			const next = (secondsLeft ?? 0) - 1;
			secondsLeft = next;
			if (next <= 0) {
				clearInterval(timer);
				reload();
			}
		}, 1000);

		return () => clearInterval(timer);
	});
</script>

{#if available}
	<div
		role="alert"
		aria-live="polite"
		transition:fly={{ y: position === 'top-center' ? -12 : 12, duration: 200 }}
		class={cn(updateBannerVariants({ position }), className)}
		{...rest}
	>
		<span class="mt-0.5 flex shrink-0 text-primary">
			{#if icon}
				{@render icon()}
			{:else}
				<Sparkles class="size-4" />
			{/if}
		</span>

		<div class="min-w-0 flex-1">
			{#if children}
				{@render children()}
			{:else}
				<p class="font-medium leading-none">{title}</p>
				<p class="mt-1 text-xs text-muted-foreground">
					{description}
					{#if secondsLeft !== null}
						<span class="font-mono">Reloading in {secondsLeft}s.</span>
					{/if}
				</p>
			{/if}

			<div class="mt-3 flex items-center gap-2">
				<Button size="sm" onclick={reload} disabled={reloading}>
					<RefreshCw class={cn('size-3.5', reloading && 'animate-spin')} />
					{reloadLabel}
				</Button>
				{#if dismissible}
					<Button size="sm" variant="ghost" onclick={dismiss}>{dismissLabel}</Button>
				{/if}
			</div>
		</div>

		{#if dismissible}
			<button
				type="button"
				onclick={dismiss}
				aria-label={dismissLabel}
				class="shrink-0 rounded-sm p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				<X class="size-4" />
			</button>
		{/if}
	</div>
{/if}
