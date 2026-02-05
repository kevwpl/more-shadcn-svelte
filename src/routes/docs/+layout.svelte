<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Kbd from '$lib/components/ui/kbd';
	import * as Command from '$lib/components/ui/command';
	import { LightSwitch } from '$lib/components/ui/light-switch';
	import { GithubIcon, SearchIcon } from 'lucide-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { docsConfig } from '$lib/config/docs';

	let { children } = $props();
	let searchOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchOpen = !searchOpen;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
	<div id="layout-sidebar" class="bg-muted/40 hidden border-r md:block sticky top-0 z-20 h-screen">
		<div class="flex h-full max-h-screen flex-col gap-2">
			<div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
				<a id="layout-logo" href="/" class="flex items-center gap-2 font-semibold">
					<img src="/logo.svg" alt="Logo" class="size-8" />
					<span class="text-xl font-bold">More Shadcn</span>
				</a>
			</div>
			<div class="flex-1 min-h-0">
				<ScrollArea class="h-full">
					<nav class="grid items-start px-2 text-sm font-medium lg:px-4 pt-4">
						{#each docsConfig as group}
							<div class="mb-4">
								<h4 class="mb-1 rounded-md px-2 py-1 text-sm text-muted-foreground">
									{group.title.toUpperCase()}
								</h4>
								<div class="grid grid-flow-row auto-rows-max text-sm">
									{#each group.links as link}
										{@const Icon = link.icon}
										{@const isActive = page.url.pathname.endsWith(link.href)}
										<Button
											href={link.href}
											variant="ghost"
											class="justify-start text-base flex items-center h-11 {isActive
												? 'bg-accent'
												: 'text-muted-foreground'}"
										>
											<Icon class="size-4" />
											{link.label}
											{#if link.new}
												<Badge
													variant="secondary"
													class="ml-auto bg-blue-500 dark:bg-blue-600 text-white text-xs scale-80"
													>NEW</Badge
												>
											{/if}
										</Button>
									{/each}
								</div>
							</div>
						{/each}
					</nav>
				</ScrollArea>
			</div>
		</div>
	</div>

	<div class="flex flex-col">
		<header
			class="bg-muted/40 flex backdrop-blur-2xl h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-4 sticky top-0 z-20"
		>
			<div class="w-full flex items-center justify-between">
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
				<div class="flex items-center gap-2">
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
			</div>
		</header>
		<main class="flex w-full justify-center">
			{@render children()}
		</main>
	</div>
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
