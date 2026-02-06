<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { ArrowRight, Github, GithubIcon, SearchIcon } from 'lucide-svelte';
	import * as Kbd from '$lib/components/ui/kbd';
	import * as Command from '$lib/components/ui/command';

	import { docsConfig } from '$lib/config/docs';
	import { Link } from '$lib/components/ui/link';
	import { LightSwitch } from '$lib/components/ui/light-switch';
	import { goto } from '$app/navigation';
	import { ShinyButton } from '$lib/components/ui/shiny-button';
	import StepperCard from '$lib/components/site/grid-items/StepperCard.svelte';
	import DockCard from '$lib/components/site/grid-items/DockCard.svelte';
	import ColorPickerCard from '$lib/components/site/grid-items/ColorPickerCard.svelte';
	import CompareSliderCard from '$lib/components/site/grid-items/CompareSliderCard.svelte';
	import ChipCard from '$lib/components/site/grid-items/ChipCard.svelte';
	import CursorCard from '$lib/components/site/grid-items/CursorCard.svelte';
	import EventCardCard from '$lib/components/site/grid-items/EventCardCard.svelte';
	import KnobCard from '$lib/components/site/grid-items/KnobCard.svelte';
	import VerifyHumanCard from '$lib/components/site/grid-items/VerifyHumanCard.svelte';
	import WheelPickerCard from '$lib/components/site/grid-items/WheelPickerCard.svelte';

	const newComponents = docsConfig.flatMap((group) => group.links).filter((link) => link.new);

	const badgeText = $derived.by(() => {
		const labels = newComponents.map((c) => c.label);
		if (labels.length === 0) return 'Check out our latest components';

		const limit = 3;
		const display = labels.slice(0, limit);
		const hasMore = labels.length > limit;

		return `New Components: ${display.join(', ')}${hasMore ? ' and more' : ''}`;
	});

	let searchOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchOpen = !searchOpen;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="w-full sticky top-0 right-0 left-0 p-4 backdrop-blur-xl bg-background/50 z-99">
	<div class="max-w-5xl mx-auto flex justify-between">
		<a id="layout-logo" href="/" class="flex items-center gap-2 font-semibold">
			<img src="/logo.svg" alt="Logo" class="size-8" />
			<span class="text-xl font-bold">More Shadcn</span>
		</a>
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
	</div>
</div>

<section
	class="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20"
>
	<a
		href="/docs"
		class="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium group"
	>
		<Badge class="mr-2 px-1 py-0 text-[10px]" variant="secondary">New</Badge>
		<span class="sm:hidden">Browse the latest updates</span>
		<span class="hidden sm:inline">{badgeText}</span>
		<ArrowRight class="ml-1 size-4 group-hover:ml-2 transition-all" />
	</a>
	<h1
		class="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]"
	>
		<span class="relative inline-block">
			<span class="relative z-10">Expand Your Design System</span>
			<span
				class="absolute bottom-1 left-0 h-[0.2em] w-0 bg-[#f73c00] rounded-sm animate-[draw_0.4s_ease-in_forwards] z-0"
			></span>
		</span>
	</h1>

	<style>
		@keyframes draw {
			from {
				width: 0;
			}
			to {
				width: 100%;
			}
		}
	</style>

	<p class="max-w-[750px] text-center text-xl text-muted-foreground">
		A collection of high-quality, copy-paste components for Svelte 5, built on top of <Link
			href="https://shadcn-svelte.com/"
			target="_blank">shadcn-svelte</Link
		>.
	</p>

	<div class="flex w-full items-center justify-center space-x-4 py-4 md:pb-10 mt-4">
		<ShinyButton href="/docs" class="group"
			>Get Started <ArrowRight class="group-hover:ml-2 ml-1 transition-all" /></ShinyButton
		>
	</div>
</section>

<section class="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
	<div class="grid gap-4 lg:grid-cols-2">
		<div class="grid gap-4">
			<StepperCard />
			<CompareSliderCard />
			<CursorCard />
			<VerifyHumanCard />
		</div>
		<div class="grid gap-4">
			<DockCard />
			<ColorPickerCard />
			<ChipCard />
			<EventCardCard />
			<KnobCard />
			<WheelPickerCard />
		</div>
	</div>
</section>

<footer class="mt-20 border-t bg-muted/20">
	<div class="mx-auto flex max-w-[980px] flex-col items-center gap-6 py-16 text-center">
		<div class="space-y-3">
			<h2 class="text-3xl font-bold tracking-tighter md:text-5xl">...and so much more</h2>
			<p class="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
				Explore our full catalog of components including Audio Players, Advanced Calendars, Bottom
				Navigation, and Responsive Timelines.
			</p>
		</div>

		<div class="flex items-center gap-4">
			<ShinyButton href="/docs" class="group">
				Explore All Components
				<ArrowRight class="ml-1 size-4 transition-all group-hover:ml-2" />
			</ShinyButton>
		</div>

		<div
			class="mt-8 flex flex-col items-center gap-4 border-t pt-8 w-full md:flex-row md:justify-between md:pt-12"
		>
			<p class="text-sm text-muted-foreground leading-loose">
				Built by <Link href="https://github.com/kevwpl" target="_blank">Kevin</Link>. Open source on <Link
					href="https://github.com/kevwpl/more-shadcn-svelte"
					target="_blank">GitHub</Link
				>.
			</p>
			<div class="flex items-center gap-4 text-sm text-muted-foreground">
				<Link href="/docs">Docs</Link>
				<Link href="/components">Components</Link>
				<Link href="https://shadcn-svelte.com" target="_blank">shadcn-svelte</Link>
			</div>
		</div>
	</div>
</footer>

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
