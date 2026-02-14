<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as Timeline from '$lib/components/ui/timeline';
	import { Badge } from '$lib/components/ui/badge';
	import { Rocket } from '@lucide/svelte';
	import { COMPONENT_URL } from '$lib/config/docs';

	const updates = [
		{
			date: 'February 2026',
			version: '1.0.0',
			title: 'Out of preview! 🎉',
			icon: Rocket,
			description:
				'Launched version 1.0.0 of More Shadcn with 30 high-quality components. And here are the newest ones:',
			items: [
				{
					label: 'Dynamic Select',
					slug: 'dynamic-select',
					desc: 'Combobox that allows custom values.'
				},
				{ label: 'Knob', slug: 'knob', desc: 'Rotating dials for precise numeric input.' },
				{ label: 'Audio', slug: 'audio', desc: 'Full-featured audio player with context state.' },
				{
					label: 'Event Card',
					slug: 'event-card',
					desc: 'Modern agenda and meeting display components.'
				},
				{ label: 'Markdown', slug: 'markdown', desc: 'Render markdown to HTML.' }
			]
		}
	];
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Changelog</DocPage.Title>
		<DocPage.Description>
			Latest updates, new components, and bug fixes for the library.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<Timeline.Root>
			{#each updates as update}
				<Timeline.Item class="mb-12">
					<Timeline.Separator class="bg-primary text-primary-foreground border-primary">
						<update.icon class="size-3" />
					</Timeline.Separator>

					<Timeline.Content>
						<div class="flex items-center gap-3 mb-1">
							<Timeline.Date class="mt-0">{update.date}</Timeline.Date>
							<Badge variant="outline" class="font-mono text-[10px] py-0">{update.version}</Badge>
						</div>

						<Timeline.Title class="text-2xl">{update.title}</Timeline.Title>
						<p class="text-muted-foreground mt-2 max-w-2xl text-sm">
							{update.description}
						</p>

						<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{#each update.items as item}
								<a
									href={`${COMPONENT_URL}/${item.slug}`}
									class="flex flex-col gap-1 p-3 rounded-xl border bg-muted/30 transition-all hover:bg-muted hover:border-primary/30 group"
								>
									<span class="text-sm font-bold group-hover:text-primary transition-colors">
										{item.label}
									</span>
									<span class="text-xs text-muted-foreground leading-relaxed">{item.desc}</span>
								</a>
							{/each}
						</div>
					</Timeline.Content>
				</Timeline.Item>
			{/each}
		</Timeline.Root>
	</DocPage.Content>
</DocPage.Root>
