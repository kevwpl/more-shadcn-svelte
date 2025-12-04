import { getContext, setContext } from 'svelte';

const SCROLL_KEY = Symbol('horizontal-scroll');

type ScrollContext = {
	scrollLeft: () => void;
	scrollRight: () => void;
	getElement: () => HTMLDivElement | undefined;
};

export function setScrollContext(props: ScrollContext) {
	setContext(SCROLL_KEY, props);
}

export function getScrollContext() {
	return getContext<ScrollContext>(SCROLL_KEY);
}
