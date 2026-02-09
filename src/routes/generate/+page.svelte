<script lang="ts">
	import Sidebar from '$lib/components/feature/generate/sidebar.svelte';
	import Workbench from '$lib/components/feature/generate/workbench.svelte';
	import { Sparkle, Loader2, ChevronLeft, SearchIcon, GithubIcon } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { LightSwitch } from '$lib/components/ui/light-switch';
	import { docsConfig } from '$lib/config/docs';
	import * as Kbd from '$lib/components/ui/kbd';
	import * as Command from '$lib/components/ui/command';

	let apiKey = $state('');
	let prompt = $state('');
	let model = $state('anthropic/claude-opus-4.6');
	let isGenerating = $state(false);
	let isDark = $state(false);
	let history = $state<{ role: 'user' | 'assistant'; content: string }[]>([]);
	let result = $state<any>(null);

	$effect(() => {
		const updateTheme = () => (isDark = document.documentElement.classList.contains('dark'));
		const obs = new MutationObserver(updateTheme);
		obs.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});
		updateTheme();
		return () => obs.disconnect();
	});

	async function engineer() {
		if (!prompt || !apiKey || isGenerating) return;
		const userPrompt = prompt;
		prompt = '';
		isGenerating = true;
		const nextHistory = [...history, { role: 'user', content: userPrompt }];
		history = nextHistory;

		try {
			const res = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: nextHistory, apiKey, model })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			result = data;
			history = [...history, { role: 'assistant', content: JSON.stringify(data) }];
		} catch (e: any) {
			alert(e.message);
		} finally {
			isGenerating = false;
		}
	}

	let searchOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchOpen = !searchOpen;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="flex h-screen flex-col overflow-hidden bg-background">
	<header
		class="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 lg:h-[60px] lg:px-6"
	>
		<div class="flex items-center gap-2">
			<a id="layout-logo" href="/" class="flex items-center gap-2 font-semibold">
				<img src="/logo.svg" alt="Logo" class="size-8" />
				<span class="text-xl font-bold">More Shadcn</span>
			</a>
			<Button variant="ghost" class="p-2" onclick={() => goto('/docs')}>
				<ChevronLeft />
				Back to docs
			</Button>
		</div>
		<div class="flex items-center justify-end gap-2">
			<Button
				id="layout-search"
				variant="outline"
				class="flex justify-between items-center gap-12"
				onclick={() => (searchOpen = true)}
			>
				<div class="flex items-center gap-2 text-muted-foreground">
					<SearchIcon class="size-4" />
					Search docs...
				</div>
				<Kbd.Group><Kbd.Root>⌘+K</Kbd.Root></Kbd.Group>
			</Button>
			<LightSwitch variant="ghost" />
			<Button
				variant="ghost"
				href="https://github.com/kevwpl/more-shadcn-svelte"
				size="icon"
				target="_blank"
			>
				<GithubIcon />
			</Button>
		</div>
	</header>

	<main class="flex flex-1 overflow-hidden">
		<div class="w-[400px] shrink-0 overflow-y-auto overflow-x-hidden border-r border-border">
			<Sidebar
				bind:apiKey
				bind:prompt
				bind:model
				{history}
				{isGenerating}
				onEngineer={engineer}
				onClear={() => {
					history = [];
					result = null;
				}}
			/>
		</div>

		<div class="relative flex-1 overflow-hidden bg-background">
			{#if isGenerating}
				<div
					class="flex h-full flex-col items-center justify-center gap-6"
					in:fade={{ duration: 200 }}
				>
					<div class="relative">
						<div
							class="absolute -inset-8 animate-spin rounded-full border-2 border-transparent border-t-primary opacity-20"
							style="animation-duration: 3s"
						></div>
						<div
							class="absolute -inset-5 animate-spin rounded-full border-2 border-transparent border-t-primary/60 opacity-30"
							style="animation-duration: 2s; animation-direction: reverse"
						></div>
						<div class="animate-pulse rounded-xl bg-primary/10 p-4">
							<Sparkle class="size-8 text-primary" />
						</div>
					</div>
					<div class="flex flex-col items-center gap-2 mt-5">
						<div class="flex items-center gap-2">
							<p class="text-sm font-semibold text-foreground">Generating component</p>
						</div>
						<p class="max-w-xs text-center text-xs text-muted-foreground">
							Building with {model.split('/').pop()}...
						</p>
						<div class="mt-2 flex gap-1">
							{#each Array(3) as _, i}
								<div
									class="size-1.5 animate-bounce rounded-full bg-primary/40"
									style="animation-delay: {i * 150}ms"
								></div>
							{/each}
						</div>
					</div>
				</div>
			{:else if result}
				<div class="h-full" in:fly={{ y: 10, duration: 250 }}>
					<Workbench {result} {isDark} />
				</div>
			{:else}
				<div class="flex h-full flex-col items-center justify-center gap-3 bg-muted/5 opacity-20">
					<Sparkle class="size-12" />
					<p class="text-xs font-bold uppercase tracking-[0.2em]">Awaiting Instruction</p>
				</div>
			{/if}
		</div>
	</main>
</div>

<Command.Dialog bind:open={searchOpen}>
	<Command.Input placeholder="Search Docs..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		{#each docsConfig as group}
			<Command.Group heading={group.title.toUpperCase()}>
				{#each group.links as link}
					{@const Icon = link.icon}
					<Command.Item
						class="flex items-center gap-2"
						onSelect={() => {
							searchOpen = false;
							goto(link.href);
						}}
					>
						<Icon class="size-4" />
						{link.label}
					</Command.Item>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
