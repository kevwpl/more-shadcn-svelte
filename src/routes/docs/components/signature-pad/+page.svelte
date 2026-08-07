<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { SignaturePad } from '$lib/components/ui/signature-pad';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Download, Eraser, Undo2 } from '@lucide/svelte';

	let pad = $state<ReturnType<typeof SignaturePad> | null>(null);
	let strokes = $state<any[]>([]);
	let preview = $state('');

	let colorPad = $state<ReturnType<typeof SignaturePad> | null>(null);

	function download(dataUrl: string, filename: string) {
		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = filename;
		link.click();
	}
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Signature Pad</DocPage.Title>
		<DocPage.Description>
			A pressure and velocity aware drawing canvas that exports to PNG or SVG.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-md space-y-3">
					<Label>Sign here</Label>
					<SignaturePad bind:this={pad} bind:strokes class="h-40" />
					<div class="flex flex-wrap items-center gap-2">
						<Button variant="outline" size="sm" onclick={() => pad?.undo()}>
							<Undo2 class="size-3.5" /> Undo
						</Button>
						<Button variant="outline" size="sm" onclick={() => pad?.clear()}>
							<Eraser class="size-3.5" /> Clear
						</Button>
						<Button
							size="sm"
							disabled={strokes.length === 0}
							onclick={() => (preview = pad?.toSVGDataURL() ?? '')}
						>
							Export SVG
						</Button>
						<span class="text-xs text-muted-foreground">{strokes.length} strokes</span>
					</div>

					{#if preview}
						<div class="rounded-md border bg-muted/30 p-2">
							<img src={preview} alt="Exported signature" class="h-24 w-full object-contain" />
						</div>
					{/if}
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  import { SignaturePad } from '$lib/components/ui/signature-pad';

  let pad = $state<ReturnType<typeof SignaturePad> | null>(null);
  let strokes = $state([]);
</script>

<SignaturePad bind:this={pad} bind:strokes />

<Button onclick={() => pad?.clear()}>Clear</Button>
<Button onclick={() => console.log(pad?.toSVG())}>Export</Button>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'signature-pad'}
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

		<DocPage.Heading>Exporting</DocPage.Heading>
		<DocPage.Text>
			The component exposes its methods through <code>bind:this</code>.
			<code>toSVG()</code> replays the recorded strokes as vector paths, so the result stays sharp
			at any size, while <code>toDataURL()</code> rasterises the canvas at the current device pixel ratio.
		</DocPage.Text>
		<DocPage.Code
			code={`pad.isEmpty();            // boolean
pad.clear();              // remove every stroke
pad.undo();               // remove the last stroke
pad.toDataURL();          // 'data:image/png;base64,...'
pad.toDataURL('image/jpeg', 0.9);
pad.toSVG();              // '<svg ...>...</svg>'
pad.toSVGDataURL();       // 'data:image/svg+xml;...'`}
		/>

		<DocPage.Heading>Pen and background</DocPage.Heading>
		<DocPage.Text>
			<code>penColor</code> defaults to <code>currentColor</code>, so the ink follows the theme. Set
			a
			<code>backgroundColor</code> when the export needs to be opaque.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-md space-y-3">
					<SignaturePad
						bind:this={colorPad}
						penColor="#2563eb"
						backgroundColor="#ffffff"
						minWidth={1}
						maxWidth={4}
						class="h-40"
					/>
					<div class="flex gap-2">
						<Button variant="outline" size="sm" onclick={() => colorPad?.clear()}>Clear</Button>
						<Button
							size="sm"
							onclick={() => download(colorPad?.toDataURL() ?? '', 'signature.png')}
						>
							<Download class="size-3.5" /> Download PNG
						</Button>
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<SignaturePad
  penColor="#2563eb"
  backgroundColor="#ffffff"
  minWidth={1}
  maxWidth={4}
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Stroke data</DocPage.Heading>
		<DocPage.Text>
			<code>strokes</code> is bindable and fully serialisable. Persist it to restore a signature later,
			or reset it to load one back in.
		</DocPage.Text>
		<DocPage.Code
			code={`// { color: string, points: { x: number, y: number, w: number }[] }[]
localStorage.setItem('signature', JSON.stringify(strokes));

strokes = JSON.parse(localStorage.getItem('signature') ?? '[]');`}
		/>
	</DocPage.Content>
</DocPage.Root>
