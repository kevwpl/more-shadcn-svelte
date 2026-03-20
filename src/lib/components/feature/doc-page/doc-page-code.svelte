<script lang="ts">
	import * as Code from '$lib/components/ui/code';
	import { cn } from '$lib/utils';

	let {
		class: className,
		code,
		lang = 'svelte'
	}: {
		class?: string;
		code: string;
		lang?: 'svelte' | 'bash' | 'diff' | 'javascript' | 'json' | 'typescript' | undefined;
	} = $props();
</script>

<Code.Root
	{lang}
	{code}
	class={cn(
		'rounded-t-none rounded-b-md border-t-0 w-full max-h-[350px] overflow-scroll bg-muted',
		className
	)}
>
	<Code.CopyButton />
</Code.Root>
