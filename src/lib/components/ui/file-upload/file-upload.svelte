<script lang="ts">
	import { CloudCheckIcon, CloudUploadIcon, FileIcon, UploadIcon, XIcon } from '@lucide/svelte';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { onDestroy } from 'svelte';

	interface Props {
		value: string | string[];
		files: File[];
		placeholder?: string;
		image: boolean;
		limit?: number;
		disabled?: boolean;
		class?: string;
		oninput?: (event: InputEvent) => void;
	}
	let {
		value = $bindable(),
		files = $bindable([]),
		placeholder = 'Select File',
		image = false,
		limit = 0,
		disabled = false,
		class: className = undefined,
		oninput = () => {}
	}: Props = $props();

	const multiple = $derived(Array.isArray(value));
	const values = $derived([value].flatMap((item) => (item ? item : [])));
	const objectURLCache = new Map<File, string>();
	const fileList = $derived([
		...values.map((src) => ({
			src,
			alt: src,
			file: undefined as undefined | File
		})),
		...(files ?? []).map((file: File) => {
			if (!objectURLCache.has(file)) {
				objectURLCache.set(file, URL.createObjectURL(file));
			}
			return {
				src: objectURLCache.get(file)!,
				alt: file.name,
				file
			};
		})
	]);

	function onclick() {
		let inputEl: HTMLInputElement | null = document.createElement('input');
		inputEl.type = 'file';
		if (image) inputEl.accept = 'image/*';
		if (multiple) inputEl.multiple = multiple;
		inputEl.onchange = () => {
			if (inputEl?.files?.length) {
				if (multiple) {
					if (limit && inputEl.files.length + fileList.length > limit) {
						alert(`Maximum number exceeded (${limit})`);
					} else {
						files.push(...Array.from(inputEl.files));
					}
				} else {
					files = [inputEl.files[0]];
				}
			}
			inputEl?.remove();
			inputEl = null;
		};
		if (oninput) inputEl.oninput = oninput;
		inputEl.click();
	}
	function handleRemove(index: number, file?: File) {
		if (file) {
			if (objectURLCache.has(file)) {
				URL.revokeObjectURL(objectURLCache.get(file)!);
				objectURLCache.delete(file);
			}
			files = multiple ? files.filter((_file: File) => _file !== file) : [];
		} else {
			value = multiple && Array.isArray(value) ? value.filter((_, i) => i !== index) : '';
		}
	}
	onDestroy(() => {
		for (const url of objectURLCache.values()) {
			URL.revokeObjectURL(url);
		}
		objectURLCache.clear();
	});
</script>

<InputGroup.Root class={className}>
	<InputGroup.Addon align="block-start" class="py-1">
		<InputGroup.Button {disabled} {onclick} class="w-full">
			<UploadIcon class="size-4" />{placeholder}
		</InputGroup.Button>
	</InputGroup.Addon>
	<InputGroup.Addon align="block-end" hidden={!fileList.length} class="flex-col flex-wrap">
		{#each fileList as { src, alt, file }, i}
			<div class="flex w-full items-center gap-2 overflow-hidden rounded-md border bg-background">
				<InputGroup.Button
					type="button"
					size="icon-sm"
					onclick={() => handleRemove(i, file)}
					class="ml-1 rounded-full"
				>
					<XIcon class="size-4 text-destructive" />
				</InputGroup.Button>
				{#if file}
					<CloudUploadIcon class="size-4 text-yellow-500" />
				{:else}
					<CloudCheckIcon class="size-4 text-green-500" />
				{/if}
				<div class="flex-1">{alt}</div>
				{#if image}
					<img {src} {alt} class="h-10" />
				{:else}
					<div class="flex size-10">
						<FileIcon class="m-auto" />
					</div>
				{/if}
			</div>
		{/each}
	</InputGroup.Addon>
</InputGroup.Root>
