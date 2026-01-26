<script lang="ts" generics="T">
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import { Loader2, Search, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let {
		value = $bindable(''),
		selected = $bindable<T | null>(null),
		options = [],
		loading = false,
		placeholder = 'Search...',
		labelKey,
		class: className,
		onSelect,
		itemSnippet,
		emptySnippet,
		...rest
	}: {
		value: string;
		selected?: T | null;
		options: T[];
		loading?: boolean;
		placeholder?: string;
		labelKey?: keyof T;
		class?: string;
		onSelect?: (item: T) => void;
		itemSnippet: Snippet<[T, boolean]>;
		emptySnippet?: Snippet;
		[key: string]: any;
	} = $props();

	let isOpen = $state(false);
	let activeIndex = $state(-1);

	let inputContainerRef = $state<HTMLDivElement | null>(null);
	let listRef = $state<HTMLDivElement | null>(null);

	function open() {
		isOpen = true;
		activeIndex = -1;
	}

	function close() {
		isOpen = false;
		activeIndex = -1;
	}

	function handleInput(e: Event) {
		value = (e.target as HTMLInputElement).value;
		if (value.length > 0) open();
		else close();
	}

	function handleSelect(item: T) {
		selected = item;

		if (labelKey && item && typeof item === 'object') {
			value = String(item[labelKey]);
		} else if (typeof item === 'string') {
			value = item;
		}

		if (onSelect) onSelect(item);
		close();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) {
			if (e.key === 'ArrowDown' && value.length > 0) open();
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				activeIndex = (activeIndex + 1) % options.length;
				scrollToActive();
				break;
			case 'ArrowUp':
				e.preventDefault();
				activeIndex = (activeIndex - 1 + options.length) % options.length;
				scrollToActive();
				break;
			case 'Enter':
				e.preventDefault();
				if (activeIndex >= 0 && options[activeIndex]) {
					handleSelect(options[activeIndex]);
				}
				break;
			case 'Escape':
				close();
				break;
		}
	}

	function scrollToActive() {
		if (!listRef) return;
		const activeEl = listRef.children[activeIndex] as HTMLElement;
		if (activeEl) {
			activeEl.scrollIntoView({ block: 'nearest' });
		}
	}

	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				node &&
				!node.contains(target) &&
				inputContainerRef &&
				!inputContainerRef.contains(target)
			) {
				close();
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<div class={cn('relative w-full group', className)}>
	<div class="relative" bind:this={inputContainerRef}>
		<Input
			type="text"
			{placeholder}
			bind:value
			oninput={handleInput}
			onkeydown={handleKeydown}
			onfocus={() => {
				if (value) open();
			}}
			role="combobox"
			aria-expanded={isOpen}
			aria-autocomplete="list"
			{...rest}
		/>

		{#if loading}
			<Loader2
				class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground"
			/>
		{:else if value.length > 0}
			<button
				class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				onclick={() => {
					value = '';
					selected = null;
					inputContainerRef?.querySelector('input')?.focus();
					close();
				}}
				aria-label="Clear"
			>
				<X class="h-4 w-4" />
			</button>
		{:else}
			<Search
				class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
			/>
		{/if}
	</div>

	{#if isOpen}
		<div
			use:clickOutside
			bind:this={listRef}
			class="absolute z-50 mt-2 w-full max-h-[300px] overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none"
			transition:fly={{ y: -5, duration: 150 }}
		>
			{#if options.length > 0}
				{#each options as option, i}
					<div
						role="option"
						tabindex="-1"
						aria-selected={i === activeIndex}
						class={cn(
							'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
							i === activeIndex
								? 'bg-accent text-accent-foreground'
								: 'hover:bg-accent hover:text-accent-foreground'
						)}
						onclick={() => handleSelect(option)}
						onmouseenter={() => (activeIndex = i)}
					>
						{@render itemSnippet(option, i === activeIndex)}
					</div>
				{/each}
			{:else if !loading}
				<div class="py-6 text-center text-sm text-muted-foreground">
					{#if emptySnippet}
						{@render emptySnippet()}
					{:else}
						No results found.
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
