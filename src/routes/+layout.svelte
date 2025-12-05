<script lang="ts">
	import '../app.css';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Kbd from '$lib/components/ui/kbd/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { LightSwitch } from '$lib/components/ui/light-switch';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import {
		Rocket,
		Footprints,
		Sparkle,
		Square,
		ArrowBigRightDash,
		ClockArrowUp,
		PanelBottomClose,
		PhoneCall,
		GithubIcon,
		SearchIcon,
		ImagePlus,
		Book,
		SquarePlay,
		Calendar,
		Palette,
		MousePointer2,
		RectangleHorizontal,
		RectangleEllipsis,
		CircleDot,
		QrCode,
		SquareDot,
		Move,
		AudioLines,
		AlignVerticalSpaceAround,
		MoveHorizontal,
		Mouse
	} from 'lucide-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	let { children } = $props();

	const items = [
		{
			title: 'Getting Started',
			links: [{ href: '/', label: 'Introduction', icon: Rocket }]
		},
		{
			title: 'Forms',
			links: [
				{ href: '/components/autocomplete', label: 'Autocomplete', icon: Book },
				{ href: '/components/chip', label: 'Chip', icon: RectangleHorizontal },
				{ href: '/components/choicebox', label: 'Choicebox', icon: SquareDot },
				{ href: '/components/color-picker', label: 'Color Picker', icon: Palette },
				{ href: '/components/date-strip', label: 'Date Strip', icon: Calendar },
				{ href: '/components/phone-input', label: 'Phone Input', icon: PhoneCall },
				{ href: '/components/scrubbable', label: 'Scrubbable', icon: MoveHorizontal },
				{ href: '/components/sortable', label: 'Sortable', icon: Move },
				{ href: '/components/tag-input', label: 'Tag Input', icon: RectangleEllipsis },
				{ href: '/components/wheel-picker', label: 'Wheel Picker', icon: AlignVerticalSpaceAround }
			]
		},
		{
			title: 'Navigation',
			links: [
				{ href: '/components/big-calendar', label: 'Big Calendar', icon: Calendar },
				{ href: '/components/bottom-nav', label: 'Bottom Nav', icon: PanelBottomClose },
				{ href: '/components/horizontal-scroll', label: 'Horizontal Scroll', icon: Mouse },
				{ href: '/components/stepper', label: 'Stepper', icon: ArrowBigRightDash },
				{ href: '/components/walkthrough', label: 'Walkthrough', icon: Footprints }
			]
		},
		{
			title: 'Visuals & Media',
			links: [
				{ href: '/components/audio-wave', label: 'Audio Wave', icon: AudioLines },
				{ href: '/components/cursor', label: 'Cursor', icon: MousePointer2 },
				{ href: '/components/image-zoom', label: 'Image Zoom', icon: ImagePlus },
				{ href: '/components/shiny-button', label: 'Shiny Button', icon: Sparkle },
				{ href: '/components/spotlight-card', label: 'Spotlight Card', icon: Square },
				{ href: '/components/video', label: 'Video', icon: SquarePlay }
			]
		},
		{
			title: 'Data Display',
			links: [
				{ href: '/components/number-ticker', label: 'Number Ticker', icon: ClockArrowUp },
				{ href: '/components/qr-code', label: 'QR Code', icon: QrCode },
				{ href: '/components/status-dot', label: 'Status Dot', icon: CircleDot }
			]
		}
	];

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchOpen = !searchOpen;
		}
	}

	function getCurrentTitle(): string {
		if (browser) {
			const currentPath = page.url.pathname;
			const baseTitle = 'More Shadcn';

			for (const group of items) {
				const link = group.links.find((l) => currentPath.endsWith(l.href) && l.href !== '/');
				if (link) {
					return `${link.label} – ${baseTitle}`;
				}
			}

			if (currentPath === '/') return `Introduction – ${baseTitle}`;

			return baseTitle;
		}
		return 'More Shadcn';
	}
	let searchOpen = $state(false);
</script>

<svelte:head>
	<title>{getCurrentTitle()}</title>
	<link rel="icon" type="image/svg" href="/logo.svg" />
</svelte:head>

<svelte:document onkeydown={handleKeydown} />
<ModeWatcher />

<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
	<div
		id="layout-sidebar"
		class="bg-muted/40 hidden border-r md:block sticky top-0 b-0 z-20 h-screen"
	>
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
						{#each items as group}
							<div class="mb-4">
								<h4 class="mb-1 rounded-md px-2 py-1 text-sm text-muted-foreground">
									{group.title.toUpperCase()}
								</h4>

								<div class="grid grid-flow-row auto-rows-max text-sm">
									{#if browser}
										{#each group.links as link}
											{@const Icon = link.icon}
											{@const isActive = page.url.pathname.endsWith(link.href)}
											{#if isActive}
												<Button
													href={link.href}
													variant="ghost"
													class="justify-start text-base flex items-center h-11 bg-accent"
												>
													<Icon class="size-4" />
													{link.label}
												</Button>
											{:else}
												<Button
													href={link.href}
													variant="ghost"
													class="justify-start text-base text-muted-foreground flex items-center h-11"
												>
													<Icon class="size-4" />
													{link.label}
												</Button>
											{/if}
										{/each}
									{/if}
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

					<Kbd.Group>
						<Kbd.Root>Ctrl</Kbd.Root>
						<span class="text-muted-foreground">+</span>
						<Kbd.Root>K</Kbd.Root>
					</Kbd.Group>
				</Button>
				<div class="flex items-center gap-2">
					<LightSwitch variant="ghost" />
					<Button
						variant="ghost"
						href="https://github.com/kevwpl/more-shadcn-svelte"
						size="icon"
						target="_blank"><GithubIcon /></Button
					>
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
		{#each items as group}
			<Command.Group heading={group.title.toUpperCase()}>
				{#each group.links as link}
					{@const Icon = link.icon}
					<Command.Item
						class="flex items-center gap-2"
						onclick={() => {
							searchOpen = false;
							goto(link.href);
						}}
					>
						<Icon class="size-2" />
						{link.label}
					</Command.Item>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
