<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as Chip from '$lib/components/ui/chip';
	import { HorizontalScroll } from '$lib/components/ui/horizontal-scroll';
	import { Badge } from '$lib/components/ui/badge';
	import { Check, Image, Music, Plus } from 'lucide-svelte';

	let filters = $state<string[]>(['Design']);

	function toggleFilters(name: string) {
		if (filters.includes(name)) {
			filters = filters.filter((i) => i !== name);
		} else {
			filters = [...filters, name];
		}
	}
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Horizontal Scroll</DocPage.Title>
		<DocPage.Description>
			Converts vertical mouse wheel scrolling into horizontal scrolling.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="p-10">
				<div class="flex flex-col">
					<div class="space-y-2 mb-4 px-1">
						<h3 class="font-semibold text-lg">Featured Albums</h3>
						<p class="text-xs text-muted-foreground">
							Hover the list and scroll with your mouse wheel.
						</p>
					</div>

					<HorizontalScroll class="gap-4 py-4 max-w-xl">
						{#each Array(10) as _, i}
							<div
								class="shrink-0 w-[150px] space-y-3 cursor-pointer hover:opacity-80 transition-opacity"
							>
								<div
									class="overflow-hidden rounded-md border bg-muted aspect-square flex items-center justify-center"
								>
									<Music class="h-10 w-10 text-muted-foreground" />
								</div>
								<div class="space-y-1 text-sm">
									<h3 class="font-medium leading-none">Album {i + 1}</h3>
									<p class="text-xs text-muted-foreground">Artist Name</p>
								</div>
							</div>
						{/each}
					</HorizontalScroll>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<HorizontalScroll class="gap-4">
  {#each albums as album}
     <div class="shrink-0 w-[150px]">
        <img src={album.cover} class="aspect-square rounded-md" />
        <h3>{album.name}</h3>
     </div>
  {/each}
</HorizontalScroll>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'horizontal-scroll'}
		<DocPage.Text
			>Run the following command to install the `{componentName}` components:</DocPage.Text
		>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>

		<DocPage.Heading>Tag List</DocPage.Heading>
		<DocPage.Text>Useful for overflowing tag lists or category filters.</DocPage.Text>

		<DocPage.Example>
			<DocPage.Preview class="block p-10">
				<div class="w-full max-w-sm mx-auto border rounded-xl overflow-hidden shadow-sm">
					<div class="p-4 border-b">
						<h4 class="font-bold text-sm">Filter by Category</h4>
					</div>
					<Chip.Group>
						<HorizontalScroll class="gap-1 p-2 bg-muted/20 items-center">
							{#each ['All', 'Unread', 'Favorites', 'Archives', 'Deleted', 'Spam', 'Social', 'Updates', 'Promotions', 'Forums'] as tag}
								<Chip.Root
									variant="outline"
									active={filters.includes(tag)}
									onclick={() => toggleFilters(tag)}
								>
									{#snippet icon()}
										{#if filters.includes(tag)}
											<Check class="h-3.5 w-3.5" />
										{:else}
											<Plus class="h-3.5 w-3.5" />
										{/if}
									{/snippet}
									{tag}
								</Chip.Root>
							{/each}
						</HorizontalScroll>
					</Chip.Group>
					<div class="p-8 text-center text-xs text-muted-foreground">Content Area</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<HorizontalScroll class="gap-2">
   {#each tags as tag}
      <Chip>{tag}</Chip>
   {/each}
</HorizontalScroll>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
