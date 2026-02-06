<script lang="ts">
	import { AudioWave } from '$lib/components/ui/audio-wave';
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Button } from '$lib/components/ui/button';
	import { Pause, Play } from 'lucide-svelte';

	let isPlaying = $state(true);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Audio Wave</DocPage.Title>
		<DocPage.Description>
			A lightweight, CSS-animated audio visualization component.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10 flex flex-col items-center gap-4">
				<div class="flex items-center gap-4 p-4 border rounded-xl bg-card">
					<Button
						variant="outline"
						size="icon"
						class="rounded-full h-10 w-10"
						onclick={() => (isPlaying = !isPlaying)}
					>
						{#if isPlaying}
							<Pause class="h-4 w-4 fill-current" />
						{:else}
							<Play class="h-4 w-4 fill-current ml-0.5" />
						{/if}
					</Button>

					<div class="flex flex-col gap-1 mr-2">
						<span class="text-sm font-semibold">Now Playing</span>
						<div class="flex items-center gap-2">
							<span class="text-xs text-muted-foreground">My Playlist</span>
						</div>
					</div>

					<AudioWave playing={isPlaying} class="h-6 text-emerald-500 gap-0.5" />
				</div>
			</DocPage.Preview>
			<DocPage.Code code={`<AudioWave playing={isPlaying} />`} />
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'audio-wave'}
		<DocPage.Text
			>Run the following command to install the `{componentName}` component:</DocPage.Text
		>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>

		<DocPage.Heading>Variants</DocPage.Heading>
		<DocPage.Text>
			You can customize the number of bars, color, and size using standard utility classes.
		</DocPage.Text>

		<DocPage.Example>
			<DocPage.Preview class="flex flex-col gap-10 items-center py-10">
				<div class="flex items-center gap-4">
					<span class="text-sm text-muted-foreground w-24 text-right">Small Green</span>
					<AudioWave playing={true} bars={6} class="h-6" barColor="bg-emerald-500" />
				</div>

				<div class="flex items-center gap-4">
					<span class="text-sm text-muted-foreground w-24 text-right">Large & Thin</span>
					<AudioWave playing={true} bars={12} class="h-16 gap-0.5" barColor="bg-rose-500 w-0.5" />
				</div>

				<div class="flex items-center gap-4">
					<span class="text-sm text-muted-foreground w-24 text-right">Muted</span>
					<AudioWave playing={true} bars={4} class="h-8" barColor="bg-muted-foreground/50" />
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<!-- Small Green -->
<AudioWave bars={6} class="h-6" barColor="bg-emerald-500" />

<!-- Large & Thin -->
<AudioWave bars={12} class="h-16 gap-0.5" barColor="bg-rose-500 w-0.5" />

<!-- Muted -->
<AudioWave bars={4} class="h-8" barColor="bg-muted-foreground/50" />`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
