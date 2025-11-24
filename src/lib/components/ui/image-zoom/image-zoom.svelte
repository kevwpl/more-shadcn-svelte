<script lang="ts">
    import { writable } from "svelte/store";
    import { setImageZoomContext, type ZoomImageData } from "./ctx";
    import { fade } from "svelte/transition";
    import {onMount, onDestroy, type Snippet} from "svelte";
    import { Button } from "$lib/components/ui/button";
    import { X, ChevronLeft, ChevronRight } from "lucide-svelte"; // Added navigation icons
    import { cn } from "$lib/utils";

    let {
        class: className,
        children
    } : {
        class?: string;
        children?: Snippet;
    }= $props();

    // Internal states
    const registeredImagesStore = writable<ZoomImageData[]>([]); // All images registered by triggers
    const currentImageIndexStore = writable<number | null>(null); // Index of the currently zoomed image
    const openStore = writable(false);

    // Reactive derived states from stores
    let registeredImages = $state<ZoomImageData[]>([]);
    let currentImageIndex = $state<number | null>(null);
    let isOpen = $state(false);

    // Sync internal states with stores
    $effect(() => {
        registeredImages = $registeredImagesStore;
        currentImageIndex = $currentImageIndexStore;
        isOpen = $openStore;
    });

    // Derived properties for current image and navigation
    const currentImageData = $derived(
        currentImageIndex !== null ? registeredImages[currentImageIndex] : null
    );
    const hasMultipleImages = $derived(registeredImages.length > 1);
    const hasPrevious = $derived(currentImageIndex !== null && currentImageIndex > 0);
    const hasNext = $derived(currentImageIndex !== null && currentImageIndex < registeredImages.length - 1);

    // --- Context Functions ---
    function registerImage(imageData: Omit<ZoomImageData, 'index'>) {
        const index = $registeredImagesStore.length;
        $registeredImagesStore = [...$registeredImagesStore, { ...imageData, index }];
        return index;
    }

    function openImage(index: number) {
        $currentImageIndexStore = index;
        $openStore = true;
    }

    function nextImage() {
        if (currentImageIndex !== null && hasNext) {
            $currentImageIndexStore = currentImageIndex + 1;
        }
    }

    function prevImage() {
        if (currentImageIndex !== null && hasPrevious) {
            $currentImageIndexStore = currentImageIndex - 1;
        }
    }

    function closeZoom() {
        $openStore = false;
        $currentImageIndexStore = null;
        // Optionally clear registered images if Root is remounted often
        // but typically you keep them if Root stays mounted
    }

    // Provide context to children
    setImageZoomContext({
        registeredImages: registeredImagesStore,
        currentImageIndex: currentImageIndexStore,
        open: openStore,
        registerImage,
        openImage,
        nextImage,
        prevImage
    });

    // Handle Escape key
    function handleKeydown(event: KeyboardEvent) {
        if (!isOpen) return;
        if (event.key === 'Escape') closeZoom();
        if (event.key === 'ArrowLeft') prevImage();
        if (event.key === 'ArrowRight') nextImage();
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && currentImageData}
    <div
            class={cn(
            "fixed inset-0 z-[10000] flex items-center justify-center bg-black/90",
            className
        )}
            transition:fade={{ duration: 150 }}
            aria-modal="true"
            role="dialog"
            tabindex="-1"
    >
        <!-- Background click to close -->
        <div
                class="absolute inset-0"
                onclick={closeZoom}
                aria-label="Close"
                role="button"
        ></div>

        <!-- Image Container -->
        <div class="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center pointer-events-none">
            <img
                    src={currentImageData.src}
                    alt={currentImageData.alt}
                    class="block max-w-full max-h-full object-contain pointer-events-auto"
                    transition:fade={{ duration: 300, delay: 50 }}
            />
        </div>

        <!-- Gallery Navigation Buttons -->
        {#if hasMultipleImages}
            <!-- Previous Button -->
            <Button
                    variant="ghost"
                    size="icon"
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 hover:bg-primary cursor-pointer pointer-events-auto disabled:opacity-30 disabled:pointer-events-none"
                    onclick={prevImage}
                    disabled={!hasPrevious}
                    aria-label="Previous image"
            >
                <ChevronLeft class="h-8 w-8" />
            </Button>

            <!-- Next Button -->
            <Button
                    variant="ghost"
                    size="icon"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 hover:bg-primary cursor-pointer pointer-events-auto disabled:opacity-30 disabled:pointer-events-none"
                    onclick={nextImage}
                    disabled={!hasNext}
                    aria-label="Next image"
            >
                <ChevronRight class="h-8 w-8" />
            </Button>
        {/if}

        <!-- Close Button -->
        <Button
                variant="ghost"
                size="icon"
                class="absolute top-4 right-4 pointer-events-auto text-white hover:text-gray-300 cursor-pointer hover:bg-primary"
                onclick={closeZoom}
                aria-label="Close zoomed image"
        >
            <X class="h-6 w-6" />
        </Button>
    </div>
{/if}

{@render children()}