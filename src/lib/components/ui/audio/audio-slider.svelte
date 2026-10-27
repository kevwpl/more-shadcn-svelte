<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { getAudioPlayerContext } from './ctx';

	let { class: className }: { class?: string } = $props();
	const ctx = getAudioPlayerContext();

	let progress = $derived(
		ctx.duration.value > 0 ? (ctx.currentTime.value / ctx.duration.value) * 100 : 0
	);
</script>

<div class={cn('relative h-1.5 w-full bg-secondary overflow-hidden', className)}>
	<div class="absolute left-0 top-0 h-full bg-primary" style="width: {progress}%"></div>
	<input
		type="range"
		min="0"
		max={ctx.duration.value}
		step="0.01"
		value={ctx.currentTime.value}
		oninput={(e) => ctx.seek(parseFloat(e.currentTarget.value))}
		class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
	/>
</div>
