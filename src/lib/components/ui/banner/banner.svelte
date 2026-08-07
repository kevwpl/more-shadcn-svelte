<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export type BannerPersist = 'local' | 'session' | 'none';

	export const bannerVariants = tv({
		base: 'relative flex w-full items-center gap-3 border-b px-4 py-2.5 text-sm',
		variants: {
			variant: {
				default: 'bg-muted text-foreground border-border',
				primary: 'bg-primary text-primary-foreground border-primary',
				info: 'bg-blue-500/10 text-blue-900 border-blue-500/20 dark:text-blue-200',
				success: 'bg-emerald-500/10 text-emerald-900 border-emerald-500/20 dark:text-emerald-200',
				warning: 'bg-amber-500/10 text-amber-900 border-amber-500/20 dark:text-amber-200',
				destructive: 'bg-destructive/10 text-destructive border-destructive/20'
			},
			align: {
				start: 'justify-start',
				center: 'justify-center text-center'
			}
		},
		defaultVariants: {
			variant: 'default',
			align: 'start'
		}
	});

	export type BannerVariant = VariantProps<typeof bannerVariants>['variant'];
	export type BannerAlign = VariantProps<typeof bannerVariants>['align'];

	export const bannerStorageKey = (id: string) => `more-shadcn:banner:${id}`;

	function storageFor(persist: BannerPersist): Storage | null {
		if (persist === 'none' || typeof window === 'undefined') return null;
		try {
			return persist === 'session' ? window.sessionStorage : window.localStorage;
		} catch {
			// Storage can throw in private mode or when blocked by the browser.
			return null;
		}
	}

	export function isBannerDismissed(id: string, persist: BannerPersist = 'local') {
		return storageFor(persist)?.getItem(bannerStorageKey(id)) === 'dismissed';
	}

	export function dismissBanner(id: string, persist: BannerPersist = 'local') {
		storageFor(persist)?.setItem(bannerStorageKey(id), 'dismissed');
	}

	/** Clears a stored dismissal so the banner shows again. */
	export function resetBanner(id: string, persist: BannerPersist = 'local') {
		storageFor(persist)?.removeItem(bannerStorageKey(id));
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { X } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let {
		id = 'banner',
		open = $bindable(true),
		persist = 'local',
		variant = 'default',
		align = 'start',
		dismissible = true,
		sticky = false,
		closeLabel = 'Dismiss',
		class: className,
		ondismiss,
		icon,
		action,
		children,
		...rest
	}: {
		id?: string;
		open?: boolean;
		persist?: BannerPersist;
		variant?: BannerVariant;
		align?: BannerAlign;
		dismissible?: boolean;
		sticky?: boolean;
		closeLabel?: string;
		class?: string;
		ondismiss?: () => void;
		icon?: Snippet;
		action?: Snippet;
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	// With persistence the banner stays hidden until the stored value is read,
	// otherwise a dismissed banner would flash on every page load.
	let ready = $state(persist === 'none');

	$effect(() => {
		if (ready) return;
		if (isBannerDismissed(id, persist)) open = false;
		ready = true;
	});

	function dismiss() {
		open = false;
		dismissBanner(id, persist);
		ondismiss?.();
	}
</script>

{#if ready && open}
	<div
		{id}
		role="region"
		aria-label="Banner"
		transition:slide={{ duration: 200 }}
		class={cn(bannerVariants({ variant, align }), sticky && 'sticky top-0 z-50', className)}
		{...rest}
	>
		{#if icon}
			<span class="flex shrink-0 items-center">{@render icon()}</span>
		{/if}

		<div class={cn('min-w-0 flex-1', align === 'center' && 'text-center')}>
			{@render children()}
		</div>

		{#if action}
			<div class="flex shrink-0 items-center gap-2">{@render action()}</div>
		{/if}

		{#if dismissible}
			<button
				type="button"
				onclick={dismiss}
				aria-label={closeLabel}
				class={cn(
					'ml-1 shrink-0 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
					align === 'center' && 'absolute right-3 top-1/2 -translate-y-1/2'
				)}
			>
				<X class="size-4" />
			</button>
		{/if}
	</div>
{/if}
