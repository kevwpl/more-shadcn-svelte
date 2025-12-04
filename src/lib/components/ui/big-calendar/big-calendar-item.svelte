<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		title,
		variant = 'default',
		...rest
	}: {
		class?: string;
		children?: Snippet;
		title?: string;
		variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning';
		[key: string]: any;
	} = $props();

	const variants = {
		default: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
		secondary: 'bg-muted text-foreground border-border hover:bg-muted/80',
		destructive:
			'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
		success:
			'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
		warning:
			'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800'
	};
</script>

<div
	class={cn(
		'group relative flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium border transition-all cursor-pointer mb-1 shadow-sm',
		variants[variant],
		className
	)}
	{...rest}
>
	<div class="h-1.5 w-1.5 rounded-full bg-current shrink-0 opacity-70" />
	<span class="truncate flex-1 text-left">{title}</span>
	{@render children?.()}
</div>
