<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children
	}: {
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class={cn('border-border border rounded-t-md w-full h-[450px] ', className)}>
	<div class="w-full h-full flex justify-center items-center">
		{@render children()}
	</div>
</div>
