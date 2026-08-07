<script lang="ts" module>
	export type MentionItem = {
		id: string;
		label: string;
		description?: string;
		keywords?: string[];
		[key: string]: unknown;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let {
		value = $bindable(''),
		items = [],
		trigger = '@',
		placeholder = 'Type @ to mention someone...',
		disabled = false,
		multiline = true,
		rows = 4,
		maxItems = 8,
		insertSpace = true,
		class: className,
		filter,
		onmention,
		itemSnippet,
		emptySnippet,
		...rest
	}: {
		value?: string;
		items?: MentionItem[];
		trigger?: string;
		placeholder?: string;
		disabled?: boolean;
		/** Render a `<textarea>`; set to false for a single-line `<input>`. */
		multiline?: boolean;
		rows?: number;
		maxItems?: number;
		insertSpace?: boolean;
		class?: string;
		filter?: (items: MentionItem[], query: string) => MentionItem[];
		onmention?: (item: MentionItem) => void;
		itemSnippet?: Snippet<[MentionItem, boolean]>;
		emptySnippet?: Snippet<[string]>;
		[key: string]: unknown;
	} = $props();

	type Field = HTMLTextAreaElement | HTMLInputElement;

	let fieldRef = $state<Field | null>(null);
	let listRef = $state<HTMLDivElement | null>(null);

	const uid = $props.id();
	const listId = `mention-input-list-${uid}`;

	let isOpen = $state(false);
	let query = $state('');
	let activeIndex = $state(0);
	/** Index of the trigger character in `value`. */
	let anchorIndex = $state(-1);
	let caret = $state({ top: 0, left: 0, height: 20 });

	const defaultFilter = (list: MentionItem[], q: string) => {
		if (!q) return list;
		const needle = q.toLowerCase();
		return list.filter((item) => {
			if (item.label.toLowerCase().includes(needle)) return true;
			if (item.description?.toLowerCase().includes(needle)) return true;
			return item.keywords?.some((k) => k.toLowerCase().includes(needle)) ?? false;
		});
	};

	const results = $derived.by(() => {
		const filtered = (filter ?? defaultFilter)(items, query);
		return maxItems > 0 ? filtered.slice(0, maxItems) : filtered;
	});

	function close() {
		isOpen = false;
		anchorIndex = -1;
		query = '';
		activeIndex = 0;
	}

	/**
	 * Mirrors the field into a hidden div to find the pixel offset of the caret,
	 * so the popover can be anchored to the trigger character instead of the field.
	 */
	function measureCaret(el: Field, position: number) {
		const style = getComputedStyle(el);
		const mirror = document.createElement('div');

		const copy = [
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
			'border-top-width',
			'border-right-width',
			'border-bottom-width',
			'border-left-width',
			'font-family',
			'font-size',
			'font-weight',
			'font-style',
			'letter-spacing',
			'line-height',
			'text-transform',
			'text-indent',
			'tab-size'
		];

		for (const prop of copy) mirror.style.setProperty(prop, style.getPropertyValue(prop));

		// Mirror the exact content width so line breaks land in the same places.
		const contentWidth =
			el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

		mirror.style.boxSizing = 'content-box';
		mirror.style.borderStyle = 'solid';
		mirror.style.borderColor = 'transparent';
		// A single-line input never wraps, so it must not be width constrained.
		mirror.style.width = multiline ? `${contentWidth}px` : 'auto';
		mirror.style.position = 'absolute';
		mirror.style.top = '0';
		mirror.style.left = '-9999px';
		mirror.style.visibility = 'hidden';
		mirror.style.whiteSpace = multiline ? 'pre-wrap' : 'pre';
		mirror.style.overflowWrap = multiline ? 'break-word' : 'normal';
		mirror.style.height = 'auto';

		mirror.textContent = el.value.slice(0, position);

		const marker = document.createElement('span');
		// A non-empty marker keeps the span measurable at the end of the text.
		marker.textContent = el.value.slice(position) || '.';
		mirror.appendChild(marker);

		document.body.appendChild(mirror);
		const top = marker.offsetTop - el.scrollTop;
		const left = marker.offsetLeft - el.scrollLeft;
		const height = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
		document.body.removeChild(mirror);

		return { top, left, height };
	}

	/** Finds an open trigger sequence directly before the caret, if any. */
	function detect() {
		if (!fieldRef || disabled) return;

		const caretPos = fieldRef.selectionStart ?? 0;
		if (caretPos !== fieldRef.selectionEnd) return close();

		const before = value.slice(0, caretPos);
		const index = before.lastIndexOf(trigger);
		if (index === -1) return close();

		// The trigger only counts at a word boundary.
		const preceding = index === 0 ? '' : before[index - 1];
		if (preceding && !/[\s(\[{]/.test(preceding)) return close();

		const candidate = before.slice(index + trigger.length);
		if (/[\s]/.test(candidate)) return close();

		// Keep the highlighted item when the query is unchanged, otherwise moving
		// the cursor with the arrow keys would snap the selection back to the top.
		if (!isOpen || index !== anchorIndex || candidate !== query) activeIndex = 0;

		anchorIndex = index;
		query = candidate;
		caret = measureCaret(fieldRef, index);
		isOpen = true;
	}

	function select(item: MentionItem) {
		if (!fieldRef || anchorIndex === -1) return;

		const caretPos = fieldRef.selectionStart ?? value.length;
		const inserted = `${trigger}${item.label}${insertSpace ? ' ' : ''}`;

		value = value.slice(0, anchorIndex) + inserted + value.slice(caretPos);

		const nextCaret = anchorIndex + inserted.length;
		close();
		onmention?.(item);

		tick().then(() => {
			fieldRef?.focus();
			fieldRef?.setSelectionRange(nextCaret, nextCaret);
		});
	}

	function scrollActiveIntoView() {
		tick().then(() => {
			const el = listRef?.children[activeIndex] as HTMLElement | undefined;
			el?.scrollIntoView({ block: 'nearest' });
		});
	}

	const fieldClass = cn(
		'flex w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs',
		'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
		'disabled:cursor-not-allowed disabled:opacity-50'
	);

	function handleKeyup(e: KeyboardEvent) {
		// Vertical arrows drive the list while it is open — re-detecting there would
		// clobber the highlighted item. Horizontal moves still re-anchor the query.
		if (isOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) return;
		if (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End') detect();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen || results.length === 0) {
			if (isOpen && e.key === 'Escape') close();
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				activeIndex = (activeIndex + 1) % results.length;
				scrollActiveIntoView();
				break;
			case 'ArrowUp':
				e.preventDefault();
				activeIndex = (activeIndex - 1 + results.length) % results.length;
				scrollActiveIntoView();
				break;
			case 'Enter':
			case 'Tab':
				e.preventDefault();
				select(results[activeIndex]);
				break;
			case 'Escape':
				e.preventDefault();
				close();
				break;
		}
	}
</script>

<div class={cn('relative w-full', className)}>
	{#if multiline}
		<textarea
			bind:this={fieldRef}
			bind:value
			{rows}
			{placeholder}
			{disabled}
			oninput={detect}
			onclick={detect}
			onkeyup={handleKeyup}
			onkeydown={handleKeydown}
			onblur={() => setTimeout(close, 120)}
			role="combobox"
			aria-expanded={isOpen}
			aria-autocomplete="list"
			aria-controls={listId}
			class={cn(fieldClass, 'resize-y py-2')}
			{...rest}
		></textarea>
	{:else}
		<input
			bind:this={fieldRef}
			bind:value
			type="text"
			{placeholder}
			{disabled}
			oninput={detect}
			onclick={detect}
			onkeyup={handleKeyup}
			onkeydown={handleKeydown}
			onblur={() => setTimeout(close, 120)}
			role="combobox"
			aria-expanded={isOpen}
			aria-autocomplete="list"
			aria-controls={listId}
			class={cn(fieldClass, 'h-9 py-1')}
			{...rest}
		/>
	{/if}

	{#if isOpen}
		<div
			id={listId}
			bind:this={listRef}
			role="listbox"
			tabindex="-1"
			style:top="{caret.top + caret.height + 4}px"
			style:left="{caret.left}px"
			class="absolute z-50 max-h-[240px] min-w-[220px] max-w-[320px] overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
			transition:fly={{ y: -4, duration: 120 }}
		>
			{#each results as item, i (item.id)}
				<div
					role="option"
					tabindex="-1"
					aria-selected={i === activeIndex}
					class={cn(
						'flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
						i === activeIndex && 'bg-accent text-accent-foreground'
					)}
					onmouseenter={() => (activeIndex = i)}
					onmousedown={(e) => {
						e.preventDefault();
						select(item);
					}}
				>
					{#if itemSnippet}
						{@render itemSnippet(item, i === activeIndex)}
					{:else}
						<span class="truncate font-medium">{item.label}</span>
						{#if item.description}
							<span class="ml-auto truncate text-xs text-muted-foreground">
								{item.description}
							</span>
						{/if}
					{/if}
				</div>
			{:else}
				<div class="px-2 py-4 text-center text-sm text-muted-foreground">
					{#if emptySnippet}
						{@render emptySnippet(query)}
					{:else}
						No matches for "{query}"
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
