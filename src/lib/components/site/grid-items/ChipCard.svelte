<script lang="ts">
	import * as Chip from '$lib/components/ui/chip';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { Check, Plus } from 'lucide-svelte';

	let activeTags = $state(['Svelte', 'Tailwind']);
	const tags = ['Svelte', 'Tailwind', 'React', 'Typescript'];

	function toggle(tag: string) {
		activeTags = activeTags.includes(tag)
			? activeTags.filter((t) => t !== tag)
			: [...activeTags, tag];
	}
</script>

<div class="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between h-full">
	<div class="mb-4">
		<h3 class="font-semibold leading-none tracking-tight mb-1">Chips</h3>
		<p class="text-sm text-muted-foreground">Interactive labels and filters.</p>
	</div>

	<div class="flex flex-col gap-4 flex-1 justify-center">
		<Chip.Group class="justify-center">
			{#each tags as tag}
				<Chip.Root variant="outline" active={activeTags.includes(tag)} onclick={() => toggle(tag)}>
					{#snippet icon()}
						{#if activeTags.includes(tag)}
							<Check class="size-3" />
						{:else}
							<Plus class="size-3" />
						{/if}
					{/snippet}
					{tag}
				</Chip.Root>
			{/each}
		</Chip.Group>

		<div class="flex justify-center">
			<Chip.Root variant="secondary" class="pl-1">
				{#snippet avatar()}
					<Avatar class="h-6 w-6">
						<AvatarImage src="https://github.com/kevwpl.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				{/snippet}
				@kevwpl
			</Chip.Root>
		</div>
	</div>
</div>
