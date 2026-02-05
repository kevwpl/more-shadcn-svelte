<script lang="ts">
	import { cn } from '$lib/utils';
	import { getSortableContext } from './ctx';
	import { onMount, onDestroy, type Snippet } from 'svelte';

	let {
		id,
		class: className,
		children
	}: { id: string; class?: string; children: Snippet } = $props();

	const ctx = getSortableContext();
	let node = $state<HTMLElement>();

	onMount(() => {
		if (node) ctx.registerItem(id, node);
	});
	onDestroy(() => ctx.unregisterItem(id));

	let isDragging = $derived(ctx?.getDraggedId() === id);
</script>

<div
	bind:this={node}
	class={cn('relative transition-all', isDragging && 'opacity-30', className)}
	draggable="false"
	ondragstart={(e) => ctx.onDragStart(e, id)}
	ondragover={(e) => ctx.onDragOver(e, id)}
	ondragend={(e) => ctx.onDragEnd(e)}
>
	{@render children()}
</div>
