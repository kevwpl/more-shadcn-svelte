<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { StickyNote, STICKY_NOTE_COLORS } from '$lib/components/ui/sticky-note';
	import * as Canvas from '$lib/components/ui/canvas';

	let text = $state('Double click to edit me');
	let color = $state<(typeof STICKY_NOTE_COLORS)[number]>('yellow');

	let board = $state([
		{ id: 'a', x: 40, y: 40, text: 'Cut the onboarding to three steps', color: 'yellow' as const },
		{ id: 'b', x: 230, y: 90, text: 'Empty states need copy', color: 'green' as const },
		{ id: 'c', x: 90, y: 200, text: 'Who owns the migration?', color: 'pink' as const }
	]);

	function remove(id: string) {
		board = board.filter((n) => n.id !== id);
	}
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Sticky Note</DocPage.Title>
		<DocPage.Description>An editable coloured note for boards and canvases.</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-16">
				<StickyNote bind:text bind:color rotate={-3} author="You" />
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { StickyNote } from '$lib/components/ui/sticky-note';

  let text = $state('Double click to edit me');
</script>

<StickyNote bind:text author="You" />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'sticky-note'}
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

		<DocPage.Heading>Editing</DocPage.Heading>
		<DocPage.Text>
			Double click the note — or focus it and press <code>Enter</code> — to edit, and blur or press
			<code>Escape</code>
			to commit. Double click rather than single click is deliberate: it leaves single click free for
			dragging when the note sits on a canvas. Pass <code>editable=&#123;false&#125;</code> for a read
			only note.
		</DocPage.Text>

		<DocPage.Heading>Colours and sizes</DocPage.Heading>
		<DocPage.Text>
			Six colours and three sizes. The palette appears on hover or focus and writes straight to the
			bindable <code>color</code> prop; hide it with <code>showPalette=&#123;false&#125;</code>.
			<code>rotate</code> adds a tilt.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-16">
				<div class="flex flex-wrap items-start justify-center gap-6">
					{#each STICKY_NOTE_COLORS as swatch, i}
						<StickyNote
							color={swatch}
							size="sm"
							showPalette={false}
							editable={false}
							text={swatch}
							rotate={i % 2 ? 2 : -2}
						/>
					{/each}
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<StickyNote color="pink" size="lg" rotate={-2} />
<StickyNote color="blue" showPalette={false} editable={false} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>On a canvas</DocPage.Heading>
		<DocPage.Text>
			The note has no dragging of its own, which is what lets it drop cleanly into a
			<a href="/docs/components/canvas" class="underline underline-offset-4">Canvas.Node</a> — that handles
			position while the note handles content.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto p-0">
				<Canvas.Root snap={8} class="h-[360px] rounded-t-md bg-muted/30">
					{#each board as note (note.id)}
						<Canvas.Node bind:x={note.x} bind:y={note.y}>
							<StickyNote
								bind:text={note.text}
								bind:color={note.color}
								size="sm"
								removable
								onremove={() => remove(note.id)}
							/>
						</Canvas.Node>
					{/each}
					<Canvas.Controls />
				</Canvas.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Canvas.Root snap={8}>
  {#each board as note (note.id)}
    <Canvas.Node bind:x={note.x} bind:y={note.y}>
      <StickyNote
        bind:text={note.text}
        bind:color={note.color}
        removable
        onremove={() => remove(note.id)}
      />
    </Canvas.Node>
  {/each}
</Canvas.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Custom content</DocPage.Heading>
		<DocPage.Text>
			Pass children to replace the text body entirely — the colour, tilt and palette still apply.
		</DocPage.Text>
		<DocPage.Code
			code={`<StickyNote color="blue">
  <h4 class="font-semibold">Release checklist</h4>
  <ul class="mt-1 list-disc pl-4 text-xs">
    <li>Bump the version</li>
    <li>Tag the release</li>
  </ul>
</StickyNote>`}
		/>
	</DocPage.Content>
</DocPage.Root>
