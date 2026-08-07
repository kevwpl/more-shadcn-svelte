<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { UpdateBanner } from '$lib/components/ui/update-banner';
	import { Button } from '$lib/components/ui/button';
	import { Rocket } from '@lucide/svelte';

	let inlineOpen = $state(true);
	let countdownOpen = $state(false);
	let floatingOpen = $state(false);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Update Banner</DocPage.Title>
		<DocPage.Description>
			A reload prompt that appears when a new service worker is waiting to take over.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-10">
				<div class="w-full max-w-sm space-y-3">
					<UpdateBanner
						source="manual"
						position="inline"
						bind:available={inlineOpen}
						onreload={() => {
							inlineOpen = false;
							// Returning false keeps the docs from actually reloading.
							return false;
						}}
					/>
					{#if !inlineOpen}
						<Button size="sm" variant="outline" onclick={() => (inlineOpen = true)}>
							Show again
						</Button>
					{/if}
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { UpdateBanner } from '$lib/components/ui/update-banner';
</script>

<!-- Drop it in the root layout; it stays hidden until an update is waiting -->
<UpdateBanner />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'update-banner'}
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

		<DocPage.Heading>How the detection works</DocPage.Heading>
		<DocPage.Text>
			The banner looks up the current registration and watches for a worker that reaches the
			<code>installed</code>
			state while a controller is already active — that combination means a new build is sitting in
			<code>registration.waiting</code>. A first ever install has no controller, so it never
			triggers the prompt.
		</DocPage.Text>
		<DocPage.Text>
			Pressing reload posts <code>&#123; type: 'SKIP_WAITING' &#125;</code> to the waiting worker
			and reloads once <code>controllerchange</code> fires, falling back to a plain reload after
			<code>reloadTimeout</code> so a worker that ignores the message cannot strand the app.
		</DocPage.Text>
		<DocPage.Text>Your service worker needs to handle the message:</DocPage.Text>
		<DocPage.Code
			code={`// src/service-worker.ts
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});`}
		/>

		<DocPage.Heading>Polling</DocPage.Heading>
		<DocPage.Text>
			Browsers only check for a new worker on navigation. Set <code>pollInterval</code> to look for
			one while the app stays open, or call <code>check()</code> yourself after a route change.
		</DocPage.Text>
		<DocPage.Code
			code={`<!-- check for a new build every 15 minutes -->
<UpdateBanner pollInterval={15 * 60 * 1000} />`}
		/>

		<DocPage.Heading>Driving it yourself</DocPage.Heading>
		<DocPage.Text>
			Use <code>source="manual"</code> with a bindable <code>available</code> to plug in another
			signal — SvelteKit's <code>updated</code> store, a version endpoint, or a push message.
		</DocPage.Text>
		<DocPage.Code
			code={`<script lang="ts">
  import { updated } from '$app/state';
</script>

<UpdateBanner source="manual" available={updated.current} />`}
		/>

		<DocPage.Heading>Countdown</DocPage.Heading>
		<DocPage.Text>
			<code>autoReloadAfter</code> reloads on its own after a grace period, with the remaining seconds
			shown in the copy. Dismissing cancels it.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-10">
				<div class="w-full max-w-sm space-y-3">
					<Button size="sm" onclick={() => (countdownOpen = true)}>Simulate an update</Button>
					<UpdateBanner
						source="manual"
						position="inline"
						bind:available={countdownOpen}
						autoReloadAfter={10}
						title="Version 2.4.0 is ready"
						description="This tab is running an older build."
						onreload={() => {
							countdownOpen = false;
							return false;
						}}
					>
						{#snippet icon()}
							<Rocket class="size-4" />
						{/snippet}
					</UpdateBanner>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<UpdateBanner
  autoReloadAfter={10}
  title="Version 2.4.0 is ready"
  description="This tab is running an older build."
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Position</DocPage.Heading>
		<DocPage.Text>
			By default the prompt is a fixed toast in the bottom right. Use <code>inline</code> to place it
			in the flow, or one of the other corners.
		</DocPage.Text>
		<DocPage.Text>
			Every fixed variant anchors to the nearest ancestor with a <code>transform</code>,
			<code>filter</code>
			or <code>backdrop-filter</code> rather than the viewport — that is how CSS works, and it is why
			the preview below sits inside this column. Mount it in your root layout to pin it to the window.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto py-10">
				<div class="space-y-3">
					<Button size="sm" variant="outline" onclick={() => (floatingOpen = !floatingOpen)}>
						Toggle floating prompt
					</Button>
					<UpdateBanner
						source="manual"
						position="bottom-right"
						bind:available={floatingOpen}
						onreload={() => {
							floatingOpen = false;
							return false;
						}}
					/>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<UpdateBanner position="bottom-center" />
<UpdateBanner position="top-center" />
<UpdateBanner position="inline" />`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
