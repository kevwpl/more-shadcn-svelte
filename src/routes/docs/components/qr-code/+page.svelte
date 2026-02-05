<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as QRCode from '$lib/components/ui/qr-code';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Download } from 'lucide-svelte';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>QR Code</DocPage.Title>
		<DocPage.Description>
			A vector-based QR generator with support for colors and logos.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Heading>Basic Usage</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="flex flex-col items-center gap-6 py-10">
				<QRCode.Root value={'https://shadcn-svelte.com'} size={150} />
			</DocPage.Preview>
			<DocPage.Code code={`<QRCode.Root value="https://shadcn-svelte.com" />`} />
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'qr-code'}
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

		<DocPage.Heading>Custom Colors</DocPage.Heading>
		<DocPage.Text>You can customize both the module color and the background color.</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview>
				<div class="flex gap-4">
					<div class="bg-zinc-950 p-4 rounded-xl">
						<QRCode.Root
							value="https://github.com"
							color="#ffffff"
							backgroundColor="#09090b"
							margin={1}
						/>
					</div>

					<div class="bg-blue-50 p-4 rounded-xl">
						<QRCode.Root
							value="https://twitter.com"
							color="#2563eb"
							backgroundColor="#eff6ff"
							margin={0}
						/>
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<QRCode.Root
  value="github.com"
  color="#ffffff"
  backgroundColor="#000000"
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>With Logo</DocPage.Heading>
		<DocPage.Text>
			You can embed an image string or a snippet in the center.
			<strong>Note:</strong> Set <code>errorCorrection="H"</code> (High) when using logos to ensure the
			code remains scannable.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<QRCode.Root
					value="https://svelte.dev"
					size={200}
					errorCorrection="H"
					logo="https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg"
					logoSize={0.25}
				/>
			</DocPage.Preview>
			<DocPage.Code
				code={`<QRCode.Root
  value="https://svelte.dev"
  errorCorrection="H"
  logo="/svelte-logo.svg"
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>With Snippet Logo</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="bg-white p-4 rounded-lg border shadow-sm">
					<QRCode.Root value="https://github.com/shadcn" size={180} errorCorrection="Q">
						{#snippet logo()}
							<Avatar class="h-full w-full">
								<AvatarImage src="https://github.com/shadcn.png" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						{/snippet}
					</QRCode.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<QRCode.Root value="...">
  {#snippet logo()}
     <Avatar>...</Avatar>
  {/snippet}
</QRCode.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
