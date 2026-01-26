<script lang="ts">
	import { fly } from 'svelte/transition';
	import { MessageSquare, Settings, Key, Loader2, ArrowUp } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as InputGroup from '$lib/components/ui/input-group';

	let {
		apiKey = $bindable(),
		prompt = $bindable(),
		history,
		isGenerating,
		onEngineer
	}: {
		apiKey: string;
		prompt: string;
		history: any[];
		isGenerating: boolean;
		onEngineer: () => void;
	} = $props();
	let showConfig = $state(false);
</script>

<div class="flex w-[400px] h-full flex-shrink-0 flex-col bg-muted/10">
	<div
		class="flex h-12 shrink-0 items-center justify-between border-b bg-background px-4 shadow-sm"
	>
		<div class="flex items-center gap-2">
			<MessageSquare class="size-4 text-primary" />
			<span class="text-[10px] font-black uppercase tracking-[0.1em] text-foreground">GENERATE</span
			>
		</div>
		<Button variant="ghost" size="icon" class="size-8" onclick={() => (showConfig = !showConfig)}>
			<Settings class="size-4 {apiKey ? 'text-green-500' : ''}" />
		</Button>
	</div>

	{#if showConfig}
		<div class="border-b p-4 bg-background shadow-inner" transition:fly={{ y: -10 }}>
			<span class="text-xs mb-2 text-muted-foreground font-bold">OPENROUTER API KEY</span>
			<div class="relative">
				<Key class="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="password"
					bind:value={apiKey}
					placeholder="sk-or-v1-..."
					class="h-9 pl-9 text-xs"
				/>
			</div>
		</div>
	{/if}

	<ScrollArea class="flex-1 min-h-0">
		<div class="space-y-4 p-4">
			{#each history.filter((m) => m.role === 'user') as msg}
				<div
					class="rounded-2xl border bg-background p-3 text-sm shadow-sm border-primary/10 leading-relaxed rounded-br-none"
				>
					{msg.content}
				</div>
			{/each}
			{#if isGenerating}
				<div
					class="flex items-center gap-3 p-3 text-xs italic text-muted-foreground"
					in:fly={{ y: 5 }}
				>
					<Loader2 class="size-3 animate-spin text-primary" />
					Generating component...
				</div>
			{/if}
		</div>
	</ScrollArea>

	<div class="border-t bg-background p-4 shadow-lg">
		<InputGroup.Root class="shadow-sm">
			<InputGroup.Input
				bind:value={prompt}
				placeholder="Refine or create..."
				disabled={isGenerating}
				class="h-11"
				onkeydown={(e) => e.key === 'Enter' && onEngineer()}
			/>
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button
					variant="default"
					size="icon-xs"
					onclick={onEngineer}
					disabled={!prompt || isGenerating || !apiKey}
					class="size-5 rounded-full"
				>
					{#if isGenerating}
						<Loader2 class="size-3 animate-spin" />
					{:else}
						<ArrowUp class="size-3" />
					{/if}
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>
</div>
