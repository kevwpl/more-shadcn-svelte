<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as BigCalendar from '$lib/components/ui/big-calendar';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import { Calendar, ChevronLeft, ChevronRight, Ban, Clock } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';

	const today = new Date();
	const d = (offset: number) => {
		const n = new Date(today);
		n.setDate(today.getDate() + offset);
		return n;
	};

	let currentDate = $state(new Date());
	let selectedDateRange = $state({
		start: d(0),
		end: d(0)
	});

	let newEvent = $state('');

	let showWeekends = $state(true);

	let events = $state([
		{
			id: '1',
			title: 'Conference',
			start: d(0),
			end: d(2),
			type: 'default' as const
		},
		{
			id: '2',
			title: 'Deadline',
			start: d(0),
			end: d(0),
			type: 'destructive' as const
		},
		{
			id: '3',
			title: 'Planning',
			start: d(4),
			end: d(4),
			type: 'warning' as const
		},
		{
			id: '4',
			title: 'Team Retreat',
			start: d(10),
			end: d(12),
			type: 'success' as const
		},
		{
			id: '5',
			title: 'Maintenance',
			start: d(15),
			end: d(15),
			type: 'secondary' as const
		}
	]);

	function addEvent() {
		if (!selectedDateRange.start || !selectedDateRange.end) return;
		const title = newEvent;
		if (!title) return;

		events = [
			...events,
			{
				id: Math.random().toString(),
				title,
				start: new Date(selectedDateRange.start),
				end: new Date(selectedDateRange.end),
				type: 'default'
			}
		];
	}

	const isDateDisabled = (date: Date) => {
		const day = date.getDay();
		return day === 0 || day === 6;
	};
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Big Calendar</DocPage.Title>
		<DocPage.Description>
			A full-sized, interactive monthly calendar supporting drag-to-select, multi-day events, and
			slot-based rendering.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="block p-0 h-[800px]">
				<div class="flex flex-col h-full w-full bg-background">
					<div
						class="flex items-center justify-between p-4 border-b bg-muted/10 shrink-0 gap-4 flex-wrap"
					>
						<div class="flex items-center gap-4">
							<div class="flex items-center gap-2">
								<Switch id="weekends" bind:checked={showWeekends} />
								<Label for="weekends" class="text-xs">Show Weekends</Label>
							</div>
							<div class="h-4 w-px bg-border"></div>
							<div class="text-xs text-muted-foreground">
								Selected:
								<span class="font-medium text-foreground">
									{selectedDateRange.start?.toLocaleDateString()} - {selectedDateRange.end?.toLocaleDateString()}
								</span>
							</div>
						</div>
						<Dialog.Root>
							<Dialog.Trigger>
								<Button size="sm">Add Event to Selection</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Add event?</Dialog.Title>
									<Dialog.Description>Whats the name of the event?</Dialog.Description>
									<Input bind:value={newEvent} />
								</Dialog.Header>
								<Dialog.Footer>
									<Button size="sm" type="submit" onclick={addEvent}>Add Event to Selection</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</div>

					<BigCalendar.Root
						class="border-0 rounded-none shadow-none flex-1"
						bind:date={currentDate}
						bind:selected={selectedDateRange}
						{showWeekends}
						weekStartsOn={1}
						{events}
					>
						<BigCalendar.Header class="flex justify-between px-6 py-4">
							{#snippet children({ next, prev, today, currentDate })}
								<div class="flex items-center gap-2">
									<div
										class="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary"
									>
										<Calendar class="size-4" />
									</div>
									<h2 class="text-xl font-bold tracking-tight">
										{currentDate.toLocaleString('default', { month: 'long' }) +
											' ' +
											currentDate.getFullYear()}
									</h2>
								</div>

								<div class="flex gap-1">
									<Button variant="outline" onclick={prev} size="icon" class="h-8 w-8"
										><ChevronLeft class="size-4" /></Button
									>
									<Button variant="outline" onclick={today} class="h-8 text-xs">Today</Button>
									<Button variant="outline" onclick={next} size="icon" class="h-8 w-8"
										><ChevronRight class="size-4" /></Button
									>
								</div>
							{/snippet}
						</BigCalendar.Header>

						<BigCalendar.Grid>
							{#snippet children(event, { isStart, isEnd, isMiddle })}
								<BigCalendar.Item
									title={event.title}
									variant={event.type}
									{isStart}
									{isEnd}
									{isMiddle}
								/>
							{/snippet}
						</BigCalendar.Grid>
					</BigCalendar.Root>
				</div>
			</DocPage.Preview>

			<DocPage.Code
				code={`<script lang="ts">
  import * as BigCalendar from '$lib/components/ui/big-calendar';
  import { Button } from '$lib/components/ui/button';
  import { Calendar, ChevronLeft, ChevronRight } from 'lucide-svelte';

  // 1. State for date navigation and selection
  let currentDate = $state(new Date());
  let selectedRange = $state({
    start: new Date(),
    end: new Date()
  });

  // 2. Sample Data
  let events = $state([
    {
       id: '1',
       title: 'Conference',
       start: new Date('2024-01-01'),
       end: new Date('2024-01-03'),
       type: 'default'
    }
  ]);

  // 3. Add Event Handler
  function addEvent() {
    if (!selectedRange.start || !selectedRange.end) return;
    const title = prompt('Event Title:');
    if (!title) return;

    events = [...events, {
       id: crypto.randomUUID(),
       title,
       start: new Date(selectedRange.start),
       end: new Date(selectedRange.end),
       type: 'default'
    }];
  }
</script>

<div class="flex flex-col h-[700px]">

  <!-- Toolbar -->
  <div class="flex justify-between items-center p-4 border-b">
     <span class="text-sm">
        Selected: {selectedRange.start?.toLocaleDateString()} - {selectedRange.end?.toLocaleDateString()}
     </span>
     <Button size="sm" onclick={addEvent}>Add Event</Button>
  </div>

  <!-- Calendar Component -->
  <BigCalendar.Root
      bind:date={currentDate}
      bind:selected={selectedRange}
      {events}
      weekStartsOn={1}
      showWeekends={true}
  >
      <!-- Custom Header -->
      <BigCalendar.Header class="flex justify-between px-6 py-4">
          {#snippet children({ next, prev, today, currentDate })}
             <div class="flex items-center gap-2">
                 <Calendar class="size-4 text-muted-foreground" />
                 <h2 class="font-bold text-xl">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                 </h2>
             </div>
             <div class="flex gap-1">
                 <Button variant="outline" size="icon" onclick={prev}><ChevronLeft /></Button>
                 <Button variant="outline" onclick={today}>Today</Button>
                 <Button variant="outline" size="icon" onclick={next}><ChevronRight /></Button>
             </div>
          {/snippet}
      </BigCalendar.Header>

      <!-- Grid & Event Items -->
      <BigCalendar.Grid>
          {#snippet children(event, { isStart, isEnd, isMiddle })}
              <!--
                 'isStart', 'isEnd', and 'isMiddle' let you render visually
                 continuous bars across multiple days
              -->
              <BigCalendar.Item
                 title={event.title}
                 variant={event.type}
                 {isStart}
                 {isEnd}
                 {isMiddle}
              />
          {/snippet}
      </BigCalendar.Grid>
  </BigCalendar.Root>
</div>`}
			/>
		</DocPage.Example>

		<DocPage.Text>
			Drag across dates to select a range. Shift+Click also extends selection. Click "Add Event" to
			create an item on the selected range.
		</DocPage.Text>

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

		<DocPage.Heading>Disabled Dates</DocPage.Heading>
		<DocPage.Text>
			Use the <code>isDateDisabled</code> prop to prevent interactions on specific days (e.g., weekends).
			Disabled days receive a distinct visual style.
		</DocPage.Text>

		<DocPage.Example>
			<DocPage.Preview class="block p-0 h-[500px]">
				<BigCalendar.Root {isDateDisabled} class="border-0 h-full w-full rounded-none">
					<BigCalendar.Header class="px-6 py-2">
						{#snippet children({ next, prev, currentDate })}
							<div class="flex items-center gap-2">
								<Ban class="h-4 w-4 text-muted-foreground" />
								<span class="font-medium text-sm">Weekends Disabled</span>
							</div>
							<div class="flex gap-1 scale-90">
								<Button variant="ghost" onclick={prev} size="icon"><ChevronLeft /></Button>
								<span class="text-sm font-mono w-24 text-center py-2">
									{currentDate.toLocaleDateString(undefined, { month: 'short' })}
								</span>
								<Button variant="ghost" onclick={next} size="icon"><ChevronRight /></Button>
							</div>
						{/snippet}
					</BigCalendar.Header>
					<BigCalendar.Grid>
						{#snippet children(event)}
							<div class="text-[10px] p-1 bg-muted rounded">{event.title}</div>
						{/snippet}
					</BigCalendar.Grid>
				</BigCalendar.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script>
  const isDateDisabled = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0=Sun, 6=Sat
  };
</script>

<BigCalendar.Root {isDateDisabled} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Custom Event Items</DocPage.Heading>
		<DocPage.Text>
			You can render anything inside the item slot. Here is an example with times and icons.
		</DocPage.Text>

		<DocPage.Example>
			<DocPage.Preview class="block p-0 h-[450px]">
				<BigCalendar.Root
					events={[
						{ id: '1', title: 'Deep Work', start: d(0), end: d(0), time: '10:00 AM' },
						{ id: '2', title: 'Sync', start: d(2), end: d(2), time: '2:00 PM' }
					]}
					class="border-0 h-full w-full rounded-none"
				>
					<BigCalendar.Header class="hidden" />
					<BigCalendar.Grid>
						{#snippet children(event)}
							<div
								class="flex items-center gap-1.5 text-[10px] p-1.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
							>
								<Clock class="h-3 w-3 opacity-70" />
								<span class="font-bold">{event.time}</span>
								<span class="opacity-80 truncate">{event.title}</span>
							</div>
						{/snippet}
					</BigCalendar.Grid>
				</BigCalendar.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<BigCalendar.Grid>
  {#snippet children(event)}
    <div class="custom-card">
      <ClockIcon />
      <span>{event.time}</span>
      <span>{event.title}</span>
    </div>
  {/snippet}
</BigCalendar.Grid>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
