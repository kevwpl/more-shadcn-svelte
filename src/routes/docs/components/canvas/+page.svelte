<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as Canvas from '$lib/components/ui/canvas';
	import { StickyNote } from '$lib/components/ui/sticky-note';
	import { Badge } from '$lib/components/ui/badge';

	let zoom = $state(1);

	const flow = $state([
		{ id: 'source', x: 40, y: 60, title: 'Source', body: 'orders.csv', tone: 'Input' },
		{ id: 'clean', x: 300, y: 40, title: 'Clean', body: 'drop nulls', tone: 'Transform' },
		{ id: 'enrich', x: 300, y: 180, title: 'Enrich', body: 'join customers', tone: 'Transform' },
		{ id: 'sink', x: 560, y: 110, title: 'Warehouse', body: 'upsert', tone: 'Output' }
	]);

	const edges = [
		{ from: 'source', to: 'clean' },
		{ from: 'source', to: 'enrich' },
		{ from: 'clean', to: 'sink' },
		{ from: 'enrich', to: 'sink' }
	];

	const notes = $state([
		{ id: 'n1', x: 60, y: 40, text: 'Ship the empty state first', color: 'yellow' as const },
		{ id: 'n2', x: 280, y: 90, text: 'Ask design about the icon', color: 'pink' as const },
		{ id: 'n3', x: 130, y: 230, text: 'Needs a loading skeleton', color: 'blue' as const }
	]);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Canvas</DocPage.Title>
		<DocPage.Description>
			An infinite pannable, zoomable field with draggable nodes and connectors.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="h-auto p-0">
				<Canvas.Root bind:zoom snap={10} class="h-[420px] rounded-t-md">
					{#each edges as edge (edge.from + edge.to)}
						<Canvas.Edge fromNode={edge.from} toNode={edge.to} />
					{/each}

					{#each flow as node (node.id)}
						<Canvas.Node id={node.id} bind:x={node.x} bind:y={node.y}>
							<div class="w-44 rounded-lg border bg-card p-3 shadow-sm">
								<div class="flex items-center justify-between gap-2">
									<span class="text-sm font-medium">{node.title}</span>
									<Badge variant="secondary" class="text-[10px]">{node.tone}</Badge>
								</div>
								<p class="mt-1 font-mono text-xs text-muted-foreground">{node.body}</p>
							</div>
						</Canvas.Node>
					{/each}

					<Canvas.Controls />
					<Canvas.Minimap />
				</Canvas.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import * as Canvas from '$lib/components/ui/canvas';

  const nodes = $state([
    { id: 'source', x: 40, y: 60 },
    { id: 'sink', x: 320, y: 60 }
  ]);
</script>

<Canvas.Root class="h-[420px]">
  <Canvas.Edge fromNode="source" toNode="sink" />

  {#each nodes as node (node.id)}
    <Canvas.Node id={node.id} bind:x={node.x} bind:y={node.y}>
      <div class="rounded-lg border bg-card p-3">{node.id}</div>
    </Canvas.Node>
  {/each}

  <Canvas.Controls />
  <Canvas.Minimap />
</Canvas.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'canvas'}
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

		<DocPage.Heading>Navigating</DocPage.Heading>
		<DocPage.Text>
			Drag the background to pan, scroll to zoom around the cursor, or hold
			<code>Space</code> to pan from anywhere — including over a node. The middle mouse button pans
			too.
			<code>x</code>, <code>y</code> and <code>zoom</code> are all bindable if you want to drive or persist
			the view.
		</DocPage.Text>
		<DocPage.Text>
			Zooming is exponential rather than linear, so a trackpad and a mouse wheel feel the same at
			every scale, and the point under the cursor stays under the cursor.
		</DocPage.Text>
		<DocPage.Code code={`<Canvas.Root bind:x bind:y bind:zoom minZoom={0.2} maxZoom={3} />`} />

		<DocPage.Heading>Grid and snapping</DocPage.Heading>
		<DocPage.Text>
			The grid is painted as a background gradient that pans and scales with the view, so an
			infinite field costs no DOM. Choose <code>dots</code>, <code>lines</code> or
			<code>none</code>. Set <code>snap</code> to round node positions to a step while dragging.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto p-0">
				<Canvas.Root grid="lines" gridSize={32} snap={32} zoom={1} class="h-[300px] rounded-t-md">
					<Canvas.Node x={64} y={64}>
						<div class="rounded-md border bg-card px-4 py-3 text-sm shadow-sm">
							Snaps to a 32px grid
						</div>
					</Canvas.Node>
					<Canvas.Node x={224} y={160}>
						<div class="rounded-md border bg-card px-4 py-3 text-sm shadow-sm">Drag me</div>
					</Canvas.Node>
					<Canvas.Controls position="bottom-right" showFit={false} />
				</Canvas.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Canvas.Root grid="lines" gridSize={32} snap={32}>
  <Canvas.Node x={64} y={64}>…</Canvas.Node>
</Canvas.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Edges</DocPage.Heading>
		<DocPage.Text>
			Connect two registered nodes with <code>fromNode</code> and <code>toNode</code> — the edge
			anchors to the right side of the source and the left side of the target, and follows them as
			they move. Pass explicit <code>from</code>/<code>to</code> points instead for free floating
			connectors. Three shapes are available: <code>bezier</code>, <code>smoothstep</code> and
			<code>straight</code>.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto p-0">
				<Canvas.Root grid="none" class="h-[300px] rounded-t-md">
					<Canvas.Edge from={{ x: 40, y: 50 }} to={{ x: 300, y: 50 }} type="bezier">
						{#snippet label()}bezier{/snippet}
					</Canvas.Edge>
					<Canvas.Edge from={{ x: 40, y: 130 }} to={{ x: 300, y: 130 }} type="smoothstep" animated>
						{#snippet label()}smoothstep{/snippet}
					</Canvas.Edge>
					<Canvas.Edge
						from={{ x: 40, y: 210 }}
						to={{ x: 300, y: 210 }}
						type="straight"
						arrow={false}
					>
						{#snippet label()}straight{/snippet}
					</Canvas.Edge>
				</Canvas.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Canvas.Edge fromNode="a" toNode="b" type="smoothstep" animated />

<Canvas.Edge from={{ x: 40, y: 50 }} to={{ x: 300, y: 50 }}>
  {#snippet label()}retry{/snippet}
</Canvas.Edge>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Controls and minimap</DocPage.Heading>
		<DocPage.Text>
			Every node registers its box with the canvas, which is what lets <code>fitView()</code> frame the
			whole graph and the minimap draw real geometry. The minimap always includes the current viewport
			in its bounds, so you never lose track of where you are — click it to jump.
		</DocPage.Text>
		<DocPage.Text>
			Both are optional and can sit in any corner. The context is exported too, if you want to build
			your own.
		</DocPage.Text>
		<DocPage.Code
			code={`<script lang="ts">
  import { getCanvasContext } from '$lib/components/ui/canvas';

  const canvas = getCanvasContext();
</script>

<button onclick={() => canvas.fitView()}>Fit</button>
<button onclick={() => canvas.zoomBy(1.25)}>Zoom in</button>
<span>{Math.round(canvas.zoom * 100)}%</span>`}
		/>

		<DocPage.Heading>Anything can be a node</DocPage.Heading>
		<DocPage.Text>
			<code>Canvas.Node</code> only handles position, dragging and selection — what goes inside is
			up to you. Here it is holding
			<a href="/docs/components/sticky-note" class="underline underline-offset-4">sticky notes</a>.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto p-0">
				<Canvas.Root snap={8} class="h-[360px] rounded-t-md bg-muted/30">
					{#each notes as note (note.id)}
						<Canvas.Node bind:x={note.x} bind:y={note.y}>
							<StickyNote bind:text={note.text} bind:color={note.color} size="sm" rotate={-2} />
						</Canvas.Node>
					{/each}
					<Canvas.Controls />
				</Canvas.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Canvas.Node bind:x={note.x} bind:y={note.y}>
  <StickyNote bind:text={note.text} bind:color={note.color} />
</Canvas.Node>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Nodes</DocPage.Heading>
		<DocPage.Text>
			Node positions live in canvas space, so screen deltas are divided by the zoom while dragging —
			a node stays under the cursor at any scale. Arrow keys nudge a focused node by the snap step,
			or 10 units with <code>Shift</code>. Set <code>draggable=&#123;false&#125;</code> for fixed
			furniture, and <code>selected</code> is bindable.
		</DocPage.Text>
		<DocPage.Code
			code={`<Canvas.Node
  id="source"
  bind:x={node.x}
  bind:y={node.y}
  bind:selected={node.selected}
  ondragend={(pos) => save(node.id, pos)}
>
  …
</Canvas.Node>`}
		/>
	</DocPage.Content>
</DocPage.Root>
