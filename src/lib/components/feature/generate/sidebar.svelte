<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import {
		MessageSquare,
		Settings,
		Key,
		Loader2,
		ArrowUp,
		Trash2,
		Sparkles,
		Eye,
		EyeOff,
		Check,
		ChevronDown
	} from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { tick } from 'svelte';

	let {
		apiKey = $bindable(),
		prompt = $bindable(),
		model = $bindable('anthropic/claude-opus-4.6'),
		history,
		isGenerating,
		onEngineer,
		onClear
	}: {
		apiKey: string;
		prompt: string;
		model: string;
		history: any[];
		isGenerating: boolean;
		onEngineer: () => void;
		onClear?: () => void;
	} = $props();

	let showConfig = $state(false);
	let showKey = $state(false);
	let scrollEl = $state<HTMLElement | null>(null);

	const models = [
		{ id: 'anthropic/claude-opus-4.6', label: 'Claude Opus 4.6' },
		{ id: 'anthropic/google/gemini-3-pro-preview', label: 'Gemini 3 Pro' },
		{ id: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash' },
		{ id: 'openai/gpt-5.2', label: 'GPT 5.2' }
	];

	let selectedModel = $derived(models.find((m) => m.id === model) ?? models[0]);

	let userMessages = $derived(history.filter((m) => m.role === 'user'));

	let messageCount = $derived(userMessages.length);

	$effect(() => {
		if (history.length && scrollEl) {
			tick().then(() => {
				scrollEl?.scrollTo({
					top: scrollEl.scrollHeight,
					behavior: 'smooth'
				});
			});
		}
	});
</script>

<div class="flex h-full w-[400px] flex-shrink-0 flex-col bg-sidebar">
	<div
		class="flex h-12 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm"
	>
		<div class="flex items-center gap-2">
			<Sparkles class="size-4 text-primary" />
			<span class="text-[10px] font-black uppercase tracking-[0.15em] text-foreground">
				Generate
			</span>
			{#if messageCount > 0}
				<span
					class="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary"
				>
					{messageCount}
				</span>
			{/if}
		</div>
		<div class="flex items-center gap-1">
			{#if history.length > 0}
				<Button
					variant="ghost"
					size="icon"
					class="size-8 text-muted-foreground hover:text-destructive"
					onclick={() => onClear?.()}
				>
					<Trash2 class="size-3.5" />
				</Button>
			{/if}
			<Button variant="ghost" size="icon" class="size-8" onclick={() => (showConfig = !showConfig)}>
				{#if apiKey}
					<Check class="size-4 text-green-500" />
				{:else}
					<Settings class="size-4 text-muted-foreground" />
				{/if}
			</Button>
		</div>
	</div>

	{#if showConfig}
		<div class="space-y-3 border-b bg-muted/30 p-4" transition:slide={{ duration: 150 }}>
			<div class="space-y-1.5">
				<span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
					API Key (OpenRouter)
				</span>
				<div class="relative">
					h
					<Key class="absolute left-3 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
					<Input
						type={showKey ? 'text' : 'password'}
						bind:value={apiKey}
						placeholder="sk-or-v1-..."
						class="h-8 pl-8 pr-9 font-mono text-xs"
					/>
					<button
						class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						onclick={() => (showKey = !showKey)}
					>
						{#if showKey}
							<EyeOff class="size-3.5" />
						{:else}
							<Eye class="size-3.5" />
						{/if}
					</button>
				</div>
				{#if apiKey}
					<p class="text-[10px] text-green-500">Connected</p>
				{/if}
			</div>

			<div class="space-y-1.5">
				<span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
					Model
				</span>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<button
								{...props}
								class="flex h-8 w-full items-center justify-between rounded-md border bg-background px-3 text-xs hover:bg-accent"
							>
								{selectedModel.label}
								<ChevronDown class="size-3 text-muted-foreground" />
							</button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start" class="w-[calc(400px-2rem)]">
						{#each models as m}
							<DropdownMenu.Item onclick={() => (model = m.id)} class="text-xs">
								<span class="flex-1">{m.label}</span>
								{#if model === m.id}
									<Check class="size-3 text-primary" />
								{/if}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	{/if}

	<div class="relative min-h-0 flex-1" bind:this={scrollEl}>
		<ScrollArea class="h-full">
			<div class="space-y-3 p-4">
				{#if userMessages.length === 0 && !isGenerating}
					<div class="flex flex-col items-center justify-center gap-2 py-16 text-center">
						<MessageSquare class="size-8 text-muted-foreground/30" />
						<p class="text-xs font-medium text-muted-foreground/50">
							Describe the component you want to build
						</p>
					</div>
				{/if}

				{#each userMessages as msg, i}
					<div in:fly={{ y: 8, duration: 200 }}>
						<div class="mb-1 flex items-center gap-2">
							<span class="text-[10px] font-semibold text-muted-foreground/60">
								Prompt {i + 1}
							</span>
						</div>
						<div
							class="rounded-xl rounded-br-sm border border-primary/5 bg-background p-3 text-[13px] leading-relaxed shadow-sm"
						>
							{msg.content}
						</div>
					</div>
				{/each}

				{#if isGenerating}
					<div
						class="flex items-center gap-2.5 rounded-xl bg-primary/5 p-3"
						in:fly={{ y: 5, duration: 150 }}
					>
						<Loader2 class="size-3.5 animate-spin text-primary" />
						<span class="text-xs font-medium text-primary/80">
							Generating with {selectedModel.label}...
						</span>
					</div>
				{/if}
			</div>
		</ScrollArea>
	</div>

	<div class="border-t bg-background/80 p-3 backdrop-blur-sm">
		{#if !apiKey}
			<button
				class="mb-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted/50 py-2 text-[10px] font-medium text-muted-foreground hover:bg-muted"
				onclick={() => (showConfig = true)}
			>
				<Key class="size-3" />
				Add API key to get started
			</button>
		{/if}
		<InputGroup.Root class="shadow-sm">
			<InputGroup.Input
				bind:value={prompt}
				placeholder={messageCount > 0 ? 'Refine your component...' : 'Describe a component...'}
				disabled={isGenerating || !apiKey}
				class="h-10 text-sm"
				onkeydown={(e) => e.key === 'Enter' && onEngineer()}
			/>
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button
					variant="default"
					size="icon-xs"
					onclick={onEngineer}
					disabled={!prompt || isGenerating || !apiKey}
					class="size-6 rounded-full"
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
