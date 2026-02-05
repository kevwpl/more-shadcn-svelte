<script lang="ts">
	import * as AudioPlayer from '$lib/components/ui/audio';
	import * as DocPage from '$lib/components/feature/doc-page';

	const track = {
		title: 'SoundHelix Song 1',
		artist: 'SoundHelix',
		src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
	};
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Audio Player</DocPage.Title>
		<DocPage.Description>
			A composable, card-based audio player for music and podcasts.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="flex min-h-[300px] items-center justify-center pt-10 px-4">
				<div class="w-full max-w-sm">
					<AudioPlayer.Root src={track.src} class="relative pb-2">
						<div class="flex items-center gap-4 p-4">
							<AudioPlayer.PlayButton />

							<div class="flex flex-1 flex-col overflow-hidden">
								<span class="truncate text-sm font-semibold">{track.title}</span>
								<span class="truncate text-xs text-muted-foreground">{track.artist}</span>
							</div>

							<div class="flex items-center gap-2">
								<AudioPlayer.Time />
								<AudioPlayer.Volume />
							</div>
						</div>

						<div class="px-4 pb-2">
							<AudioPlayer.Slider class="h-1.5 rounded-full" />
						</div>
					</AudioPlayer.Root>
				</div>
			</DocPage.Preview>

			<DocPage.Code
				code={`<AudioPlayer.Root src="/music.mp3" class="pb-2">
  <div class="flex items-center gap-4 p-4">
    <AudioPlayer.PlayButton />
    <div class="flex flex-1 flex-col">
       <span class="text-sm font-semibold">Track Title</span>
       <span class="text-xs text-muted-foreground">Artist</span>
    </div>
    <AudioPlayer.Time />
    <AudioPlayer.Volume />
  </div>
  <div class="px-4 pb-2">
    <AudioPlayer.Slider />
  </div>
</AudioPlayer.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'audio-player'}
		<DocPage.Text>
			Run the following command to install the `{componentName}` components:
		</DocPage.Text>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>

		<DocPage.Heading>Compact Layout</DocPage.Heading>
		<DocPage.Text>
			You can reposition the sub-components to create different player styles.
		</DocPage.Text>

		<DocPage.Example>
			<DocPage.Preview class="flex min-h-[200px] items-center justify-center p-6">
				<div class="w-full max-w-xs">
					<AudioPlayer.Root src={track.src} class="p-2">
						<div class="flex items-center gap-3">
							<AudioPlayer.PlayButton class="h-10 w-10" />
							<div class="flex flex-1 flex-col gap-1">
								<div class="flex justify-between items-center">
									<span class="text-xs font-medium">Preview</span>
									<AudioPlayer.Time class="text-[10px]" />
								</div>
								<AudioPlayer.Slider class="h-1" />
							</div>
						</div>
					</AudioPlayer.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<AudioPlayer.Root src={src} class="p-2">
  <div class="flex items-center gap-3">
    <AudioPlayer.PlayButton class="h-10 w-10" />
    <div class="flex flex-1 flex-col gap-1">
      <AudioPlayer.Slider class="h-1" />
    </div>
  </div>
</AudioPlayer.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
