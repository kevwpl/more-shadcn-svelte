<script lang="ts">
	import { cn } from '#lib/utils.js';
	let { class: className }: { class?: string } = $props();
</script>

<div class={cn('h-8 w-[1px] bg-border mx-1', className)} />
