<script lang="ts">
	import * as EventCard from '$lib/components/ui/event-card';
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Button } from '$lib/components/ui/button';

	let status = $state<'idle' | 'loading' | 'completed'>('idle');

	function simulateAction() {
		status = 'loading';
		setTimeout(() => {
			status = 'completed';
		}, 2000);
	}

	function reset() {
		status = 'idle';
	}
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Event Card</DocPage.Title>
		<DocPage.Description>
			A styled card for displaying agenda items, meetings, or tasks with status indicators.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10 px-6 flex justify-center">
				<div class="w-full max-w-sm">
					<EventCard.Root eventColor="#3b82f6" label="Sync">
						<EventCard.Title>Team Standup</EventCard.Title>
						<EventCard.Time startTime="09:00 AM" endTime="09:15 AM" />
						<EventCard.Location>33 John St., Saint Pork</EventCard.Location>
					</EventCard.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<EventCard.Root eventColor="#3b82f6" label="Sync">
  <EventCard.Title>Team Standup</EventCard.Title>
  <EventCard.Time startTime="09:00 AM" endTime="09:15 AM" />
  <EventCard.Location>Google Meet</EventCard.Location>
</EventCard.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'event-card'}
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

		<!-- 2. WITH ACTIONS -->
		<DocPage.Heading>Action State</DocPage.Heading>
		<DocPage.Text
			>Use <code>variant="action"</code> to include a feedback-ready button for confirming or completing
			events.</DocPage.Text
		>
		<DocPage.Example>
			<DocPage.Preview>
				<div class="flex flex-col gap-4 items-center">
					<div class="w-full max-w-sm">
						<EventCard.Root
							eventColor="#10b981"
							variant="action"
							{status}
							onAction={simulateAction}
							actionLabel="Join"
							completedLabel="Joined"
						>
							<EventCard.Title>Interview: Senior Engineer</EventCard.Title>
							<EventCard.Time startTime="2:00 PM" endTime="3:00 PM" />
						</EventCard.Root>
					</div>
					<Button variant="outline" size="sm" onclick={reset}>Reset Demo</Button>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<EventCard.Root
  variant="action"
  status={status}
  onAction={handleAction}
  actionLabel="Join"
  completedLabel="Joined"
>
  <EventCard.Title>Interview: Senior Engineer</EventCard.Title>
  <EventCard.Time startTime="2:00 PM" />
</EventCard.Root>`}
			/>
		</DocPage.Example>

		<!-- 3. VARIATIONS -->
		<DocPage.Heading>Variations</DocPage.Heading>
		<DocPage.Text
			>Customize the appearance with dotted borders or opacity adjustments for past or pending
			items.</DocPage.Text
		>
		<DocPage.Example>
			<DocPage.Preview class="py-10 px-6 flex flex-col gap-4 items-center">
				<div class="flex flex-col gap-4 w-full items-center">
					<div class="w-full max-w-sm">
						<EventCard.Root eventColor="#f59e0b" isDotted label="Draft">
							<EventCard.Title>Review Session</EventCard.Title>
							<EventCard.Time startTime="4:30 PM" />
						</EventCard.Root>
					</div>
					<div class="w-full max-w-sm">
						<EventCard.Root eventColor="#6b7280" opacity={0.5}>
							<EventCard.Title>Past Workshop</EventCard.Title>
							<EventCard.Time startTime="8:00 AM" endTime="10:00 AM" />
						</EventCard.Root>
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<!-- Dotted Border -->
<EventCard.Root isDotted label="Draft">...</EventCard.Root>

<!-- Opacity Adjustment -->
<EventCard.Root opacity={0.5}>...</EventCard.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
