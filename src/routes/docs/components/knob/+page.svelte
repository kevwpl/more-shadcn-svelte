<script lang="ts">
	import { Knob } from '$lib/components/ui/knob';
	import * as DocPage from '$lib/components/feature/doc-page';

	let gain = $state(75);
	let pan = $state(0);
	let reverb = $state(30);

	let blue = $state(45);
	let red = $state(90);

	let stepValue = $state(50);
	let temperature = $state(20);

	let disabledVal = $state(50);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Knob</DocPage.Title>
		<DocPage.Description>
			A theme-aware rotating dial for precise numeric adjustment.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-12">
				<div class="flex items-center gap-12 rounded-xl border bg-muted/20 p-8 shadow-inner">
					<Knob label="Gain" bind:value={gain} defaultValue={0} size={70} />
					<Knob label="Pan" bind:value={pan} min={-50} max={50} defaultValue={0} />
					<Knob label="Reverb" bind:value={reverb} defaultValue={0} size={70} />
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Knob label="Gain" bind:value={gain} defaultValue={0} />
<Knob label="Pan" bind:value={pan} min={-50} max={50} defaultValue={0} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'knob'}
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>

		<DocPage.Heading>Steps</DocPage.Heading>
		<DocPage.Text>
			The <code>step</code> prop allows you to snap the knob to specific intervals.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<Knob label="Snap (25)" bind:value={stepValue} defaultValue={50} step={25} size={70} />
			</DocPage.Preview>
			<DocPage.Code code={`<Knob bind:value={value} step={25} defaultValue={50} />`} />
		</DocPage.Example>

		<DocPage.Heading>Custom Ranges</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<Knob
					label="Celsius"
					bind:value={temperature}
					defaultValue={20}
					min={-20}
					max={50}
					size={70}
				/>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Knob bind:value={temperature} min={-20} max={50} defaultValue={20} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Custom Colors</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="flex items-center gap-10">
					<Knob
						label="Cyan"
						bind:value={blue}
						defaultValue={45}
						color="oklch(0.722 0.133 226.54)"
					/>
					<Knob label="Danger" bind:value={red} defaultValue={90} color="var(--destructive)" />
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Knob color="oklch(0.722 0.133 226.54)" bind:value={blue} defaultValue={45} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Disabled State</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<Knob label="Locked" bind:value={disabledVal} defaultValue={50} disabled />
			</DocPage.Preview>
		</DocPage.Example>

		<DocPage.Heading>Scaling</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview>
				<div class="flex items-center gap-8 py-10">
					<Knob label="Mini" size={40} value={25} defaultValue={25} />
					<Knob label="Default" size={60} value={50} defaultValue={50} />
					<Knob label="Jumbo" size={120} value={75} defaultValue={75} />
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Knob size={40} defaultValue={25} />\n<Knob size={120} defaultValue={75} />`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
