<script lang="ts">
	import * as EventCard from '$lib/components/ui/event-card';

	let status = $state<'idle' | 'loading' | 'completed'>('idle');

	function handleAction() {
		status = 'loading';
		setTimeout(() => {
			status = 'completed';
		}, 1500);
	}
</script>

<div class="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between h-full">
	<div class="mb-4">
		<h3 class="font-semibold leading-none tracking-tight mb-1">Event Card</h3>
		<p class="text-sm text-muted-foreground">Agenda items with status feedback.</p>
	</div>

	<div class="flex flex-col gap-3 flex-1 justify-center">
		<EventCard.Root eventColor="#3b82f6" label="Sync">
			<EventCard.Title>Team Standup</EventCard.Title>
			<EventCard.Time startTime="09:00 AM" endTime="09:15 AM" />
			<EventCard.Location>Google Meet</EventCard.Location>
		</EventCard.Root>

		<EventCard.Root
			eventColor="#10b981"
			variant="action"
			{status}
			onAction={handleAction}
			actionLabel="Join"
			completedLabel="Joined"
		>
			<EventCard.Title>Dev Interview</EventCard.Title>
			<EventCard.Time startTime="2:00 PM" endTime="3:00 PM" />
		</EventCard.Root>
	</div>
</div>
