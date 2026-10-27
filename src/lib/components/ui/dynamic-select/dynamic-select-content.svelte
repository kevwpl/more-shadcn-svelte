<script lang="ts">
	import * as Popover from '#lib/components/ui/popover/index.js';
	import * as Command from '#lib/components/ui/command/index.js';
	import { getDynamicSelectContext } from './ctx';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
	const ctx = getDynamicSelectContext();

	let internalInput = $state('');

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && internalInput.trim() !== '') {
			ctx.setValue(internalInput);
			internalInput = '';
		}
	}
</script>

<Popover.Content
	class="w-[var(--bits-popover-anchor-width)] min-w-[var(--bits-popover-anchor-width)] p-0"
	align="start"
>
	<Command.Root>
		<Command.Input
			placeholder="Search or type custom..."
			bind:value={internalInput}
			onkeydown={handleKeyDown}
		/>
		<Command.List>
			<Command.Empty>
				{#if internalInput.trim() !== ''}
					<button
						class="flex w-full cursor-pointer items-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
						onclick={() => ctx.setValue(internalInput)}
					>
						Add "{internalInput}"
					</button>
				{:else}
					No results found.
				{/if}
			</Command.Empty>
			{@render children()}
		</Command.List>
	</Command.Root>
</Popover.Content>
