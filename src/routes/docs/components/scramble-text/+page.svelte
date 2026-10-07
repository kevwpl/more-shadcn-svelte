<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { ScrambleText } from '$lib/components/ui/scramble-text';
	import { Button } from '$lib/components/ui/button';
	import { RotateCcw } from '@lucide/svelte';

	let hero = $state<ReturnType<typeof ScrambleText> | null>(null);
	let reveals = $state<ReturnType<typeof ScrambleText>[]>([]);

	const menu = ['Overview', 'Components', 'Changelog', 'Installation'];
	const directions = ['start', 'end', 'center', 'random'] as const;
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Scramble Text</DocPage.Title>
		<DocPage.Description>
			Text that resolves out of random characters, one glyph at a time.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-16">
				<div class="flex flex-col items-center gap-6 px-6">
					<h3 class="text-3xl font-bold tracking-tight">
						<ScrambleText bind:this={hero} text="Access granted" duration={1400} />
					</h3>
					<Button size="sm" variant="outline" onclick={() => hero?.play()}>
						<RotateCcw class="size-3.5" /> Replay
					</Button>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { ScrambleText } from '$lib/components/ui/scramble-text';
</script>

<ScrambleText text="Access granted" duration={1400} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'scramble-text'}
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

		<DocPage.Heading>Triggers</DocPage.Heading>
		<DocPage.Text>
			It plays on mount by default. <code>trigger="hover"</code> replays it on every hover, which
			suits navigation; <code>view</code> waits for it to scroll into view; and
			<code>manual</code> only plays when you call <code>play()</code> through
			<code>bind:this</code>.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-12">
				<nav
					class="flex flex-wrap justify-center gap-x-6 gap-y-3 px-6 font-mono text-sm uppercase tracking-wider"
				>
					{#each menu as item}
						<a
							href="#triggers"
							class="text-muted-foreground transition-colors hover:text-foreground"
						>
							<ScrambleText text={item} trigger="hover" duration={500} />
						</a>
					{/each}
				</nav>
			</DocPage.Preview>
			<DocPage.Code
				code={`<a href="/components"><ScrambleText text="Components" trigger="hover" /></a>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Reveal order</DocPage.Heading>
		<DocPage.Text>
			Every character scrambles for the first fifth of <code>duration</code>, then they settle in
			the order set by <code>reveal</code>. Spaces are never scrambled.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-12">
				<div class="flex flex-col items-center gap-5 px-6">
					<div class="grid gap-3 font-mono text-sm sm:text-base">
						{#each directions as direction, i}
							<div class="flex items-center gap-4">
								<span class="w-14 shrink-0 text-xs text-muted-foreground">{direction}</span>
								<ScrambleText
									bind:this={reveals[i]}
									text="settling into place"
									reveal={direction}
									duration={1600}
								/>
							</div>
						{/each}
					</div>
					<Button size="sm" variant="outline" onclick={() => reveals.forEach((r) => r?.play())}>
						<RotateCcw class="size-3.5" /> Replay all
					</Button>
				</div>
			</DocPage.Preview>
			<DocPage.Code code={`<ScrambleText text="settling into place" reveal="center" />`} />
		</DocPage.Example>

		<DocPage.Heading>Layout and accessibility</DocPage.Heading>
		<DocPage.Text>
			The real text is rendered invisibly underneath to fix the box size, so the changing glyph
			widths never push the surrounding layout around — monospace or <code>tabular-nums</code> text
			avoids even the internal shimmer. The real text is what screen readers, server rendering and
			reduced-motion users get, and <code>characters</code> sets the pool the noise is drawn from.
		</DocPage.Text>
		<DocPage.Code
			code={`<ScrambleText text="0xC0FFEE" characters="0123456789ABCDEF" class="font-mono" />`}
		/>
	</DocPage.Content>
</DocPage.Root>
