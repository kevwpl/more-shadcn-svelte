<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as PdfViewer from '$lib/components/ui/pdf-viewer';
	import { Button } from '$lib/components/ui/button';
	import { FileUp } from '@lucide/svelte';

	let localFile = $state<ArrayBuffer | null>(null);
	let localName = $state('');

	let page = $state(1);
	let scale = $state(1);
	let fit = $state<PdfViewer.PdfFit>('width');

	async function openFile(e: Event & { currentTarget: HTMLInputElement }) {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		localName = file.name;
		localFile = await file.arrayBuffer();
	}
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>PDF Viewer</DocPage.Title>
		<DocPage.Description>
			A composable PDF viewer with paging, zoom, rotation, thumbnails and download.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="h-auto p-0">
				<PdfViewer.Root src="/docs/sample.pdf" sidebar class="h-[560px] w-full rounded-b-none" />
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import * as PdfViewer from '$lib/components/ui/pdf-viewer';
</script>

<PdfViewer.Root src="/files/report.pdf" sidebar class="h-[560px]" />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'pdf-viewer'}
		<DocPage.Text
			>Run the following command to install the `{componentName}` components:</DocPage.Text
		>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://legacy.more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>
		<DocPage.Text>
			Rendering is done by <code>pdfjs-dist</code>, which is installed alongside it and loaded
			lazily on the client the first time a viewer mounts — it adds nothing to pages that never show
			a PDF.
		</DocPage.Text>

		<DocPage.Heading>Composing your own</DocPage.Heading>
		<DocPage.Text>
			With no children the root renders a complete viewer — one that drops the thumbnail sidebar,
			and its toggle, when the viewer itself is narrower than 560px, so the pages keep the room.
			Pass children and it renders only what you give it, so every part — the pages, the thumbnails,
			the toolbar and each control inside it — can be arranged however you like. Here the thumbnails
			move to the right and the toolbar keeps just paging and zoom.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto p-0">
				<PdfViewer.Root
					src="/docs/sample.pdf"
					class="h-[480px] w-full rounded-t-md border-b bg-muted/30"
				>
					<PdfViewer.Toolbar class="justify-between">
						<PdfViewer.PageNav />
						<PdfViewer.Zoom showFit={false} />
					</PdfViewer.Toolbar>
					<div class="flex min-h-0 flex-1">
						<PdfViewer.Pages class="min-w-0 flex-1" gap={24} />
						<PdfViewer.Thumbnails width={72} class="hidden w-28 shrink-0 border-l sm:block" />
					</div>
				</PdfViewer.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<PdfViewer.Root src={src} class="h-[480px]">
  <PdfViewer.Toolbar class="justify-between">
    <PdfViewer.PageNav />
    <PdfViewer.Zoom showFit={false} />
  </PdfViewer.Toolbar>

  <div class="flex min-h-0 flex-1">
    <PdfViewer.Pages class="flex-1" gap={24} />
    <PdfViewer.Thumbnails width={72} class="w-28 border-l" />
  </div>
