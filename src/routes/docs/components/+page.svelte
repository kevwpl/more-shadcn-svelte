<script>
	import * as DocPage from '$lib/components/feature/doc-page';
	import { docsConfig } from '$lib/config/docs';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	const componentGroups = docsConfig.filter((group) => group.title !== 'Getting Started');
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Components</DocPage.Title>
		<DocPage.Description>
			All of the components that are available in this registry.
		</DocPage.Description>
	</DocPage.Header>

	<div class="space-y-12">
		{#each componentGroups as group}
			<div class="space-y-4">
				<h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					{group.title}
				</h2>
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each group.links as link}
						{@const Icon = link.icon}
						<Button
							href={link.href}
							variant="ghost"
							class="h-auto flex items-center justify-between text-left font-normal transition-all hover:border-primary/50 hover:bg-muted/50"
						>
							<div class="flex items-center gap-3">
								<Icon class="size-5" />
								<div class="flex flex-col gap-0.5">
									<span class="font-medium">{link.label}</span>
								</div>
							</div>
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
	</div>
</DocPage.Root>
