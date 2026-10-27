<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Typewriter } from '$lib/components/ui/typewriter';
	import { Button } from '$lib/components/ui/button';
	import { RotateCcw } from '@lucide/svelte';

	let replay = $state(0);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Typewriter</DocPage.Title>
		<DocPage.Description>
			Text that types itself out, optionally cycling through several phrases.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-16">
				<h3 class="text-center text-3xl font-bold tracking-tight">
					Build interfaces that are
					<br />
					<Typewriter
						text={['fast.', 'accessible.', 'a joy to use.']}
						class="text-primary"
						reserveSpace
					/>
				</h3>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { Typewriter } from '$lib/components/ui/typewriter';
</script>

<h3>
  Build interfaces that are
  <Typewriter text={['fast.', 'accessible.', 'a joy to use.']} reserveSpace />
</h3>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'typewriter'}
		<DocPage.Text
			>Run the following command to install the `{componentName}` components:</DocPage.Text
		>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://legacy.more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>

		<DocPage.Heading>One string, or several</DocPage.Heading>
		<DocPage.Text>
			A single string types once and stops, with the caret left blinking. An array cycles: each
			phrase types out, holds for <code>pause</code> ms, deletes, and the next begins. The caret stays
			solid while typing and only blinks at rest, the way a real text cursor behaves.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-12">
				<div class="flex w-full flex-col items-center gap-4 px-6">
					{#key replay}
						<p class="font-mono text-sm sm:text-lg">
							<Typewriter text="$ npm install more-shadcn-svelte" speed={45} />
						</p>
					{/key}
					<Button size="sm" variant="outline" onclick={() => replay++}>
						<RotateCcw class="size-3.5" /> Replay
					</Button>
				</div>
			</DocPage.Preview>
			<DocPage.Code code={`<Typewriter text="$ npm install more-shadcn-svelte" speed={45} />`} />
		</DocPage.Example>

		<DocPage.Heading>Cursor and pacing</DocPage.Heading>
		<DocPage.Text>
			Pass a string to <code>cursor</code> to use a character instead of a bar, or
			<code>false</code> for none. <code>speed</code> and <code>deleteSpeed</code> are milliseconds
			per character, and <code>humanize</code> (on by default) varies each delay a little so it reads
			as typed rather than printed.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-12">
				<!-- One phrase per row, left-aligned so the lines don't jump about as they type. -->
				<div class="flex w-full max-w-sm flex-col gap-4 px-6 text-lg">
					<div class="flex flex-col gap-0.5">
						<span class="text-xs text-muted-foreground">cursor="_"</span>
						<Typewriter text={['An underscore cursor', 'like an old terminal']} cursor="_" />
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-xs text-muted-foreground">cursor="▍", slow, no humanize</span>
						<Typewriter
							text={['Slow and steady', 'with a block caret']}
							speed={120}
							humanize={false}
							cursor="▍"
							cursorClass="text-primary"
						/>
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-xs text-muted-foreground">cursor=&#123;false&#125;</span>
						<Typewriter text={['No cursor at all', 'just the text']} cursor={false} />
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Typewriter text={phrases} cursor="_" />
<Typewriter text={phrases} speed={120} humanize={false} cursor="▍" />
<Typewriter text={phrases} cursor={false} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Layout and accessibility</DocPage.Heading>
		<DocPage.Text>
			By default the text flows inline and grows as it types. <code>reserveSpace</code> sizes it to
			the widest phrase up front so nothing around it shifts — used in the heading at the top.
			Screen readers get the full text once rather than every keystroke, users who prefer reduced
			motion see the text without animation, and <code>trigger="view"</code> waits until it scrolls into
			view. Text is split into graphemes, so emoji and accented characters never appear half-typed.
		</DocPage.Text>
		<DocPage.Code code={`<Typewriter text={phrases} reserveSpace trigger="view" />`} />
	</DocPage.Content>
</DocPage.Root>
