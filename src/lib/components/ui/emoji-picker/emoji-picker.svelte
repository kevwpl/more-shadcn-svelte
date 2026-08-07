<script lang="ts">
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import {
		Clock,
		Smile,
		Hand,
		Leaf,
		Coffee,
		Dumbbell,
		Plane,
		Lightbulb,
		Hash,
		Flag,
		Search,
		X
	} from '@lucide/svelte';
	import {
		emojiCategories,
		applySkinTone,
		SKIN_TONES,
		type Emoji,
		type EmojiCategoryId
	} from './emoji-data';

	let {
		value = $bindable(''),
		skinTone = $bindable(0),
		recents = $bindable<string[]>([]),
		columns = 9,
		maxRecents = 18,
		showSearch = true,
		showCategories = true,
		showSkinTones = true,
		showRecents = true,
		showPreview = true,
		persistKey = 'more-shadcn:emoji',
		searchPlaceholder = 'Search emoji...',
		class: className,
		onSelect,
		...rest
	}: {
		value?: string;
		skinTone?: number;
		recents?: string[];
		columns?: number;
		maxRecents?: number;
		showSearch?: boolean;
		showCategories?: boolean;
		showSkinTones?: boolean;
		showRecents?: boolean;
		showPreview?: boolean;
		/** Set to `null` to disable persisting recents and the skin tone. */
		persistKey?: string | null;
		searchPlaceholder?: string;
		class?: string;
		onSelect?: (emoji: string, data: Emoji) => void;
		[key: string]: unknown;
	} = $props();

	const CATEGORY_ICONS: Record<EmojiCategoryId, typeof Smile> = {
		recent: Clock,
		smileys: Smile,
		people: Hand,
		nature: Leaf,
		food: Coffee,
		activity: Dumbbell,
		travel: Plane,
		objects: Lightbulb,
		symbols: Hash,
		flags: Flag
	};

	/** Base character -> emoji, so stored recents can be resolved back to data. */
	const byChar = new Map<string, Emoji>(
		emojiCategories.flatMap((c) => c.emojis.map((e) => [e.e, e] as const))
	);

	let query = $state('');
	let hovered = $state<Emoji | null>(null);
	let activeIndex = $state(-1);
	let activeCategory = $state<EmojiCategoryId>('smileys');
	let tonesOpen = $state(false);
	let hydrated = $state(false);

	let scrollRef = $state<HTMLDivElement | null>(null);
	let sectionRefs: Partial<Record<EmojiCategoryId, HTMLDivElement>> = {};

	const recentEmojis = $derived(
		recents.map((char) => byChar.get(char)).filter((e): e is Emoji => Boolean(e))
	);

	const sections = $derived.by(() => {
		const needle = query.trim().toLowerCase();

		if (needle) {
			const matches = emojiCategories.flatMap((category) =>
				category.emojis.filter(
					(emoji) => emoji.n.includes(needle) || emoji.k?.includes(needle) || emoji.e === needle
				)
			);
			return [{ id: 'smileys' as EmojiCategoryId, label: 'Results', emojis: matches }];
		}

		const list = emojiCategories.map((c) => ({ id: c.id, label: c.label, emojis: c.emojis }));
		if (showRecents && recentEmojis.length > 0) {
			list.unshift({
				id: 'recent' as EmojiCategoryId,
				label: 'Frequently used',
				emojis: recentEmojis
			});
		}
		return list;
	});

	/** Flat, render-order list used for keyboard navigation. */
	const flat = $derived(sections.flatMap((s) => s.emojis));

	/**
	 * Start index of each section in `flat`. Recents reuse the same emoji objects
	 * as their category, so positions have to be derived from offsets rather than
	 * looked up by identity.
	 */
	const offsets = $derived.by(() => {
		let running = 0;
		return sections.map((section) => {
			const offset = running;
			running += section.emojis.length;
			return offset;
		});
	});

	const tabs = $derived([
		...(showRecents && recentEmojis.length > 0 ? (['recent'] as EmojiCategoryId[]) : []),
		...emojiCategories.map((c) => c.id)
	]);

	function storageGet(key: string) {
		if (!persistKey || typeof window === 'undefined') return null;
		try {
			return window.localStorage.getItem(`${persistKey}:${key}`);
		} catch {
			return null;
		}
	}

	function storageSet(key: string, val: string) {
		if (!persistKey || typeof window === 'undefined') return;
		try {
			window.localStorage.setItem(`${persistKey}:${key}`, val);
		} catch {
			// Storage may be unavailable — recents just stop persisting.
		}
	}

	$effect(() => {
		if (hydrated) return;
		hydrated = true;

		const storedRecents = storageGet('recents');
		if (storedRecents) {
			try {
				const parsed = JSON.parse(storedRecents);
				if (Array.isArray(parsed)) recents = parsed.filter((c) => byChar.has(c));
			} catch {
				// Ignore malformed storage.
			}
		}

		const storedTone = storageGet('skin-tone');
		if (storedTone !== null) skinTone = Number(storedTone) || 0;
	});

	function pushRecent(emoji: Emoji) {
		const next = [emoji.e, ...recents.filter((c) => c !== emoji.e)].slice(0, maxRecents);
		recents = next;
		storageSet('recents', JSON.stringify(next));
	}

	function pick(emoji: Emoji) {
		const char = applySkinTone(emoji, skinTone);
		value = char;
		if (showRecents) pushRecent(emoji);
		onSelect?.(char, emoji);
	}

	function setTone(tone: number) {
		skinTone = tone;
		tonesOpen = false;
		storageSet('skin-tone', String(tone));
	}

	function scrollToCategory(id: EmojiCategoryId) {
		activeCategory = id;
		sectionRefs[id]?.scrollIntoView({ block: 'start', behavior: 'smooth' });
	}

	function handleScroll() {
		if (!scrollRef || query) return;

		const top = scrollRef.scrollTop;
		for (const section of sections) {
			const el = sectionRefs[section.id];
			if (el && el.offsetTop - 8 <= top) activeCategory = section.id;
		}
	}

	async function focusCell(index: number) {
		activeIndex = Math.max(0, Math.min(index, flat.length - 1));
		hovered = flat[activeIndex] ?? null;
		await tick();
		scrollRef?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({
			block: 'nearest'
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (flat.length === 0) return;

		switch (e.key) {
			case 'ArrowRight':
				e.preventDefault();
				focusCell(activeIndex + 1);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				focusCell(activeIndex - 1);
				break;
			case 'ArrowDown':
				e.preventDefault();
				focusCell(activeIndex < 0 ? 0 : activeIndex + columns);
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (activeIndex >= columns) focusCell(activeIndex - columns);
				break;
			case 'Enter':
				e.preventDefault();
				pick(flat[Math.max(activeIndex, 0)]);
				break;
			case 'Escape':
				if (query) {
					e.preventDefault();
					query = '';
					activeIndex = -1;
				}
				break;
		}
	}

	// Reset the cursor whenever the visible set changes.
	$effect(() => {
		query;
		activeIndex = -1;
	});
</script>

<div
	class={cn(
		'flex w-[352px] max-w-full flex-col overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md',
		className
	)}
	style:--emoji-columns={columns}
	{...rest}
>
	{#if showSearch || showSkinTones}
		<div class="flex items-center gap-2 border-b p-2">
			{#if showSearch}
				<div class="relative flex-1">
					<Search
						class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<input
						bind:value={query}
						onkeydown={handleKeydown}
						placeholder={searchPlaceholder}
						aria-label="Search emoji"
						class="h-9 w-full rounded-md border border-input bg-background pl-8 pr-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
					/>
					{#if query}
						<button
							type="button"
							onclick={() => (query = '')}
							aria-label="Clear search"
							class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<X class="size-4" />
						</button>
					{/if}
				</div>
			{/if}

			{#if showSkinTones}
				<div class="relative">
					<button
						type="button"
						onclick={() => (tonesOpen = !tonesOpen)}
						aria-label="Change skin tone"
						aria-expanded={tonesOpen}
						class="flex size-9 items-center justify-center rounded-md border text-lg transition-colors hover:bg-accent"
					>
						{SKIN_TONES[skinTone]?.swatch ?? SKIN_TONES[0].swatch}
					</button>

					{#if tonesOpen}
						<div
							class="absolute right-0 top-full z-10 mt-1 flex gap-0.5 rounded-md border bg-popover p-1 shadow-md"
						>
							{#each SKIN_TONES as tone}
								<button
									type="button"
									onclick={() => setTone(tone.id)}
									title={tone.label}
									aria-label={tone.label}
									class={cn(
										'flex size-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-accent',
										skinTone === tone.id && 'bg-accent'
									)}
								>
									{tone.swatch}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	{#if showCategories && !query}
		<div class="flex items-center gap-0.5 border-b px-1.5 py-1">
			{#each tabs as id}
				{@const Icon = CATEGORY_ICONS[id]}
				<button
					type="button"
					onclick={() => scrollToCategory(id)}
					aria-label={id}
					aria-current={activeCategory === id}
					class={cn(
						'flex flex-1 items-center justify-center rounded-md py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
						activeCategory === id && 'bg-accent text-foreground'
					)}
				>
					<Icon class="size-4" />
				</button>
			{/each}
		</div>
	{/if}

	<div
		bind:this={scrollRef}
		onscroll={handleScroll}
		onkeydown={handleKeydown}
		role="grid"
		tabindex="0"
		aria-label="Emoji"
		class="relative h-[280px] overflow-y-auto overscroll-contain px-1.5 pb-1.5 outline-none"
	>
		{#each sections as section, s (section.id + s)}
			<div bind:this={sectionRefs[section.id]}>
				<!-- Full bleed and fully opaque: the scroll container has no top padding,
				     so nothing can peek out above or behind the pinned label. -->
				<div
					class="sticky top-0 z-10 -mx-1.5 bg-popover px-2.5 pb-1 pt-2 text-xs font-medium text-muted-foreground"
				>
					{section.label}
				</div>
				<div
					class="grid gap-0.5"
					style="grid-template-columns: repeat(var(--emoji-columns), minmax(0, 1fr))"
				>
					{#each section.emojis as emoji, i (section.id + emoji.e)}
						{@const index = offsets[s] + i}
						<button
							type="button"
							data-index={index}
							onclick={() => pick(emoji)}
							onmouseenter={() => {
								hovered = emoji;
								activeIndex = index;
							}}
							onmouseleave={() => (hovered = null)}
							title={emoji.n}
							class={cn(
								'flex aspect-square items-center justify-center rounded-md text-xl leading-none transition-colors hover:bg-accent',
								activeIndex === index && 'bg-accent'
							)}
						>
							{applySkinTone(emoji, skinTone)}
						</button>
					{/each}
				</div>
			</div>
		{/each}

		{#if flat.length === 0}
			<div class="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
				<span class="text-2xl">🔍</span>
				<span class="text-sm">No emoji found</span>
			</div>
		{/if}
	</div>

	{#if showPreview}
		<div class="flex h-11 items-center gap-2 border-t px-3">
			{#if hovered}
				<span class="text-xl leading-none">{applySkinTone(hovered, skinTone)}</span>
				<span class="truncate text-xs text-muted-foreground">{hovered.n}</span>
			{:else}
				<span class="text-xs text-muted-foreground">Pick an emoji…</span>
			{/if}
		</div>
	{/if}
</div>