</PdfViewer.Root>`}
			/>
		</DocPage.Example>
		<DocPage.Text>
			Every part reads the same context, which is exported as <code>getPdfViewerContext()</code> for
			building controls of your own — it exposes the page count, current page, zoom and rotation,
			plus
			<code>goTo</code>, <code>zoomIn</code>, <code>rotate</code> and <code>download</code>.
		</DocPage.Text>

		<DocPage.Heading>Controlling it from outside</DocPage.Heading>
		<DocPage.Text>
			<code>page</code>, <code>scale</code>, <code>rotation</code>, <code>fit</code> and
			<code>sidebar</code> are all bindable. Setting <code>page</code> scrolls to it, and the
			binding updates as the reader scrolls. <code>fit</code> keeps refitting as the viewer resizes until
			you zoom manually.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto p-4">
				<div class="flex w-full flex-col gap-3">
					<div class="flex flex-wrap items-center gap-2 text-sm">
						<Button size="sm" variant="outline" onclick={() => (page = 1)}>First page</Button>
						<Button size="sm" variant="outline" onclick={() => (page = 4)}>Jump to page 4</Button>
						<Button size="sm" variant="outline" onclick={() => (fit = 'page')}>Fit page</Button>
						<span class="font-mono text-xs text-muted-foreground sm:ml-auto">
							page={page} · scale={scale.toFixed(2)} · fit={fit}
						</span>
					</div>
					<PdfViewer.Root
						src="/docs/sample.pdf"
						bind:page
						bind:scale
						bind:fit
						class="h-[420px] w-full rounded-lg border bg-muted/30"
					>
						<PdfViewer.Pages class="h-full" />
					</PdfViewer.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  let page = $state(1);
  let scale = $state(1);
  let fit = $state<PdfFit>('width');
</script>

<button onclick={() => (page = 4)}>Jump to page 4</button>

<PdfViewer.Root src={src} bind:page bind:scale bind:fit>
  <PdfViewer.Pages />
</PdfViewer.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Opening a local file</DocPage.Heading>
		<DocPage.Text>
			<code>src</code> takes a URL or raw bytes. Bytes are copied before they go to pdf.js — it hands
			them to its worker, which would otherwise leave your buffer detached and unusable. The file below
			is read in your browser and never uploaded.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="h-auto p-4">
				<div class="flex w-full flex-col gap-3">
					<div class="flex flex-wrap items-center gap-3">
						<label
							class="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-accent focus-within:ring-2 focus-within:ring-ring"
						>
							<FileUp class="size-4" />
							<span class="max-w-56 truncate">{localName || 'Choose a PDF…'}</span>
							<input type="file" accept="application/pdf" class="sr-only" onchange={openFile} />
						</label>
						<span class="text-xs text-muted-foreground">Read in your browser, never uploaded.</span>
					</div>
					{#if localFile}
						<PdfViewer.Root src={localFile} filename={localName} class="h-[460px] w-full" />
					{/if}
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  let bytes = $state<ArrayBuffer | null>(null);
</script>

<input
  type="file"
  accept="application/pdf"
  onchange={async (e) => (bytes = await e.currentTarget.files?.[0]?.arrayBuffer() ?? null)}
/>

{#if bytes}
  <PdfViewer.Root src={bytes} />
{/if}`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Rendering</DocPage.Heading>
		<DocPage.Text>
			Only pages near the viewport hold a bitmap — the rest are empty frames at the right size, so a
			long document costs little memory. Pages render at device resolution for crisp text, back off
			before exceeding what the browser will allocate at extreme zoom, and re-render offscreen so a
			zoom never flashes blank. <code>Ctrl</code>/<code>⌘</code> + scroll zooms the document rather than
			the page.
		</DocPage.Text>

		<DocPage.Heading>Fonts and character maps</DocPage.Heading>
		<DocPage.Text>
			pdf.js ships its standard fonts, CJK character maps and image decoders as separate files. By
			default they load from jsDelivr, pinned to the installed version. To self-host, copy them out
			of
			<code>node_modules/pdfjs-dist</code> and point the viewer at them.
		</DocPage.Text>
		<DocPage.Code
			code={`<PdfViewer.Root
  src={src}
  standardFontDataUrl="/pdfjs/standard_fonts/"
  cMapUrl="/pdfjs/cmaps/"
  wasmUrl="/pdfjs/wasm/"
/>`}
		/>

		<DocPage.Heading>In development</DocPage.Heading>
		<DocPage.Text>
			Under <code>vite dev</code> you may see <code>ReferenceError: document is not defined</code> in
			the console, once per document. Vite's dev server injects its client into the pdf.js worker file,
			and that client expects a page. It is harmless — documents still load and render — and production
			builds ship the worker untouched.
		</DocPage.Text>
	</DocPage.Content>
</DocPage.Root>
