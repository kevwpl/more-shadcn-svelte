<script lang="ts">
    import { cn } from "$lib/utils";
    import type { Snippet } from "svelte";

    let { class: className, children }: {
        class?: string,
        children: Snippet
    } = $props();

</script>

<div class={cn("p-5 pt-8 max-w-3xl lg:w-3xl sm:w-xl animate-in fade-in slide-in-from-right-4", className)}>
    {@render children()}
</div>