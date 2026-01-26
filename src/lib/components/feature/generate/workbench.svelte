<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import WorkbenchHeader from './workbench-header.svelte';
	import WorkbenchPreview from './workbench-preview.svelte';
	import WorkbenchSource from './workbench-source.svelte';

	let { result, isDark }: { result: any; isDark: boolean } = $props();
	let copied = $state(false);

	const sourceTabs = $derived(
		result?.files.map((f: any) => ({
			name: f.path.split('/').pop() || 'file',
			content: f.content
		})) || []
	);

	function handleCopyInstall() {
		navigator.clipboard.writeText(
			`npx shadcn-svelte@latest add https://more-shadcn.noair.fun/r/generated/${result?.name}.json`
		);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="flex h-full w-full min-w-0 flex-col overflow-hidden bg-muted/5">
	<Tabs.Root value="preview" class="flex h-full w-full min-w-0 flex-col overflow-hidden">
		<WorkbenchHeader {copied} onCopyInstall={handleCopyInstall} />
		<WorkbenchPreview files={result?.files ?? []} usage={result?.usage ?? ''} {isDark} />
		<WorkbenchSource tabs={sourceTabs} />
	</Tabs.Root>
</div>
