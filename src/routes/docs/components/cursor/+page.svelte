<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as Cursor from '$lib/components/ui/cursor';
	import * as PlusGrid from '$lib/components/feature/plus-grid';
	import { onMount } from 'svelte';

	// Simulation State
	let x = $state(100);
	let y = $state(100);

	// Simulate "other user" movement
	onMount(() => {
		const interval = setInterval(() => {
			x = 100 + Math.sin(Date.now() / 1500) * 120;
			y = 100 + Math.cos(Date.now() / 1500) * 60;
		}, 16);
		return () => clearInterval(interval);
	});
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Collaborative Cursor</DocPage.Title>
		<DocPage.Description>
			A cursor component for multiplayer/collaborative interfaces.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<PlusGrid.Root color="rgba(127, 127, 127, 0.21)" spacing={30}>
				<DocPage.Preview class="relative h-[350px] w-full overflow-hidden py-10 bg-muted/30">
					<!-- Static Example -->
					<Cursor.Root x={280} y={80} color="#ea580c" name="@Kevin" />

					<!-- Animated Example -->
					<Cursor.Root
						x={x + 180}
						y={y + 80}
						color="#0ea5e9"
						name="Guest User"
						message="I'm moving around!"
					/>
				</DocPage.Preview>
			</PlusGrid.Root>
			<DocPage.Code
				code={`<Cursor.Root
  x={280}
  y={80}
  color="#ea580c"
  name="@Kevin"
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'cursor'}
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

		<DocPage.Heading>Only Cursor</DocPage.Heading>
		<DocPage.Text>
			If you don't pass the `name`, `message` and `children` props, only the cursor will be visible.
		</DocPage.Text>
		<DocPage.Example>
			<PlusGrid.Root color="rgba(127, 127, 127, 0.21)" spacing={30}>
				<DocPage.Preview class="relative h-[200px] w-full bg-muted/30">
					<Cursor.Root x={350} y={95} color="#ef00ef" />
				</DocPage.Preview>
			</PlusGrid.Root>
			<DocPage.Code code={`<Cursor.Root x={350} y={95} color="#ef00ef" />`} />
		</DocPage.Example>

		<DocPage.Heading>Custom Content</DocPage.Heading>
		<DocPage.Text>
			You can pass snippets to the `children` prop for custom layouts (like reactions).
		</DocPage.Text>
		<DocPage.Example>
			<PlusGrid.Root color="rgba(127, 127, 127, 0.21)" spacing={30}>
				<DocPage.Preview class="relative h-[200px] w-full bg-muted/30">
					<Cursor.Root x={150} y={80} color="#ef4444" name="Designer">
						<div class="mt-1 flex gap-1">
							<span class="rounded bg-white/20 px-1 text-[10px]">👍</span>
							<span class="rounded bg-white/20 px-1 text-[10px]">🔥</span>
						</div>
					</Cursor.Root>
				</DocPage.Preview>
			</PlusGrid.Root>
			<DocPage.Code
				code={`<Cursor.Root x={150} y={80} color="#ef4444" name="Designer">
  <div class="mt-1 flex gap-1">
    <span class="bg-white/20 rounded px-1 text-[10px]">👍</span>
    <span class="bg-white/20 rounded px-1 text-[10px]">🔥</span>
  </div>
</Cursor.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
