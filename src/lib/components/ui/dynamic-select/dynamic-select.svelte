<script lang="ts">
	import * as Popover from '#lib/components/ui/popover/index.js';
	import { setDynamicSelectContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		value = $bindable(''),
		open = $bindable(false),
		children
	}: {
		value?: string;
		open?: boolean;
		children: Snippet;
	} = $props();

	let inputValue = $state('');

	setDynamicSelectContext({
		get value() {
			return { value };
		},
		get open() {
			return { value: open };
		},
		get inputValue() {
			return { value: inputValue };
		},
		setValue: (v: string) => {
			value = v;
			open = false;
		}
	});
</script>

<Popover.Root bind:open>
	{@render children()}
</Popover.Root>
