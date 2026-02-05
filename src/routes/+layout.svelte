<script lang="ts">
	import '../app.css';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Kbd from '$lib/components/ui/kbd/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { LightSwitch } from '$lib/components/ui/light-switch';
	import * as StatusDot from '$lib/components/ui/status-dot';
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
		Mouse,
		SquareSplitHorizontal,
		History,
		Dock,
		Expand,
		SquareArrowDown,
		Fingerprint,
		SquareChevronDown,
		Radio,
		CircleGauge,
		Calendars,
		Highlighter,
		NotebookPen
	} from 'lucide-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	let { children } = $props();

	const items = [
		{
			title: 'Getting Started',
			links: [{ href: '/', label: 'Introduction', icon: Rocket, new: false }]
		},
		{
			title: 'Forms & Inputs',
			links: [
				{ href: '/components/autocomplete', label: 'Autocomplete', icon: Book, new: false },
				{ href: '/components/chip', label: 'Chip', icon: RectangleHorizontal, new: false },
				{ href: '/components/choicebox', label: 'Choicebox', icon: SquareDot, new: false },
				{ href: '/components/color-picker', label: 'Color Picker', icon: Palette, new: false },
				{ href: '/components/date-strip', label: 'Date Strip', icon: Calendar, new: false },
				{
					href: '/components/dynamic-select',
					label: 'Dynamic Select',
					icon: SquareChevronDown,
					new: true
				},
				// IN WORKS
				// { href: '/components/editor', label: 'Editor', icon: NotebookPen, new: true },
				{
					href: '/components/hold-button',
					label: 'Hold Button',
					icon: SquareArrowDown,
					new: false
				},
				{ href: '/components/knob', label: 'Knob', icon: CircleGauge, new: true },
				{ href: '/components/phone-input', label: 'Phone Input', icon: PhoneCall, new: false },
				{ href: '/components/scrubbable', label: 'Scrubbable', icon: MoveHorizontal, new: false },
				{ href: '/components/tag-input', label: 'Tag Input', icon: RectangleEllipsis, new: false },
				{
					href: '/components/wheel-picker',
					label: 'Wheel Picker',
					icon: AlignVerticalSpaceAround,
					new: false
				}
			]
		},
		{
			title: 'Navigation',
			links: [
				{ href: '/components/bottom-nav', label: 'Bottom Nav', icon: PanelBottomClose, new: false },
				{ href: '/components/dock', label: 'Dock', icon: Dock, new: false },
				{ href: '/components/stepper', label: 'Stepper', icon: ArrowBigRightDash, new: false },
				{ href: '/components/walkthrough', label: 'Walkthrough', icon: Footprints, new: false }
			]
		},
		{
			title: 'Visuals & Media',
			links: [
				{ href: '/components/audio', label: 'Audio', icon: Radio, new: true },
				{ href: '/components/audio-wave', label: 'Audio Wave', icon: AudioLines, new: false },
				{
					href: '/components/compare-slider',
					label: 'Compare Slider',
					icon: SquareSplitHorizontal,
					new: false
				},
				{ href: '/components/cursor', label: 'Cursor', icon: MousePointer2, new: false },
				{ href: '/components/image-zoom', label: 'Image Zoom', icon: ImagePlus, new: false },
				{ href: '/components/shiny-button', label: 'Shiny Button', icon: Sparkle, new: false },
				{ href: '/components/spotlight-card', label: 'Spotlight Card', icon: Square, new: false },
				{ href: '/components/video', label: 'Video', icon: SquarePlay, new: false }
			]
		},
		{
			title: 'Data Display',
			links: [
				{ href: '/components/big-calendar', label: 'Big Calendar', icon: Calendar, new: false },
				{ href: '/components/event-card', label: 'Event Card', icon: Calendars, new: true },
				{ href: '/components/markdown', label: 'Markdown', icon: Highlighter, new: true },
				{
					href: '/components/number-ticker',
					label: 'Number Ticker',
					icon: ClockArrowUp,
					new: false
				},
				{ href: '/components/qr-code', label: 'QR Code', icon: QrCode, new: false },
				{ href: '/components/status-dot', label: 'Status Dot', icon: CircleDot, new: false },
				{ href: '/components/timeline', label: 'Timeline', icon: History, new: false }
			]
		},
		{
			title: 'Utilities',
			links: [
				{
					href: '/components/horizontal-scroll',
					label: 'Horizontal Scroll',
					icon: Mouse,
					new: false
				},
				{ href: '/components/sortable', label: 'Sortable', icon: Move, new: false },
				{ href: '/components/verify-human', label: 'Verify Human', icon: Fingerprint, new: false }
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
													{#if link.new}
														<Badge
															variant="secondary"
															class="ml-auto bg-blue-500 dark:bg-blue-600 text-white text-xs scale-80"
															>NEW</Badge
														>
													{/if}
												</Button>
											{:else}
												<Button
													href={link.href}
													variant="ghost"
													class="justify-start text-base text-muted-foreground flex items-center h-11"
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
						<Kbd.Root>⌘+K</Kbd.Root>
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
