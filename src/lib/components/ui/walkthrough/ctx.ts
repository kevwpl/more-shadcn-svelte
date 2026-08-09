import { getContext, setContext } from 'svelte';

const WALKTHROUGH_KEY = Symbol('walkthrough');

export type Step = {
	/**
	 * Id of the element to anchor to. Leave it out — or point it at an element
	 * that is not on the page — and the step is centred with nothing highlighted,
	 * which is what you want for an intro or a closing step.
	 */
	target?: string;
	title: string;
	description: string;
	position?: 'top' | 'bottom' | 'left' | 'right';
};

type WalkthroughContext = {
	isOpen: () => boolean;
	currentStepIndex: () => number;
	currentStep: () => Step | undefined;
	isLastStep: () => boolean;
	next: () => void;
	prev: () => void;
	close: () => void;
};

export function setWalkthroughContext(ctx: WalkthroughContext) {
	setContext(WALKTHROUGH_KEY, ctx);
}

export function getWalkthroughContext() {
	return getContext<WalkthroughContext>(WALKTHROUGH_KEY);
}
