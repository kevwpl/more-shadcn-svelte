<script lang="ts">
	import * as DocPage from '#lib/components/feature/doc-page/index.js';
	import {
		RelativeTime,
		SECOND,
		MINUTE,
		HOUR,
		DAY
	} from '#lib/components/ui/relative-time/index.js';
	import { Button } from '#lib/components/ui/button/index.js';

	const now = Date.now();

	const samples = [
		{ label: 'Just now', date: now - 3 * SECOND },
		{ label: 'Seconds', date: now - 42 * SECOND },
		{ label: 'Minutes', date: now - 7 * MINUTE },
		{ label: 'Hours', date: now - 3 * HOUR },
		{ label: 'Yesterday', date: now - 26 * HOUR },
		{ label: 'Weeks', date: now - 17 * DAY },
		{ label: 'Future', date: now + 2 * DAY }
	];

	let events = $state<{ id: number; at: number }[]>([{ id: 0, at: now - 75 * SECOND }]);

	function addEvent() {
		events = [{ id: events.length, at: Date.now() }, ...events].slice(0, 5);
	}

	const locales = ['en', 'de', 'fr', 'ja', 'ar'];
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Relative Time</DocPage.Title>
		<DocPage.Description>
			A timestamp that reads "3 minutes ago" and keeps itself up to date.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-sm divide-y rounded-lg border text-sm">
					{#each samples as sample}
						<div class="flex items-center justify-between px-4 py-2.5">
							<span class="text-muted-foreground">{sample.label}</span>
							<RelativeTime date={sample.date} class="font-medium" />
						</div>
					{/each}
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { RelativeTime } from '#lib/components/ui/relative-time/index.js';
</script>

<RelativeTime date={comment.createdAt} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'relative-time'}
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

		<DocPage.Heading>Staying current</DocPage.Heading>
		<DocPage.Text>
			Every instance on the page shares one timer, and that timer only runs as often as the freshest
			timestamp needs: every second for "12 seconds ago", every ten seconds for minutes, and every
			few minutes once everything is days old. A feed of two hundred timestamps still costs one
			interval — and none at all when nothing is live. Background tabs catch up the moment they
			become visible.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-sm space-y-3">
					<Button size="sm" onclick={addEvent}>Add an event</Button>
					<div class="divide-y rounded-lg border text-sm">
						{#each events as event (event.id)}
							<div class="flex items-center justify-between px-4 py-2.5">
								<span>Event #{event.id + 1}</span>
								<RelativeTime date={event.at} class="text-muted-foreground" />
							</div>
						{/each}
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<RelativeTime date={event.at} />          <!-- live, the default -->
<RelativeTime date={event.at} live={false} /> <!-- renders once -->`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Formatting</DocPage.Heading>
		<DocPage.Text>
			Text comes from <code>Intl.RelativeTimeFormat</code>, so it is localised for free. The
			<code>style</code> prop picks between long, short and narrow, and <code>numeric="auto"</code>
			(the default) prefers words like "yesterday" and "now" over "1 day ago". Hover any timestamp for
			the exact date and time.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-md overflow-hidden rounded-lg border text-sm">
					<div class="grid grid-cols-4 border-b bg-muted/40 px-4 py-2 text-xs font-medium">
						<span>locale</span>
						<span>long</span>
						<span>short</span>
						<span>numeric always</span>
					</div>
					{#each locales as locale}
						<div class="grid grid-cols-4 px-4 py-2">
							<span class="font-mono text-xs text-muted-foreground">{locale}</span>
							<RelativeTime date={now - 26 * HOUR} {locale} />
							<RelativeTime date={now - 26 * HOUR} {locale} style="short" />
							<RelativeTime date={now - 26 * HOUR} {locale} numeric="always" />
						</div>
					{/each}
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<RelativeTime date={date} locale="de" />
<RelativeTime date={date} style="short" />
<RelativeTime date={date} numeric="always" />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Switching to a date</DocPage.Heading>
		<DocPage.Text>
			Past a certain age, a plain date reads better than "7 months ago". Set
			<code>absoluteAfter</code> in milliseconds and older timestamps show the date instead — month and
			day, plus the year when it is not the current one.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-sm divide-y rounded-lg border text-sm">
					{#each [2 * HOUR, 3 * DAY, 45 * DAY, 400 * DAY] as age}
						<div class="flex items-center justify-between px-4 py-2.5">
							<span class="text-muted-foreground"
								>{Math.round(age / DAY) || 'under 1'} days old</span
							>
							<RelativeTime date={now - age} absoluteAfter={7 * DAY} />
						</div>
					{/each}
				</div>
			</DocPage.Preview>
			<DocPage.Code code={`<RelativeTime date={date} absoluteAfter={7 * DAY} />`} />
		</DocPage.Example>

		<DocPage.Heading>Outside the markup</DocPage.Heading>
		<DocPage.Text>
			<code>formatRelative</code> is the same logic as a plain function, for titles, notifications or
			anywhere a component does not fit.
		</DocPage.Text>
		<DocPage.Code
			code={`import { formatRelative } from '#lib/components/ui/relative-time/index.js';

formatRelative(post.createdAt);                  // "3 hours ago"
formatRelative(deadline, { locale: 'de' });      // "in 2 Tagen"`}
		/>
	</DocPage.Content>
</DocPage.Root>
