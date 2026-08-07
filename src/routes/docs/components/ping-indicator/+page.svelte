<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { PingIndicator } from '$lib/components/ui/ping-indicator';
	import { Button } from '$lib/components/ui/button';

	// Stand-in probes so the docs stay lively without hammering the network.
	let drift = 60;
	async function fakeProbe() {
		drift = Math.max(20, Math.min(700, drift + (Math.random() - 0.5) * 160));
		await new Promise((r) => setTimeout(r, 50));
		return drift;
	}

	const fixed = (ms: number) => async () => {
		await new Promise((r) => setTimeout(r, 20));
		return ms;
	};

	const failing = async () => {
		await new Promise((r) => setTimeout(r, 20));
		throw new Error('unreachable');
	};

	let offline = $state(false);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Ping Indicator</DocPage.Title>
		<DocPage.Description>
			Four rising bars that show connection quality from a live probe.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="flex items-center gap-6">
					<PingIndicator probe={fakeProbe} interval={1500} size="lg" showLatency />
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { PingIndicator } from '$lib/components/ui/ping-indicator';
</script>

<PingIndicator url="https://api.example.com/health" />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'ping-indicator'}
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

		<DocPage.Heading>Levels</DocPage.Heading>
		<DocPage.Text>
			Bars light up from the round trip against <code>thresholds</code>: four under
			<code>excellent</code>, three under <code>good</code>, two under <code>fair</code>, one above
			it, and none when the probe fails. Colour follows the same scale, and the offline state is
			labelled in text so it does not rely on colour alone.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="flex flex-col gap-4 text-sm">
					{#each [{ ms: 40, name: 'Excellent' }, { ms: 150, name: 'Good' }, { ms: 380, name: 'Fair' }, { ms: 900, name: 'Poor' }] as sample}
						<div class="flex items-center gap-3">
							<PingIndicator probe={fixed(sample.ms)} interval={60000} size="lg" showLatency />
							<span class="text-muted-foreground">{sample.name}</span>
						</div>
					{/each}
					<div class="flex items-center gap-3">
						<PingIndicator probe={failing} interval={60000} size="lg" />
						<span class="text-muted-foreground">Unreachable</span>
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<PingIndicator
  url="/health"
  thresholds={{ excellent: 80, good: 200, fair: 500 }}
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Smoothing</DocPage.Heading>
		<DocPage.Text>
			A single slow response should not drop the bars. The indicator keeps the last
			<code>smoothing</code> samples and rates the median of them, so the display only moves when
			the connection actually changes. Set <code>smoothing=&#123;1&#125;</code> to react to every sample.
		</DocPage.Text>

		<DocPage.Heading>Sizes and labels</DocPage.Heading>
		<DocPage.Text>
			Three sizes, an optional <code>label</code>, and <code>showLatency</code> for the raw number.
			<code>bars</code> changes how many segments are drawn — the thresholds rescale to match.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="flex flex-col items-start gap-4">
					<PingIndicator probe={fakeProbe} interval={1500} size="sm" label="sm" />
					<PingIndicator probe={fakeProbe} interval={1500} size="md" label="md" />
					<PingIndicator probe={fakeProbe} interval={1500} size="lg" label="lg" />
					<PingIndicator probe={fakeProbe} interval={1500} size="lg" bars={6} showLatency />
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<PingIndicator size="sm" label="API" />
<PingIndicator size="lg" showLatency />
<PingIndicator bars={6} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Probing and control</DocPage.Heading>
		<DocPage.Text>
			With a <code>url</code> the indicator sends a cache busted <code>HEAD</code> request in
			<code>no-cors</code>
			mode, so timing stays accurate without the endpoint needing CORS headers. Pass a
			<code>probe</code>
			to time anything else. Polling pauses while the tab is hidden and whenever
			<code>paused</code> is set.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="flex items-center gap-4">
					<PingIndicator probe={fakeProbe} interval={1200} paused={offline} size="lg" showLatency />
					<Button size="sm" variant="outline" onclick={() => (offline = !offline)}>
						{offline ? 'Resume' : 'Pause'}
					</Button>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<PingIndicator
  probe={async () => {
    const started = performance.now();
    await socket.ping();
    return performance.now() - started;
  }}
  interval={2000}
  paused={offline}
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Custom rendering</DocPage.Heading>
		<DocPage.Text>
			The default snippet receives the status, the number of lit bars and the latest latency, while
			the polling keeps running. <code>latency</code> is also bindable.
		</DocPage.Text>
		<DocPage.Code
			code={`<PingIndicator url="/health">
  {#snippet children({ status, level, latency })}
    <span>{level}/4 · {status} · {latency} ms</span>
  {/snippet}
</PingIndicator>`}
		/>
	</DocPage.Content>
</DocPage.Root>
