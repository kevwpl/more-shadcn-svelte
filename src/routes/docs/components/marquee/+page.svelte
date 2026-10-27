<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Marquee } from '$lib/components/ui/marquee';
	import { Badge } from '$lib/components/ui/badge';
	import { CircleCheck, GitBranch, Rocket, TriangleAlert } from '@lucide/svelte';

	const components = [
		'Canvas',
		'Geocoder',
		'PDF Viewer',
		'Sticky Note',
		'Signature Pad',
		'Emoji Picker',
		'Mention Input',
		'Ping Indicator'
	];

	const events = [
		{ icon: CircleCheck, text: 'Build passed on main', tone: 'text-emerald-500' },
		{ icon: GitBranch, text: 'Branch feature/search opened', tone: 'text-sky-500' },
		{ icon: Rocket, text: 'Deployed to staging', tone: 'text-violet-500' },
		{ icon: TriangleAlert, text: 'Slow query flagged', tone: 'text-amber-500' },
		{ icon: CircleCheck, text: 'All checks green', tone: 'text-emerald-500' }
	];
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Marquee</DocPage.Title>
		<DocPage.Description
			>An endlessly scrolling strip of content that loops seamlessly.</DocPage.Description
		>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-12">
				<div class="flex w-full flex-col gap-4">
					<Marquee gap={12}>
						{#each components as name}
							<Badge variant="secondary" class="px-3 py-1 text-sm">{name}</Badge>
						{/each}
					</Marquee>
					<Marquee direction="right" gap={12} speed={28}>
						{#each [...components].reverse() as name}
							<Badge variant="outline" class="px-3 py-1 text-sm">{name}</Badge>
						{/each}
					</Marquee>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { Marquee } from '$lib/components/ui/marquee';
</script>

<Marquee gap={12}>
  {#each items as item}
    <Badge>{item}</Badge>
  {/each}
</Marquee>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'marquee'}
		<DocPage.Text
			>Run the following command to install the `{componentName}` components:</DocPage.Text
		>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://legacy.more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>

		<DocPage.Heading>How it loops</DocPage.Heading>
		<DocPage.Text>
			The content is measured and repeated just enough times to cover the container plus one more
			copy sliding in, then the track moves by exactly one copy and its gap before snapping back —
			so the seam is never visible, at any width. <code>speed</code> is in pixels per second, so a short
			list and a long one move at the same pace.
		</DocPage.Text>
		<DocPage.Text>
			It is a CSS animation, so it costs nothing per frame in JavaScript. It pauses on hover (turn
			off with <code>pauseOnHover=&#123;false&#125;</code>) and whenever something inside it has
			keyboard focus, and stays still for users who prefer reduced motion. The repeats are hidden
			from screen readers and removed from the tab order, so links inside are announced and tabbed
			to once.
		</DocPage.Text>

		<DocPage.Heading>Vertical</DocPage.Heading>
		<DocPage.Text>
			<code>up</code> and <code>down</code> scroll vertically — give the marquee a height.
			<code>fade</code> masks the edges and <code>fadeSize</code> sets how far in it reaches.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<Marquee direction="up" class="h-56 w-72" gap={10} speed={24} fadeSize="20%">
					{#each events as event}
						<div class="flex w-72 items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm">
							<event.icon class="size-4 shrink-0 {event.tone}" />
							<span>{event.text}</span>
						</div>
					{/each}
				</Marquee>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Marquee direction="up" class="h-56" fadeSize="20%">
  {#each events as event}
    <EventRow {event} />
  {/each}
</Marquee>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
