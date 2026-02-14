<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Play, Pause } from '@lucide/svelte';
	import { getAudioPlayerContext } from './ctx';

	let { class: className }: { class?: string } = $props();
	const ctx = getAudioPlayerContext();
</script>

<Button
	variant="secondary"
	size="icon"
	class={cn('h-12 w-12 rounded-full shadow-sm', className)}
	onclick={ctx.togglePlay}
>
	{#if ctx.isPlaying.value}
		<Pause class="h-5 w-5 fill-current" />
	{:else}
		<Play class="h-5 w-5 fill-current ml-0.5" />
	{/if}
</Button>
