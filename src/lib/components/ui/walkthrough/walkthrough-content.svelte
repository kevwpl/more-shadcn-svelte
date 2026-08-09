<script lang="ts">
	import { onDestroy } from 'svelte';
	import { computePosition, autoUpdate, offset, shift, arrow, flip } from '@floating-ui/dom';
	import { fade } from 'svelte/transition';
	import { getWalkthroughContext } from './ctx';
	import { Button } from '$lib/components/ui/button';
	import { X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let {
		targetId,
		placement = 'bottom',
		onUpdateRect,
		contentSnippet,
		padding = 0
	}: {
		/** Omit to centre the step instead of anchoring it to an element. */
		targetId?: string;
		placement?: 'top' | 'bottom' | 'left' | 'right';
		onUpdateRect: (rect: { top: number; left: number; width: number; height: number }) => void;
		contentSnippet?: Snippet<[any]>;
		padding?: number;
	} = $props();

	const ctx = getWalkthroughContext();

	let tooltipEl: HTMLElement;
	let arrowEl: HTMLElement | undefined;
	let cleanup: (() => void) | undefined;

	let actualPlacement = $state(placement);
	/** True when there is nothing to anchor to, so the step floats in the middle. */
	let centered = $state(false);

	function updateSpotlight(el: HTMLElement) {
		const rect = el.getBoundingClientRect();

		const paddedWidth = rect.width + padding * 2;
		const paddedHeight = rect.height + padding * 2;
		const paddedTop = rect.top - padding;
		const paddedLeft = rect.left - padding;

		onUpdateRect({
			top: paddedTop,
			left: paddedLeft,
			width: paddedWidth,
			height: paddedHeight
		});
	}

	/**
	 * Parks the step in the middle of the viewport and collapses the spotlight to
	 * a zero sized hole, so the overlay dims everything and highlights nothing.
	 */
	function centerTooltip() {
		if (!tooltipEl) return;

		// A zero sized anchor at the middle of the viewport. Going through
		// floating-ui rather than `left: 50%` matters: a `position: fixed` element
		// resolves percentages against the nearest transformed ancestor, so a
		// parent with a transform would throw the step well off centre.
		const viewportCenter = {
			getBoundingClientRect: () => {
				const x = window.innerWidth / 2;
				const y = window.innerHeight / 2;
				return { width: 0, height: 0, x, y, top: y, bottom: y, left: x, right: x };
			}
		};

		const place = () => {
			onUpdateRect({
				top: window.innerHeight / 2,
				left: window.innerWidth / 2,
				width: 0,
				height: 0
			});

			computePosition(viewportCenter, tooltipEl, {
				placement: 'bottom',
				strategy: 'fixed',
				// Pulling up by half the height turns "below the point" into "on it".
				middleware: [offset(({ rects }) => -rects.floating.height / 2), shift({ padding: 10 })]
			}).then(({ x, y }) => {
				Object.assign(tooltipEl.style, {
					position: 'fixed',
					left: `${x}px`,
					top: `${y}px`,
					transform: '',
					display: 'block'
				});
			});
		};

		place();

		window.addEventListener('resize', place);
		cleanup = () => window.removeEventListener('resize', place);
	}

	function setupFloating(targetEl: HTMLElement) {
		if (!tooltipEl) return;

		updateSpotlight(targetEl);

		const rect = targetEl.getBoundingClientRect();
		const isVisible =
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth);

		if (!isVisible) {
			targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}

		const middleware = [offset(12), flip(), shift({ padding: 10 })];
		if (arrowEl) middleware.push(arrow({ element: arrowEl }));

		cleanup = autoUpdate(targetEl, tooltipEl, () => {
			updateSpotlight(targetEl);

			computePosition(targetEl, tooltipEl, {
				placement,
				middleware,
				strategy: 'fixed'
			}).then(({ x, y, placement: finalPlacement, middlewareData }) => {
				Object.assign(tooltipEl.style, {
					left: `${x}px`,
					top: `${y}px`,
					position: 'fixed',
					// Cleared in case the previous step was a centred one.
					transform: '',
					display: 'block'
				});

				actualPlacement = finalPlacement as any;

				if (arrowEl && middlewareData.arrow) {
					const { x: arrowX, y: arrowY } = middlewareData.arrow;
					const staticSide = {
						top: 'bottom',
						right: 'left',
						bottom: 'top',
						left: 'right'
					}[finalPlacement.split('-')[0]];

					Object.assign(arrowEl.style, {
						left: arrowX != null ? `${arrowX}px` : '',
						top: arrowY != null ? `${arrowY}px` : '',
						right: '',
						bottom: '',
						[staticSide as string]: '-4px'
					});
				}
			});
		});
	}

	$effect(() => {
		const id = targetId;

		if (cleanup) {
			cleanup();
			cleanup = undefined;
		}

		// The delay lets the step's target mount before it is looked up.
		const timer = setTimeout(() => {
			const targetEl = id ? document.getElementById(id) : null;

			// No id, or an id that resolves to nothing — centre it rather than
			// leaving the step stranded in the corner.
			centered = !targetEl;

			if (targetEl) setupFloating(targetEl);
			else centerTooltip();
		}, 10);

		return () => {
			clearTimeout(timer);
			if (cleanup) {
				cleanup();
				cleanup = undefined;
			}
		};
	});

	onDestroy(() => {
		if (cleanup) cleanup();
	});

	let arrowClasses = $derived.by(() => {
		const side = actualPlacement.split('-')[0];
		const base = 'absolute h-2 w-2 rotate-45 bg-popover';
		if (side === 'top') return `${base} border-b border-r`;
		if (side === 'bottom') return `${base} border-t border-l`;
		if (side === 'left') return `${base} border-t border-r`;
		if (side === 'right') return `${base} border-b border-l`;
		return `${base} border-t border-l`;
	});
</script>

<div
	bind:this={tooltipEl}
	role="dialog"
	class="fixed z-[9999] top-0 left-0 w-max outline-none"
	transition:fade={{ duration: 200 }}
>
	{#if contentSnippet}
		{@render contentSnippet(ctx)}
	{:else}
		<div class="relative w-[350px] rounded-lg border bg-popover text-popover-foreground shadow-xl">
			{#if !centered}
				<!-- An arrow would be pointing at nothing on a centred step. -->
				<div bind:this={arrowEl} class={arrowClasses}></div>
			{/if}

			<div class="p-4">
				<div class="flex items-start justify-between gap-4">
					<div class="space-y-1">
						<h4 class="font-semibold leading-none">{ctx.currentStep()?.title}</h4>
						<p class="text-sm text-muted-foreground">{ctx.currentStep()?.description}</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						class="h-6 w-6 -mt-1 -mr-2 shrink-0"
						onclick={ctx.close}
					>
						<X class="h-4 w-4" />
					</Button>
				</div>
				<div class="flex items-center justify-between pt-4">
					<span class="text-xs text-muted-foreground">
						Step {ctx.currentStepIndex() + 1}
					</span>
					<div class="flex gap-2">
						{#if ctx.currentStepIndex() > 0}
							<Button variant="outline" size="sm" onclick={ctx.prev}>Back</Button>
						{/if}
						<Button size="sm" onclick={ctx.next}>
							{ctx.isLastStep() ? 'Finish' : 'Next'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
