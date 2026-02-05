<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as Scrubbable from '$lib/components/ui/scrubbable';
	import { Label } from '$lib/components/ui/label';

	let volume = $state(50);
	let scale = $state(1);
	let brightness = $state(100);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Scrubbable Input</DocPage.Title>
		<DocPage.Description>
			A drag-to-adjust numeric input with constraints and styling variants.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Heading>Variants</DocPage.Heading>
		<DocPage.Text>Matches standard button styles.</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview>
				<div class="grid grid-cols-3 gap-4">
					<div class="flex flex-col items-center gap-4 justify-between">
						<Label>Default</Label>
						<Scrubbable.Root bind:value={volume} min={0} max={100} defaultValue={50} class="w-32">
							<Scrubbable.Label>Vol</Scrubbable.Label>
							<Scrubbable.Value format={(v) => v + '%'} />
						</Scrubbable.Root>
					</div>

					<div class="flex flex-col items-center gap-4 justify-between">
						<Label>Outline</Label>
						<Scrubbable.Root
							bind:value={scale}
							variant="outline"
							step={0.1}
							min={0.5}
							max={3}
							defaultValue={1}
							class="w-32"
						>
							<Scrubbable.Label>Scale</Scrubbable.Label>
							<Scrubbable.Value format={(v) => v.toFixed(1) + 'x'} />
						</Scrubbable.Root>
					</div>

					<div class="flex flex-col items-center gap-4 justify-between">
						<Label>Primary</Label>
						<Scrubbable.Root
							bind:value={brightness}
							variant="primary"
							min={0}
							max={200}
							class="w-32"
						>
							<Scrubbable.Value />
						</Scrubbable.Root>
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code code={`<Scrubbable.Root variant="outline" bind:value={val} />`} />
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'scrubbable'}
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

		<DocPage.Heading>Constraints & Reset</DocPage.Heading>
		<DocPage.Text>
			Double-click to reset to <code>defaultValue</code>. Dragging is clamped between
			<code>min</code>
			and <code>max</code>.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="flex items-center justify-center py-10">
				<Scrubbable.Root
					bind:value={volume}
					min={0}
					max={100}
					defaultValue={50}
					step={5}
					class="w-40"
					variant="secondary"
				>
					<Scrubbable.Label>Volume</Scrubbable.Label>
					<Scrubbable.Value />
				</Scrubbable.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Scrubbable.Root
  min={0}
  max={100}
  defaultValue={50}
  step={5}
  variant="secondary"
>
  <Scrubbable.Label>Volume</Scrubbable.Label>
  <Scrubbable.Value />
</Scrubbable.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
