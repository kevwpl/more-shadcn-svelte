<script lang="ts">
	import { cn } from '$lib/utils';
	import { GripVertical } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let { class: className, children }: { class?: string; children?: Snippet } = $props();

	function setDraggable(e: MouseEvent, state: boolean) {
		const target = e.currentTarget as HTMLElement;
		const item =
			target.closest('div[draggable="false"]') || target.closest('div[draggable="true"]');
		if (item instanceof HTMLElement) {
			item.draggable = state;
		}
	}
</script>

<div
	class={cn('cursor-grab active:cursor-grabbing p-1 touch-none', className)}
	onmousedown={(e) => setDraggable(e, true)}
	onmouseup={(e) => setDraggable(e, false)}
	onmouseleave={(e) => setDraggable(e, false)}
>
	{#if children}
		{@render children()}
	{:else}
		<GripVertical class="size-4 opacity-50" />
	{/if}
</div>
