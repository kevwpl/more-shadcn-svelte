<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Banner, resetBanner } from '$lib/components/ui/banner';
	import { Button } from '$lib/components/ui/button';
	import { RotateCcw, Sparkles, TriangleAlert } from '@lucide/svelte';

	let persistedOpen = $state(true);
	let bump = $state(0);

	function restore() {
		resetBanner('docs-demo');
		persistedOpen = true;
		// Force a remount so the banner re-reads storage.
		bump += 1;
	}
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Banner</DocPage.Title>
		<DocPage.Description>
			A dismissible page-level notice that remembers when it was closed.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-10">
				<div class="w-full max-w-2xl overflow-hidden rounded-lg border">
					<Banner id="docs-basic" persist="none">
						{#snippet icon()}
							<Sparkles class="size-4" />
						{/snippet}
						<span>
							<strong>More Shadcn 1.0</strong> is out — 30+ components, all copy and paste.
						</span>
						{#snippet action()}
							<Button size="sm" variant="outline" href="/docs/changelog">Changelog</Button>
						{/snippet}
					</Banner>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Banner id="release-1-0">
  {#snippet icon()}
    <Sparkles class="size-4" />
  {/snippet}

  <strong>More Shadcn 1.0</strong> is out.

  {#snippet action()}
    <Button size="sm" variant="outline" href="/docs/changelog">Changelog</Button>
  {/snippet}
</Banner>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'banner'}
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

		<DocPage.Heading>Persistence</DocPage.Heading>
		<DocPage.Text>
			Dismissals are stored under <code>more-shadcn:banner:&lt;id&gt;</code>. Use
			<code>persist="local"</code>
			to hide it forever, <code>persist="session"</code> until the tab closes, or
			<code>persist="none"</code> to keep it purely in memory. Give every banner a unique
			<code>id</code> — bumping it is how you re-announce something.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-10">
				<div class="w-full max-w-2xl space-y-3">
					<div class="overflow-hidden rounded-lg border">
						{#key bump}
							<Banner
								id="docs-demo"
								persist="local"
								variant="info"
								bind:open={persistedOpen}
								align="center"
							>
								Dismiss me, then reload the page — I stay closed.
							</Banner>
						{/key}
					</div>
					<Button size="sm" variant="outline" onclick={restore}>
						<RotateCcw class="size-3.5" /> Reset dismissal
					</Button>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { Banner, resetBanner } from '$lib/components/ui/banner';
</script>

<Banner id="cookie-notice" persist="local" variant="info" align="center">
  Dismiss me, then reload the page — I stay closed.
</Banner>

<Button onclick={() => resetBanner('cookie-notice')}>Reset</Button>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Variants</DocPage.Heading>
		<DocPage.Text>
			Six variants are available: <code>default</code>, <code>primary</code>, <code>info</code>,
			<code>success</code>, <code>warning</code> and <code>destructive</code>.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-10">
				<div class="w-full max-w-2xl space-y-2">
					{#each ['default', 'primary', 'info', 'success', 'warning', 'destructive'] as const as variant}
						<div class="overflow-hidden rounded-lg border">
							<Banner id={`docs-variant-${variant}`} persist="none" {variant} dismissible={false}>
								{#snippet icon()}
									<TriangleAlert class="size-4" />
								{/snippet}
								<span class="capitalize">{variant}</span>
							</Banner>
						</div>
					{/each}
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Banner id="maintenance" variant="warning">Scheduled maintenance at 22:00 UTC.</Banner>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Sticky</DocPage.Heading>
		<DocPage.Text>
			Set <code>sticky</code> to pin the banner to the top of the viewport as the page scrolls. Place
			it as the first element inside your root layout.
		</DocPage.Text>
		<DocPage.Code
			code={`<!-- src/routes/+layout.svelte -->
<Banner id="beta-notice" sticky variant="primary" align="center">
  {#snippet icon()}<Megaphone class="size-4" />{/snippet}
  You are using the beta build.
</Banner>

{@render children()}`}
		/>
	</DocPage.Content>
</DocPage.Root>
