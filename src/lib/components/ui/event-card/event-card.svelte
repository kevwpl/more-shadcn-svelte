<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Check, Loader2 } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let {
		eventColor = '#3b82f6',
		status = 'idle',
		variant = 'display',
		label,
		completedLabel = 'Completed',
		actionLabel = 'Confirm',
		isDotted = false,
		opacity = 1,
		onAction,
		class: className,
		children
	}: {
		eventColor?: string;
		status?: 'idle' | 'loading' | 'completed';
		variant?: 'display' | 'action';
		label?: string;
		completedLabel?: string;
		actionLabel?: string;
		isDotted?: boolean;
		opacity?: number;
		onAction?: () => void;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div
	class={cn(
		'relative flex w-full overflow-hidden rounded-xl border transition-all duration-200',
		isDotted && 'border-dashed',
		className
	)}
	style="opacity: {opacity}; background-color: {eventColor}15; border-color: {eventColor}30;"
>
	<div
		class="absolute left-1 top-2 bottom-2 w-1 rounded-full"
		style="background-color: {eventColor}"
	></div>

	<div class="flex w-full items-center justify-between p-4 pl-6">
		<div class="flex flex-1 flex-col gap-0.5 overflow-hidden">
			{#if label}
				<span
					class="mb-0.5 text-[10px] font-bold uppercase tracking-wider"
					style="color: {eventColor}"
				>
					{label}
				</span>
			{/if}
			{@render children()}
		</div>

		{#if variant === 'action'}
			<div class="ml-4 flex shrink-0 items-center">
				<Button
					size="sm"
					variant="default"
					disabled={status === 'loading' || status === 'completed'}
					onclick={onAction}
					class="min-w-[90px] gap-2"
				>
					{#if status === 'loading'}
						<Loader2 class="h-3.5 w-3.5 animate-spin" />
					{:else if status === 'completed'}
						<Check class="h-3.5 w-3.5" />
						{completedLabel}
					{:else}
						{actionLabel}
					{/if}
				</Button>
			</div>
		{/if}
	</div>
</div>
