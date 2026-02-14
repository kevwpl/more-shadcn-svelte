<script lang="ts">
	import { cn } from '$lib/utils';
	import { Clock } from '@lucide/svelte';

	let {
		startTime,
		endTime,
		class: className
	}: {
		startTime: string;
		endTime?: string;
		class?: string;
	} = $props();
</script>

<div class={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
	<Clock class="h-3 w-3" />
	<span
		>{startTime}{#if endTime}
			&nbsp— {endTime}{/if}</span
	>
</div>
