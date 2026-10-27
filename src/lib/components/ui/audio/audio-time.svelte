<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getAudioPlayerContext } from './ctx';

	let { class: className }: { class?: string } = $props();
	const ctx = getAudioPlayerContext();

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<span class={cn('text-xs font-medium tabular-nums text-muted-foreground', className)}>
	{formatTime(ctx.currentTime.value)} / {formatTime(ctx.duration.value)}
</span>
