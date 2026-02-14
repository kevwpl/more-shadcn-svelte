<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Volume2, VolumeX, Volume1 } from '@lucide/svelte';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { getAudioPlayerContext } from './ctx';

	let { class: className }: { class?: string } = $props();
	const ctx = getAudioPlayerContext();

	function handleVolumeChange(e: Event & { currentTarget: HTMLInputElement }) {
		const val = parseFloat(e.currentTarget.value);
		ctx.setVolume(val);
	}
</script>

<HoverCard.Root openDelay={0} closeDelay={150}>
	<HoverCard.Trigger>
		<Button
			variant="ghost"
			size="icon"
			class={cn('h-8 w-8 text-muted-foreground hover:text-foreground', className)}
			onclick={ctx.toggleMute}
		>
			{#if ctx.isMuted.value || ctx.volume.value === 0}
				<VolumeX class="h-4 w-4" />
			{:else if ctx.volume.value < 0.5}
				<Volume1 class="h-4 w-4" />
			{:else}
				<Volume2 class="h-4 w-4" />
			{/if}
		</Button>
	</HoverCard.Trigger>
	<HoverCard.Content side="top" align="center" class="w-2 p-0 shadow-none" sideOffset={10}>
		<div class="flex h-24 flex-col items-center justify-center gap-3">
			<div class="relative h-full w-1.5 rounded-full bg-secondary">
				<div
					class="absolute bottom-0 left-0 w-full rounded-full bg-primary"
					style="height: {ctx.isMuted.value ? 0 : ctx.volume.value * 100}%"
				></div>

				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					orient="vertical"
					value={ctx.isMuted.value ? 0 : ctx.volume.value}
					oninput={handleVolumeChange}
					class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					style="appearance: slider-vertical; -webkit-appearance: slider-vertical; width: 32px; left: -13px;"
				/>
			</div>
		</div>
	</HoverCard.Content>
</HoverCard.Root>
