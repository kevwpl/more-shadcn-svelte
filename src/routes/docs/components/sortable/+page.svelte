<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as Sortable from '$lib/components/ui/sortable';
	import { Image } from 'lucide-svelte';

	let listItems = $state([
		{ id: '1', title: 'Authentication', desc: 'Setup auth providers' },
		{ id: '2', title: 'Database', desc: 'Configure database schema' },
		{ id: '3', title: 'Storage', desc: 'Setup file storage buckets' },
		{ id: '4', title: 'Deployment', desc: 'Configure Vercel deployment' }
	]);

	let gridItems = $state([
		{ id: 'A', color: 'bg-red-500' },
		{ id: 'B', color: 'bg-orange-500' },
		{ id: 'C', color: 'bg-amber-500' },
		{ id: 'D', color: 'bg-green-500' },
		{ id: 'E', color: 'bg-emerald-500' },
		{ id: 'F', color: 'bg-teal-500' },
		{ id: 'G', color: 'bg-cyan-500' },
		{ id: 'H', color: 'bg-sky-500' },
		{ id: 'I', color: 'bg-blue-500' }
	]);

	let navItems = $state([
		{ id: 'home', label: 'Home' },
		{ id: 'about', label: 'About' },
		{ id: 'work', label: 'Work' },
		{ id: 'contact', label: 'Contact' }
	]);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Sortable</DocPage.Title>
		<DocPage.Description>
			A lightweight, FLIP-animated sortable list. Supports vertical, horizontal, and grid layouts.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-md">
					<Sortable.Root bind:items={listItems}>
						{#each listItems as item (item.id)}
							<Sortable.Item id={item.id}>
								<div
									class="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm select-none"
								>
									<Sortable.Handle />
									<div class="flex flex-col gap-1">
										<span class="font-medium leading-none">{item.title}</span>
										<span class="text-xs text-muted-foreground">{item.desc}</span>
									</div>
								</div>
							</Sortable.Item>
						{/each}
					</Sortable.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Sortable.Root bind:items={items} orientation="vertical">
  {#each items as item (item.id)}
    <Sortable.Item id={item.id}>
       <div class="border rounded-lg p-4 flex gap-4">
          <Sortable.Handle />
          {item.title}
       </div>
    </Sortable.Item>
  {/each}
</Sortable.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'sortable'}
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

		<DocPage.Heading>Grid Layout</DocPage.Heading>
		<DocPage.Text>
			Use <code>class="grid grid-cols-..."</code> on the Root component. The component automatically
			calculates 2D displacement (X and Y axis).
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-md">
					<Sortable.Root bind:items={gridItems} class="grid grid-cols-3 gap-4" orientation="mixed">
						{#each gridItems as item (item.id)}
							<Sortable.Item id={item.id} class="h-24 w-full">
								<div
									class="h-full w-full rounded-lg border bg-card p-2 shadow-sm flex flex-col justify-between select-none"
								>
									<Sortable.Handle class="self-end cursor-move opacity-50 hover:opacity-100 p-1">
										<Image class="h-4 w-4" />
									</Sortable.Handle>
									<div class="{item.color} h-2 w-full rounded-full opacity-50" />
								</div>
							</Sortable.Item>
						{/each}
					</Sortable.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Sortable.Root
  bind:items={items}
  class="grid grid-cols-3 gap-4"
  orientation="mixed"
>
  {#each items as item (item.id)}
     <Sortable.Item id={item.id} class="h-24 w-full">
         <div class="card...">...</div>
     </Sortable.Item>
  {/each}
</Sortable.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Horizontal List</DocPage.Heading>
		<DocPage.Text>
			Perfect for sorting tabs, tags, or Kanban columns. Set <code>orientation="horizontal"</code>
			(or use <code>flex-row</code> class).
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<Sortable.Root
					bind:items={navItems}
					class="flex flex-row items-center gap-2 p-2 bg-muted rounded-xl"
					orientation="horizontal"
				>
					{#each navItems as item (item.id)}
						<Sortable.Item id={item.id}>
							<div
								class="bg-background border shadow-sm px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 select-none"
							>
								<Sortable.Handle class="opacity-30 hover:opacity-100" />
								{item.label}
							</div>
						</Sortable.Item>
					{/each}
				</Sortable.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Sortable.Root
    bind:items={items}
    class="flex flex-row items-center"
    orientation="horizontal"
>
  {#each items as item (item.id)}
     <Sortable.Item id={item.id} class="h-24 w-full"> ... </Sortable.Item>
  {/each}
</Sortable.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
