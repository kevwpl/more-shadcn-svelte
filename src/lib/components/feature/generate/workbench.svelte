<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import WorkbenchHeader from './workbench-header.svelte';
	import WorkbenchPreview from './workbench-preview.svelte';
	import WorkbenchSource from './workbench-source.svelte';

	let { result, isDark }: { result: any; isDark: boolean } = $props();
	let copied = $state(false);

	const sourceTabs = $derived(
		result?.files
			?.filter((f: any) => f?.path)
			.map((f: any) => ({
				name: f.path.split('/').pop() || 'file',
				content: f.content
			})) || []
	);

	function handleCopyInstall() {
		if (!result) return;

		// 1. Construct the strictly typed shadcn registry object
		const registryObject = {
			name: result.name,
			type: 'registry:ui',
			dependencies: ['lucide-svelte'],
			registryDependencies: [],
			files: result.files.map((file: any) => {
				const fileName = file.path.split('/').pop() || '';
				// Fix: Prefix target with component name to create a subdirectory
				// e.g. "date-picker/index.ts" instead of just "index.ts"
				const targetPath = `${result.name}/${fileName}`;

				return {
					path: file.path,
					content: file.content,
					type: 'registry:ui',
					target: targetPath
				};
			})
		};

		// 2. Encode to Base64 Data URI
		const jsonString = JSON.stringify(registryObject);
		const base64 = btoa(unescape(encodeURIComponent(jsonString)));

		// 3. Create the command
		const command = `npx shadcn-svelte@latest add "data:application/json;base64,${base64}"`;

		navigator.clipboard.writeText(command);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="flex h-full w-full min-w-0 flex-col overflow-hidden bg-muted/5">
	<Tabs.Root value="preview" class="flex h-full w-full min-w-0 flex-col overflow-hidden gap-0">
		<WorkbenchHeader {copied} onCopyInstall={handleCopyInstall} />
		<WorkbenchPreview
			files={result?.files ?? []}
			usage={result?.usage ?? ''}
			title={result?.title ?? 'Component'}
			{isDark}
		/>
		<WorkbenchSource tabs={sourceTabs} />
	</Tabs.Root>
</div>
