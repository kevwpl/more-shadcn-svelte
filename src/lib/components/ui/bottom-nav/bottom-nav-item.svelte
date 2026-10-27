<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	let {
		href,
		class: className,
		isActive,
		children
	}: {
		href: string;
		class?: string;
		isActive?: boolean;
		children: Snippet;
	} = $props();

	let active = $derived(isActive ?? page.url.pathname === href);
</script>

<a
	{href}
	class={cn(
		'group flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors duration-200 hover:bg-muted/20 h-full rounded-md',
		active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
		className
	)}
>
	<div class="flex flex-col items-center justify-center gap-1">
		{@render children()}
	</div>
</a>
