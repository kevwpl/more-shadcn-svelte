<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Code from '$lib/components/ui/code';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	let { tabs }: { tabs: { name: string; content: string }[] } = $props();
</script>

<Tabs.Content
	value="code"
	class="flex-1 w-full min-w-0 m-0 overflow-hidden bg-background p-0 mr-auto gap-0"
>
	<Tabs.Root
		value={tabs[0]?.name}
		class="flex h-full w-full min-w-0 flex-col overflow-hidden p-0 gap-0"
	>
		<div class="flex h-10 shrink-0 border-b bg-muted/20 p-0 m-0">
			<Tabs.List class="flex h-full w-full justify-start rounded-none bg-transparent p-0 m-0 gap-0">
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
					<ScrollArea class="h-full w-full p-0" orientation="both">
						<div class="min-w-full w-fit m-0 p-0">
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
</Tabs.Content>
