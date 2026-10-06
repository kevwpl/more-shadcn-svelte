<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import FileUpload from '$lib/components/ui/file-upload/file-upload.svelte';
	import { code, codeWithSuperforms } from './code';
	const baseUrl = '/content/';
	let value = $state([`${baseUrl}finder.png`, `${baseUrl}mail.png`]);
	let files = $state([]);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>File Upload</DocPage.Title>
		<DocPage.Description>File upload and preview</DocPage.Description>
	</DocPage.Header>
	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview>
				<FileUpload image bind:value bind:files class="max-w-md" />
			</DocPage.Preview>
			<DocPage.Code {code} />
		</DocPage.Example>
		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'file-upload'}
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
		<DocPage.Heading>Works in forms</DocPage.Heading>
		<DocPage.Text
			>{`input[type="file"]'s files is read-only, so it can only be handled with controlled state.
You can create a FormData and append the files to it.`}</DocPage.Text
		>
		<DocPage.Heading>Works with superforms</DocPage.Heading>
		<DocPage.Code code={codeWithSuperforms} />
	</DocPage.Content>
</DocPage.Root>
