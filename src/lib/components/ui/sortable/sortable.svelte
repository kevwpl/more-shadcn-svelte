<script lang="ts">
	import { cn } from '$lib/utils';
	import { setSortableContext } from './ctx';
	import { tick, type Snippet } from 'svelte';

	let {
		items = $bindable([]),
		class: className,
		children,
		onSort,
		animation = 200
	}: {
		items: any[];
		class?: string;
		children: Snippet;
		onSort?: (items: any[]) => void;
		animation?: number;
	} = $props();

	let draggedId = $state<string | null>(null);
	let itemNodes = new Map<string, HTMLElement>();

	async function move(fromIdx: number, toIdx: number) {
		const rects = new Map<string, DOMRect>();
		itemNodes.forEach((node, id) => rects.set(id, node.getBoundingClientRect()));

		const newItems = [...items];
		const [item] = newItems.splice(fromIdx, 1);
		newItems.splice(toIdx, 0, item);
		items = newItems;
		onSort?.(newItems);

		await tick();

		itemNodes.forEach((node, id) => {
			const prev = rects.get(id);
			if (!prev) return;
			const curr = node.getBoundingClientRect();
			const dx = prev.left - curr.left;
			const dy = prev.top - curr.top;
			if (dx || dy) {
				node.style.transition = 'none';
				node.style.transform = `translate(${dx}px, ${dy}px)`;
				node.offsetHeight;
				node.style.transition = `transform ${animation}ms cubic-bezier(0.2, 0, 0, 1)`;
				node.style.transform = '';
			}
		});
	}

	setSortableContext({
		getDraggedId: () => draggedId,
		registerItem: (id, node) => itemNodes.set(id, node),
		unregisterItem: (id) => itemNodes.delete(id),
		onDragStart: (e, id) => {
			draggedId = id;
			if (e.dataTransfer) {
				e.dataTransfer.effectAllowed = 'move';
				const ghost = document.createElement('div');
				e.dataTransfer.setDragImage(ghost, 0, 0);
			}
		},
		onDragOver: (e, targetId) => {
			e.preventDefault();
			if (!draggedId || draggedId === targetId) return;

			const fromIdx = items.findIndex((i) => i.id === draggedId);
			const toIdx = items.findIndex((i) => i.id === targetId);

			if (fromIdx !== -1 && toIdx !== -1) {
				move(fromIdx, toIdx);
			}
		},
		onDragEnd: () => {
			draggedId = null;
		}
	});
</script>

<div class={cn(className)}>
	{@render children()}
</div>
