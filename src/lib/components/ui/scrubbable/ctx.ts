import { getContext, setContext } from 'svelte';

const SCRUBBABLE_KEY = Symbol('scrubbable');

type ScrubbableContext = {
	value: () => number;
	isDragging: () => boolean;
};

export function setScrubbableContext(props: ScrubbableContext) {
	setContext(SCRUBBABLE_KEY, props);
}

export function getScrubbableContext() {
	return getContext<ScrubbableContext>(SCRUBBABLE_KEY);
}
