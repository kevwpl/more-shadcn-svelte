import { getContext, setContext } from 'svelte';

const SORTABLE_KEY = Symbol('sortable');

export type SortableContext = {
	onDragStart: (e: DragEvent, id: string) => void;
	onDragOver: (e: DragEvent, id: string) => void;
	onDragEnd: (e: DragEvent) => void;
	registerItem: (id: string, node: HTMLElement) => void;
	unregisterItem: (id: string) => void;
	getDraggedId: () => string | null;
};

export function setSortableContext(props: SortableContext) {
	setContext(SORTABLE_KEY, props);
}

export function getSortableContext() {
	return getContext<SortableContext>(SORTABLE_KEY);
}
