<script lang="ts">
	import * as DynamicSelect from '$lib/components/ui/dynamic-select';
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Button } from '$lib/components/ui/button';

	let framework = $state('Svelte');
	const frameworks = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'angular', label: 'Angular' }
	];

	let category = $state('');
	const categories = ['Electronics', 'Clothing', 'Home', 'Books'];
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Dynamic Select</DocPage.Title>
		<DocPage.Description>
			A combobox-style select that allows users to pick from predefined options or enter a custom
			value.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="flex w-full max-w-xs flex-col gap-4">
					<DynamicSelect.Root bind:value={framework}>
						<DynamicSelect.Trigger class="">Select framework...</DynamicSelect.Trigger>
						<DynamicSelect.Content>
							<DynamicSelect.Group>
								{#each frameworks as f}
									<DynamicSelect.Item value={f.value}>
										{f.label}
									</DynamicSelect.Item>
								{/each}
							</DynamicSelect.Group>
						</DynamicSelect.Content>
					</DynamicSelect.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<DynamicSelect.Root bind:value={framework}>
  <DynamicSelect.Trigger>Select framework...</DynamicSelect.Trigger>
  <DynamicSelect.Content>
    <DynamicSelect.Group>
      {#each frameworks as f}
        <DynamicSelect.Item value={f.label}>{f.value}</DynamicSelect.Item>
      {/each}
    </DynamicSelect.Group>
  </DynamicSelect.Content>
</DynamicSelect.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'dynamic-select'}
		<DocPage.Text>
			Run the following command to install the `{componentName}` components:
		</DocPage.Text>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>
	</DocPage.Content>
</DocPage.Root>
