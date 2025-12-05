<script lang="ts">
	import { cn } from '$lib/utils';
	import { getScrubbableContext } from './ctx';

	let {
		class: className,
		format = (v: number) => v.toString()
	}: {
		class?: string;
		format?: (v: number) => string;
	} = $props();

	const ctx = getScrubbableContext();
	let val = $derived(ctx.value());
</script>

<span class={cn('tabular-nums pointer-events-none transition-opacity', className)}>
	{format(val)}
</span>
