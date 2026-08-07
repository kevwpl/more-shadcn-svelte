<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const stickyNoteVariants = tv({
		base: 'group relative flex flex-col gap-1 rounded-sm p-3 text-sm shadow-md transition-shadow',
		variants: {
			color: {
				yellow: 'bg-amber-200 text-amber-950',
				pink: 'bg-pink-200 text-pink-950',
				blue: 'bg-sky-200 text-sky-950',
				green: 'bg-emerald-200 text-emerald-950',
				purple: 'bg-violet-200 text-violet-950',
				gray: 'bg-neutral-200 text-neutral-900'
			},
			size: {
				sm: 'min-h-24 w-40',
				md: 'min-h-32 w-52',
				lg: 'min-h-44 w-64'
			}
		},
		defaultVariants: { color: 'yellow', size: 'md' }
	});

	export type StickyNoteColor = NonNullable<VariantProps<typeof stickyNoteVariants>['color']>;
	export type StickyNoteSize = VariantProps<typeof stickyNoteVariants>['size'];

	export const STICKY_NOTE_COLORS: StickyNoteColor[] = [
		'yellow',
		'pink',
		'blue',
		'green',
		'purple',
		'gray'
	];

	/** Swatch fills for the palette. Kept separate so the classes stay statically visible to Tailwind. */
	export const STICKY_NOTE_SWATCH: Record<StickyNoteColor, string> = {
		yellow: 'bg-amber-200',
		pink: 'bg-pink-200',
		blue: 'bg-sky-200',
		green: 'bg-emerald-200',
		purple: 'bg-violet-200',
		gray: 'bg-neutral-200'
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { tick, type Snippet } from 'svelte';
	import { X } from '@lucide/svelte';

	let {
		text = $bindable(''),
		color = $bindable<StickyNoteColor>('yellow'),
		size = 'md',
		placeholder = 'Write something…',
		editable = true,
		showPalette = true,
		removable = false,
		rotate = 0,
		author,
		class: className,
		onremove,
		onedit,
		children,
		...rest
	}: {
		text?: string;
		color?: StickyNoteColor;
		size?: StickyNoteSize;
		placeholder?: string;
		editable?: boolean;
		/** Show the colour swatches on hover. */
		showPalette?: boolean;
		removable?: boolean;
		/** Degrees of tilt, for a pinned-to-the-wall look. */
		rotate?: number;
		author?: string;
		class?: string;
		onremove?: () => void;
		onedit?: (text: string) => void;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	let editing = $state(false);
	let field = $state<HTMLTextAreaElement | null>(null);

	async function startEditing() {
		if (!editable) return;
		editing = true;
		await tick();
		field?.focus();
		field?.setSelectionRange(text.length, text.length);
	}

	function stopEditing() {
		editing = false;
		onedit?.(text);
	}
</script>

<div
	class={cn(stickyNoteVariants({ color, size }), className)}
	style:transform={rotate ? `rotate(${rotate}deg)` : undefined}
	{...rest}
>
	{#if removable}
		<button
			type="button"
			aria-label="Remove note"
			onclick={onremove}
			class="absolute right-1 top-1 rounded-sm p-0.5 opacity-0 transition-opacity hover:bg-black/10 focus-visible:opacity-100 group-hover:opacity-100"
		>
			<X class="size-3.5" />
		</button>
	{/if}

	<div class="flex-1">
		{#if children}
			{@render children()}
		{:else if editing}
			<textarea
				bind:this={field}
				bind:value={text}
				onblur={stopEditing}
				onkeydown={(e) => {
					if (e.key === 'Escape') {
						e.preventDefault();
						stopEditing();
					}
				}}
				{placeholder}
				class="size-full min-h-20 resize-none bg-transparent leading-snug outline-none placeholder:opacity-50"
			></textarea>
		{:else}
			<!-- The whole face is the edit affordance, which is how a real sticky behaves. -->
			<div
				role={editable ? 'button' : undefined}
				tabindex={editable ? 0 : undefined}
				ondblclick={startEditing}
				onkeydown={(e) => {
					if (editable && (e.key === 'Enter' || e.key === ' ')) {
						e.preventDefault();
						startEditing();
					}
				}}
				class={cn(
					'whitespace-pre-wrap break-words leading-snug outline-none',
					!text && 'opacity-50',
					editable && 'cursor-text'
				)}
			>
				{text || placeholder}
			</div>
		{/if}
	</div>

	{#if author}
		<span class="text-[10px] font-medium opacity-60">{author}</span>
	{/if}

	{#if showPalette}
		<div
			class="pointer-events-none absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border bg-popover p-1 opacity-0 shadow-sm transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
		>
			{#each STICKY_NOTE_COLORS as swatch}
				<button
					type="button"
					aria-label={`Colour ${swatch}`}
					aria-pressed={color === swatch}
					onclick={() => (color = swatch)}
					class={cn(
						'size-3.5 rounded-full border transition-transform',
						STICKY_NOTE_SWATCH[swatch],
						color === swatch ? 'scale-125 border-foreground' : 'border-transparent'
					)}
				></button>
			{/each}
		</div>
	{/if}
</div>
