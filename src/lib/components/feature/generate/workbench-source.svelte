<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Code from '$lib/components/ui/code';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	let { tabs }: { tabs: { name: string; content: string }[] } = $props();
</script>

<Tabs.Content value="code" class="flex-1 w-full min-w-0 m-0 overflow-hidden bg-background">
	{#if tabs.length > 0}
		<Tabs.Root value={tabs[0].name} class="flex h-full w-full min-w-0 flex-col overflow-hidden">
			<div class="flex h-10 shrink-0 items-center gap-2 border-b bg-muted/20 px-4">
				<Tabs.List class="flex h-full gap-0 bg-transparent p-0 m-0">
					{#each tabs as tab}
						<Tabs.Trigger
							value={tab.name}
							class="h-full rounded-none border-none shadow-none text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-background"
						>
							{tab.name}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
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
									<div class="sticky top-4 right-4 z-20 flex justify-end pr-4 pointer-events-none">
										<div class="pointer-events-auto">
											<Code.CopyButton />
										</div>
									</div>
									<div class="p-4 pt-0">
										<Code.Code code={tab.content} />
									</div>
								</Code.Root>
							</div>
						</ScrollArea>
					</Tabs.Content>
				{/each}
			</div>
		</Tabs.Root>
	{/if}
</Tabs.Content>
