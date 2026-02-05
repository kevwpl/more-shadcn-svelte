<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { TagInput } from '$lib/components/ui/tag-input';
	import { Label } from '$lib/components/ui/label';

	let basicTags = $state(['Svelte', 'Kit']);
	let emailTags = $state(['john@example.com']);

	// Simple email regex for validation example
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Tag Input</DocPage.Title>
		<DocPage.Description>
			An input field for entering multiple values, displayed as chips.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-sm space-y-2">
					<Label>Frameworks</Label>
					<TagInput bind:tags={basicTags} />
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  let tags = $state(['Svelte', 'Kit']);
</script>

<TagInput bind:tags={tags} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'tag-input'}
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

		<DocPage.Heading>Validation</DocPage.Heading>
		<DocPage.Text>
			You can pass a <code>validate</code> function. Tags won't be added if they return false.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-sm space-y-2">
					<Label>Invite Users (Emails Only)</Label>
					<TagInput
						bind:tags={emailTags}
						placeholder="Enter email..."
						validate={(t) => emailRegex.test(t)}
					/>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<TagInput
  validate={(tag) => emailRegex.test(tag)}
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Styles & Limits</DocPage.Heading>
		<DocPage.Text>
			Customize the internal `Chip` variant or set a maximum number of tags.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-sm space-y-2">
					<Label>Top 3 Skills</Label>
					<TagInput
						tags={['Design']}
						maxTags={3}
						chipVariant="default"
						placeholder="Add skill (max 3)..."
					/>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<TagInput
  maxTags={3}
  chipVariant="default"
/>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
