<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { EmojiPicker } from '$lib/components/ui/emoji-picker';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Smile } from '@lucide/svelte';

	let picked = $state('👋');
	let message = $state('Ship it ');
	let popoverOpen = $state(false);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Emoji Picker</DocPage.Title>
		<DocPage.Description>
			A self-contained emoji picker with categories, search, skin tones and recents.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-10">
				<div class="flex flex-col items-center gap-4">
					<EmojiPicker onSelect={(emoji) => (picked = emoji)} />
					<p class="text-sm text-muted-foreground">
						Selected: <span class="text-lg">{picked}</span>
					</p>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { EmojiPicker } from '$lib/components/ui/emoji-picker';

  let picked = $state('👋');
</script>

<EmojiPicker onSelect={(emoji) => (picked = emoji)} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'emoji-picker'}
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

		<DocPage.Text>
			The emoji set ships with the component as a plain TypeScript file — there is no runtime
			dependency and no network request.
		</DocPage.Text>

		<DocPage.Heading>In a popover</DocPage.Heading>
		<DocPage.Text>Combine it with the popover primitives to attach it to an input.</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-10">
				<div class="flex w-full max-w-sm items-center gap-2">
					<Input bind:value={message} placeholder="Write a message..." />
					<Popover.Root bind:open={popoverOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" size="icon" aria-label="Insert emoji">
									<Smile class="size-4" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-auto border-none p-0" align="end">
							<EmojiPicker
								class="shadow-none"
								onSelect={(emoji) => {
									message += emoji;
									popoverOpen = false;
								}}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Popover.Root bind:open={popoverOpen}>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="icon">
        <Smile class="size-4" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0" align="end">
    <EmojiPicker
      onSelect={(emoji) => {
        message += emoji;
        popoverOpen = false;
      }}
    />
  </Popover.Content>
</Popover.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Skin tones &amp; recents</DocPage.Heading>
		<DocPage.Text>
			The selected skin tone and the most recently used emoji are persisted to
			<code>localStorage</code>
			under <code>persistKey</code>. Both are also bindable, so you can store them yourself — pass
			<code>persistKey=&#123;null&#125;</code> to opt out of storage entirely.
		</DocPage.Text>
		<DocPage.Code
			code={`<EmojiPicker
  bind:skinTone={skinTone}
  bind:recents={recents}
  persistKey="my-app:emoji"
/>`}
		/>

		<DocPage.Heading>Compact</DocPage.Heading>
		<DocPage.Text>
			Every section can be turned off individually, and <code>columns</code> controls the grid density.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-10">
				<EmojiPicker
					columns={7}
					showPreview={false}
					showSkinTones={false}
					class="w-[268px]"
					onSelect={(emoji) => (picked = emoji)}
				/>
			</DocPage.Preview>
			<DocPage.Code
				code={`<EmojiPicker
  columns={7}
  showPreview={false}
  showSkinTones={false}
  class="w-[268px]"
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Keyboard</DocPage.Heading>
		<DocPage.Text>
			Type to search, use the arrow keys to move through the grid, <code>Enter</code> to pick and
			<code>Esc</code> to clear the query.
		</DocPage.Text>
	</DocPage.Content>
</DocPage.Root>
