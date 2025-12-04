<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as BigCalendar from '$lib/components/ui/big-calendar';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus } from 'lucide-svelte';

	let currentDate = $state(new Date());
	let selectedDate = $state(new Date());
	let newEventTitle = $state('');

	const today = new Date();
	const d = (offset: number) => {
		const n = new Date(today);
		n.setDate(today.getDate() + offset);
		return n;
	};

	let events = $state([
		{ id: '1', title: 'All Hands Meeting', date: d(0), type: 'default' },
		{ id: '2', title: 'Project Deadline', date: d(0), type: 'destructive' },
		{ id: '3', title: 'Lunch with Client', date: d(1), type: 'warning' },
		{ id: '4', title: 'Code Review', date: d(1), type: 'default' },
		{ id: '5', title: 'Deploy to Prod', date: d(3), type: 'success' },
		{ id: '6', title: 'Design Sync', date: d(3), type: 'secondary' },
		{ id: '7', title: 'Marketing Sync', date: d(5), type: 'default' },
		{ id: '8', title: 'Quarterly Planning', date: d(8), type: 'default' },
		{ id: '9', title: 'Server Maintenance', date: d(10), type: 'destructive' },
		{ id: '10', title: 'Team Building', date: d(15), type: 'success' },
		{ id: '11', title: 'Performance Review', date: d(15), type: 'warning' },
		{ id: '12', title: 'User Testing', date: d(18), type: 'secondary' },
		{ id: '13', title: 'Budget Approval', date: d(22), type: 'destructive' }
	]);

	function addEvent() {
		if (!newEventTitle) return;
		events = [
			...events,
			{
				id: Math.random().toString(),
				title: newEventTitle,
				date: new Date(selectedDate),
				type: 'default'
			}
		];
		newEventTitle = '';
	}
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Big Calendar</DocPage.Title>
		<DocPage.Description>
			A full-sized, responsive month view with event slotting and interactions.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="block p-0 border-0 h-auto">
				<div
					class="flex flex-col xl:flex-row h-[900px] w-full border rounded-xl overflow-hidden bg-background"
				>
					<BigCalendar.Root
						bind:date={currentDate}
						bind:selected={selectedDate}
						{events}
						class="flex-1 border-0 shadow-none rounded-none"
					>
						<BigCalendar.Header class="px-8 py-4 border-b" />
						<BigCalendar.Grid class="bg-background">
							{#snippet children(event)}
								<BigCalendar.Item
									title={event.title}
									variant={event.type}
									onclick={(e) => {
										e.stopPropagation();
										alert(`Clicked: ${event.title}`);
									}}
								/>
							{/snippet}
						</BigCalendar.Grid>
					</BigCalendar.Root>
				</div>
			</DocPage.Preview>

			<DocPage.Code
				code={`<BigCalendar.Root bind:date={currentDate} {events}>
  <BigCalendar.Header />
  <BigCalendar.Grid>
    {#snippet children(event)}
      <BigCalendar.Item
         title={event.title}
         variant={event.type}
      />
    {/snippet}
  </BigCalendar.Grid>
</BigCalendar.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'big-calendar'}
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
	</DocPage.Content>
</DocPage.Root>
