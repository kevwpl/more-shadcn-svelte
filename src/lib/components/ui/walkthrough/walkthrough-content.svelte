<script lang="ts">
    import { onDestroy } from "svelte";
    import { computePosition, autoUpdate, offset, shift, arrow, flip } from "@floating-ui/dom";
    import { fade } from "svelte/transition";
    import { getWalkthroughContext } from "./ctx";
    import { Button } from "$lib/components/ui/button";
    import { X } from "@lucide/svelte";
    import type { Snippet } from "svelte";

    let {
        targetId,
        placement = "bottom",
        onUpdateRect,
        contentSnippet,
        padding = 0,
    }: {
        targetId: string,
        placement?: "top" | "bottom" | "left" | "right",
        onUpdateRect: (rect: {top: number, left: number, width: number, height: number}) => void,
        contentSnippet?: Snippet<[any]>,
        padding?: number,
    } = $props();

    const ctx = getWalkthroughContext();

    let tooltipEl: HTMLElement;
    let arrowEl: HTMLElement | undefined;
    let cleanup: (() => void) | undefined;

    // Track the final computed placement to rotate the arrow correctly
    let actualPlacement = $state(placement);

    function updateSpotlight(el: HTMLElement) {
        const rect = el.getBoundingClientRect();
        // Always send Viewport coordinates (fixed strategy)

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

    function setupFloating() {
        const targetEl = document.getElementById(targetId);
        if (!targetEl || !tooltipEl) return;

        updateSpotlight(targetEl);

        const rect = targetEl.getBoundingClientRect();
        const isVisible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

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
                    display: 'block'
                });

                // Update state for arrow rotation
                actualPlacement = finalPlacement as any;

                if (arrowEl && middlewareData.arrow) {
                    const { x: arrowX, y: arrowY } = middlewareData.arrow;
                    const staticSide = {
                        top: "bottom", right: "left", bottom: "top", left: "right"
                    }[finalPlacement.split("-")[0]];

                    Object.assign(arrowEl.style, {
                        left: arrowX != null ? `${arrowX}px` : "",
                        top: arrowY != null ? `${arrowY}px` : "",
                        right: "", bottom: "",
                        [staticSide as string]: "-4px"
                    });
                }
            });
        });
    }

    $effect(() => {
        if(targetId) {
            if(cleanup) cleanup();
            setTimeout(setupFloating, 10);
        }
    });

    onDestroy(() => {
        if (cleanup) cleanup();
    });

    // Calculate Arrow Rotation Classes
    let arrowClasses = $derived.by(() => {
        const side = actualPlacement.split("-")[0];
        const base = "absolute h-2 w-2 rotate-45 bg-popover";
        // Top placement -> Arrow at bottom -> Points Down -> Border Bottom & Right
        if (side === "top") return `${base} border-b border-r`;
        // Bottom placement -> Arrow at top -> Points Up -> Border Top & Left
        if (side === "bottom") return `${base} border-t border-l`;
        // Left placement -> Arrow at right -> Points Right -> Border Top & Right
        if (side === "left") return `${base} border-t border-r`;
        // Right placement -> Arrow at left -> Points Left -> Border Bottom & Left
        if (side === "right") return `${base} border-b border-l`;
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
            <!-- Dynamic Arrow Classes -->
            <div bind:this={arrowEl} class={arrowClasses}></div>

            <div class="p-4">
                <div class="flex items-start justify-between gap-4">
                    <div class="space-y-1">
                        <h4 class="font-semibold leading-none">{ctx.currentStep()?.title}</h4>
                        <p class="text-sm text-muted-foreground">{ctx.currentStep()?.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" class="h-6 w-6 -mt-1 -mr-2 shrink-0" onclick={ctx.close}>
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
                            {ctx.isLastStep() ? "Finish" : "Next"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>