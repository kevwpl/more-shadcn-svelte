<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as WheelPicker from '$lib/components/ui/wheel-picker';

	const frameworks = [
		'Next.js',
		'SvelteKit',
		'Nuxt',
		'Remix',
		'Astro',
		'Laravel',
		'Rails',
		'Django'
	];
	let selectedFramework = $state('SvelteKit');

	let hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
	let minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
	let ampm = ['AM', 'PM'];

	let time = $state({ h: '09', m: '41', p: 'AM' });

	let days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
	let selectedDay = $state('15');
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Wheel Picker</DocPage.Title>
		<DocPage.Description>An iOS-style scrollable selector.</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="border rounded-xl overflow-hidden shadow-sm w-48">
					<WheelPicker.Root>
						<WheelPicker.Group bind:value={selectedFramework}>
							{#each frameworks as fw}
								<WheelPicker.Item value={fw}>{fw}</WheelPicker.Item>
							{/each}
						</WheelPicker.Group>
					</WheelPicker.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<WheelPicker.Root>
  <WheelPicker.Group bind:value={selected}>
    {#each items as item}
      <WheelPicker.Item value={item}>{item}</WheelPicker.Item>
    {/each}
  </WheelPicker.Group>
</WheelPicker.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'wheel-picker'}
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

		<DocPage.Heading>Multi-Column</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="border rounded-xl overflow-hidden shadow-sm w-48">
					<WheelPicker.Root>
						<WheelPicker.Group bind:value={time.h} loop>
							{#each hours as h}
								<WheelPicker.Item value={h}>{h}</WheelPicker.Item>
							{/each}
						</WheelPicker.Group>
						<div class="flex items-center justify-center text-muted-foreground pb-1">:</div>
						<WheelPicker.Group bind:value={time.m} loop>
							{#each minutes as m}
								<WheelPicker.Item value={m}>{m}</WheelPicker.Item>
							{/each}
						</WheelPicker.Group>

						<WheelPicker.Group bind:value={time.p}>
							{#each ampm as p}
								<WheelPicker.Item value={p}>{p}</WheelPicker.Item>
							{/each}
						</WheelPicker.Group>
					</WheelPicker.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<WheelPicker.Root>
  <!-- Use 'loop' prop for infinite scrolling -->
  <WheelPicker.Group bind:value={hours} loop>
     ...
  </WheelPicker.Group>

  <div class="...">:</div> <!-- You can put separators in between -->

  <WheelPicker.Group bind:value={minutes} loop>
     ...
  </WheelPicker.Group>

  <WheelPicker.Group bind:value={period}>
     ...
  </WheelPicker.Group>
</WheelPicker.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Collapsed</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="border rounded-xl overflow-hidden shadow-sm w-32">
					<WheelPicker.Root collapsed>
						<WheelPicker.Group bind:value={selectedFramework}>
							{#each frameworks as fw}
								<WheelPicker.Item value={fw}>{fw}</WheelPicker.Item>
							{/each}
						</WheelPicker.Group>
					</WheelPicker.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<WheelPicker.Root collapsed>
  <WheelPicker.Group bind:value={selectedFramework}>
    {#each frameworks as fw}
      <WheelPicker.Item value={fw}>{fw}</WheelPicker.Item>
    {/each}
  </WheelPicker.Group>
</WheelPicker.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Infinite Loop</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="border rounded-xl overflow-hidden shadow-sm w-32">
					<WheelPicker.Root>
						<WheelPicker.Group bind:value={selectedDay} loop>
							{#each days as day}
								<WheelPicker.Item value={day}>{day}</WheelPicker.Item>
							{/each}
						</WheelPicker.Group>
					</WheelPicker.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<WheelPicker.Root>
  <WheelPicker.Group bind:value={day} loop>
    {#each days as day}
      <WheelPicker.Item value={day}>{day}</WheelPicker.Item>
    {/each}
  </WheelPicker.Group>
</WheelPicker.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
