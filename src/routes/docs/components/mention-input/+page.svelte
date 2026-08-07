<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { MentionInput, type MentionItem } from '$lib/components/ui/mention-input';
	import { Label } from '$lib/components/ui/label';

	const people: MentionItem[] = [
		{ id: '1', label: 'ada', description: 'Ada Lovelace', keywords: ['math'] },
		{ id: '2', label: 'grace', description: 'Grace Hopper', keywords: ['compiler'] },
		{ id: '3', label: 'linus', description: 'Linus Torvalds', keywords: ['git', 'linux'] },
		{ id: '4', label: 'rich', description: 'Rich Harris', keywords: ['svelte'] },
		{ id: '5', label: 'evan', description: 'Evan You', keywords: ['vue', 'vite'] }
	];

	const channels: MentionItem[] = [
		{ id: 'general', label: 'general' },
		{ id: 'design', label: 'design' },
		{ id: 'releases', label: 'releases' },
		{ id: 'random', label: 'random' }
	];

	let comment = $state('Hey ');
	let channelValue = $state('');
	let lastMention = $state<MentionItem | null>(null);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Mention Input</DocPage.Title>
		<DocPage.Description>
			An input or textarea that opens a filterable list when you type a trigger character.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-md space-y-2">
					<Label>Comment</Label>
					<MentionInput
						bind:value={comment}
						items={people}
						onmention={(item) => (lastMention = item)}
					/>
					<p class="text-xs text-muted-foreground">
						{#if lastMention}
							Last mention: <code>@{lastMention.label}</code> ({lastMention.description})
						{:else}
							Type <code>@</code> to mention someone.
						{/if}
					</p>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { MentionInput, type MentionItem } from '$lib/components/ui/mention-input';

  const people: MentionItem[] = [
    { id: '1', label: 'ada', description: 'Ada Lovelace' },
    { id: '2', label: 'grace', description: 'Grace Hopper' }
  ];

  let comment = $state('');
</script>

<MentionInput bind:value={comment} items={people} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'mention-input'}
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

		<DocPage.Heading>Custom trigger</DocPage.Heading>
		<DocPage.Text>
			Any character works as a trigger. Use <code>#</code> for channels or <code>/</code> for commands.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-md space-y-2">
					<Label>Channel</Label>
					<MentionInput
						bind:value={channelValue}
						items={channels}
						trigger="#"
						rows={3}
						placeholder="Type # to link a channel..."
					/>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<MentionInput
  bind:value={value}
  items={channels}
  trigger="#"
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Single line</DocPage.Heading>
		<DocPage.Text>
			Set <code>multiline=&#123;false&#125;</code> to render an <code>&lt;input&gt;</code> instead of
			a textarea. Everything else — the caret anchored list, filtering and keyboard handling — behaves
			the same.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-md space-y-2">
					<Label>Assignee</Label>
					<MentionInput items={people} multiline={false} placeholder="Assign with @..." />
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<MentionInput
  items={people}
  multiline={false}
  placeholder="Assign with @..."
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Custom items</DocPage.Heading>
		<DocPage.Text>
			Pass an <code>itemSnippet</code> to control how each suggestion renders, and a
			<code>filter</code> function to override the default matching.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-md space-y-2">
					<Label>Reviewers</Label>
					<MentionInput items={people} rows={3} placeholder="Request a review with @...">
						{#snippet itemSnippet(item, active)}
							<span
								class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold uppercase"
							>
								{item.label.slice(0, 2)}
							</span>
							<span class="flex min-w-0 flex-col">
								<span class="truncate text-sm font-medium">{item.description}</span>
								<span
									class="truncate text-xs {active
										? 'text-accent-foreground/70'
										: 'text-muted-foreground'}"
								>
									@{item.label}
								</span>
							</span>
						{/snippet}
					</MentionInput>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<MentionInput items={people}>
  {#snippet itemSnippet(item, active)}
    <span class="avatar">{item.label.slice(0, 2)}</span>
    <span>{item.description}</span>
  {/snippet}
</MentionInput>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Keyboard</DocPage.Heading>
		<DocPage.Text>
			While the list is open: <code>↑</code> / <code>↓</code> move the selection,
			<code>Enter</code>
			or <code>Tab</code> inserts the mention and <code>Esc</code> closes the list.
		</DocPage.Text>
	</DocPage.Content>
</DocPage.Root>
