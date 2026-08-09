<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import { Check, Loader, MapPin, X } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import type { GeoLocation } from '.';
	import Highlight from './geocoder-highlight.svelte';
	import { formatAddress, type AddressConvention } from './format';

	let {
		value = $bindable(''),
		selected = $bindable<GeoLocation | null>(null),
		loading = false,
		placeholder = 'Search for a location...',
		labelKey,
		format = 'short',
		convention = 'auto',
		showCountry = true,
		language,
		class: className,
		onSelect,
		locationSnippet,
		emptySnippet,
		...rest
	}: {
		value: string;
		selected?: GeoLocation | null;
		loading?: boolean;
		placeholder?: string;
		labelKey?: keyof GeoLocation;
		/**
		 * `short` builds a compact address from the structured fields, `full` uses
		 * Nominatim's raw `display_name`, or pass a function for total control.
		 */
		format?: 'short' | 'full' | ((location: GeoLocation) => string);
		/** Address ordering. `auto` follows the country of each result. */
		convention?: AddressConvention | 'auto';
		showCountry?: boolean;
		/** Sent as `accept-language`, so results come back localised. */
		language?: string;
		class?: string;
		onSelect?: (loc: GeoLocation) => void;
		locationSnippet?: Snippet<[GeoLocation, boolean]>;
		emptySnippet?: Snippet;
		[key: string]: any;
	} = $props();

	/** The single source of truth for a result's label. */
	function label(loc: GeoLocation) {
		if (typeof format === 'function') return format(loc);
		if (format === 'full') return loc.display_name;
		return formatAddress(loc, { convention, showCountry });
	}

	let isOpen = $state(false);
	let activeIndex = $state(-1);

	let inputContainerRef = $state<HTMLDivElement | null>(null);
	let listRef = $state<HTMLDivElement | null>(null);

	let options: GeoLocation[] = $state([]);

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

	function handleSelect(loc: GeoLocation) {
		selected = loc;
		value = labelKey ? String(loc[labelKey]) : label(loc);

		if (onSelect) onSelect(loc);
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

	let debouncedQuery = $state('');

	$effect(() => {
		if (!value) {
			debouncedQuery = '';
			return;
		}

		const handler = setTimeout(() => {
			debouncedQuery = value;
		}, 500);

		return () => clearTimeout(handler);
	});

	$effect(() => {
		if (debouncedQuery) {
			loading = true;

			// addressdetails=1 is what returns the structured `address` object the
			// short format is built from; without it only display_name comes back.
			const params = new URLSearchParams({
				q: debouncedQuery,
				format: 'json',
				addressdetails: '1'
			});
			if (language) params.set('accept-language', language);

			fetch(`https://nominatim.openstreetmap.org/search?${params}`)
				.then((res) => res.json())
				.then((data) => {
					options = data;
				})
				.catch((error) => {
					console.error('Error fetching geocoding data', error);
					options = [];
				})
				.finally(() => {
					loading = false;
				});
		}
	});
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
			<Loader
				class="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground"
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
				<X class="size-4" />
			</button>
		{:else}
			<MapPin
				class="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
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
					<button
						type="button"
						role="option"
						tabindex="-1"
						aria-selected={i === activeIndex}
						class={cn(
							'relative w-full flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
							i === activeIndex
								? 'bg-accent text-accent-foreground'
								: 'hover:bg-accent hover:text-accent-foreground'
						)}
						onclick={() => handleSelect(option)}
						onmouseenter={() => (activeIndex = i)}
					>
						{#if locationSnippet}
							{@render locationSnippet(option, option.place_id === selected?.place_id)}
						{:else}
							<span class="flex w-full items-center gap-2 text-left">
								<MapPin class="size-3.5 shrink-0 text-muted-foreground" />
								<span class="truncate">
									<Highlight text={label(option)} query={value} />
								</span>
								{#if option.place_id === selected?.place_id}
									<Check class="ml-auto size-4 shrink-0 opacity-50" />
								{/if}
							</span>
						{/if}
					</button>
				{/each}
			{:else if loading}
				<div class="py-6 text-center text-sm text-muted-foreground">
					<Loader
						class="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground"
					/>
				</div>
			{:else}
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
