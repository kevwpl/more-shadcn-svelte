<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import { PMCommand } from '#lib/components/ui/pm-command/index.js';
	import type { PMCommandProps } from '#lib/components/ui/pm-command/pm-command.svelte';

	let {
		variant = 'default',
		class: className,
		command,
		agents = ['npm', 'pnpm', 'yarn', 'bun'],
		args,
		agent = $bindable('npm')
	}: PMCommandProps = $props();
</script>

<PMCommand {command} {args} {variant} {agent} {agents} class={cn('mt-4', className)} />
