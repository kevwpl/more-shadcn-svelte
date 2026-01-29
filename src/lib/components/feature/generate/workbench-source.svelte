<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Code from '$lib/components/ui/code';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { HorizontalScroll } from '$lib/components/ui/horizontal-scroll';

	let { tabs }: { tabs: { name: string; content: string }[] } = $props();
</script>

<Tabs.Content
	value="code"
	class="flex-1 w-full min-w-0 m-0 space-y-0 overflow-hidden bg-background gap-0"
>
	{#if tabs.length > 0}
		<Tabs.Root
			value={tabs[0].name}
			class="flex h-full w-full min-w-0 flex-col overflow-hidden space-y-0  gap-0"
		>
			<div class="flex h-11 shrink-0 items-center gap-2 border-b bg-muted/20 px-4">
				<HorizontalScroll class="p-1 h-full">
					<Tabs.List class="flex h-full gap-0 bg-transparent p-0 m-0">
						{#each tabs as tab}
							<Tabs.Trigger
								value={tab.name}
								class="h-full text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-background"
							>
								{tab.name}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</HorizontalScroll>
			</div>

			<div class="flex-1 w-full min-w-0 overflow-hidden">
				{#each tabs as tab}
					<Tabs.Content value={tab.name} class="h-full w-full min-w-0 m-0 p-0 outline-none">
						<ScrollArea class="h-full w-full" orientation="both">
							<div class="min-w-full w-fit">
								<Code.Root
									lang="svelte"
									code={tab.content}
									class="m-0 min-h-full border-none rounded-none p-0"
								>
									<Code.CopyButton />
								</Code.Root>
							</div>
						</ScrollArea>
					</Tabs.Content>
				{/each}
			</div>
		</Tabs.Root>
	{/if}
</Tabs.Content>
