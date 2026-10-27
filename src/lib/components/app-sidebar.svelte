<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';

	const items = [
		{
			title: 'Getting Started',
			links: [{ href: '/', label: 'Introduction' }]
		},
		{
			title: 'Components',
			links: [
				{ href: '/docs/components/stepper', label: 'Stepper' },
				{ href: '/docs/components/shiny-button', label: 'Shiny Button' },
				{ href: '/docs/components/spotlight-card', label: 'Spotlight Card' }
			]
		}
	];
</script>

<aside class="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
	<div class="h-full overflow-y-auto py-6 pr-6 lg:py-8">
		{#each items as group}
			<div class="mb-4">
				<h4 class="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
					{group.title}
				</h4>
				<div class="grid grid-flow-row auto-rows-max text-sm">
					{#each group.links as link}
						{@const isActive = $page.url.pathname === link.href}
						<a
							href={link.href}
							class={cn(
								'group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 hover:underline',
								isActive ? 'font-medium text-foreground' : 'text-muted-foreground'
							)}
						>
							{link.label}
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</aside>
