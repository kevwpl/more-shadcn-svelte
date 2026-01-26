<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Eye, Code2, Terminal, Check } from 'lucide-svelte';
	let { copied, onCopyInstall }: { copied: boolean; onCopyInstall: () => void } = $props();
</script>

<div class="flex h-12 shrink-0 items-center justify-between border-b bg-background px-4">
	<Tabs.List class="h-9 rounded-md bg-muted/50 p-1">
		<Tabs.Trigger
			value="preview"
			class="flex h-7 gap-2 px-4 text-[10px] font-bold uppercase tracking-wider"
		>
			<Eye class="size-3" /> Preview
		</Tabs.Trigger>
		<Tabs.Trigger
			value="code"
			class="flex h-7 gap-2 px-4 text-[10px] font-bold uppercase tracking-wider"
		>
			<Code2 class="size-3" /> Source
		</Tabs.Trigger>
	</Tabs.List>
	<Button
		variant="outline"
		size="sm"
		class="h-8 gap-2 text-[10px] font-bold uppercase tracking-wider"
		onclick={onCopyInstall}
	>
		{#if copied}
			<Check class="size-3 text-green-500" />
		{:else}
			<Terminal class="size-3" />
		{/if} Install
	</Button>
</div>
