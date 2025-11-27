<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as WheelPicker from '$lib/components/ui/wheel-picker';
	import { Label } from '$lib/components/ui/label';

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
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Wheel Picker</DocPage.Title>
		<DocPage.Description>An iOS-style scrollable selector.</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="border rounded-xl overflow-hidden shadow-sm">
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

		<DocPage.Heading>Multi-Column</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="border rounded-xl overflow-hidden shadow-sm w-40">
					<WheelPicker.Root>
						<WheelPicker.Group bind:value={time.h}>
							{#each hours as h}
								<WheelPicker.Item value={h}>{h}</WheelPicker.Item>
							{/each}
						</WheelPicker.Group>

						<WheelPicker.Group bind:value={time.m}>
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
  <WheelPicker.Group bind:value={hours} ... />
  <WheelPicker.Group bind:value={minutes} ... />
  <WheelPicker.Group bind:value={period} ... />
</WheelPicker.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
