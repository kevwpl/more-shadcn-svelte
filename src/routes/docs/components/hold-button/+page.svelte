<script lang="ts">
	import { HoldButton } from '$lib/components/ui/hold-button';
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Trash2, AlertTriangle, Fingerprint, Power, RotateCcw } from 'lucide-svelte';

	let status = $state('Idle');
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Hold Button</DocPage.Title>
		<DocPage.Description>
			A button that requires a long press to trigger an action.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview>
				<div class="flex flex-col items-center justify-center gap-6 py-10">
					{#if status !== 'Deleted!'}
						<HoldButton
							duration={1500}
							variant="destructive"
							fillColor="bg-black/20"
							onComplete={() => (status = 'Deleted!')}
							onmousedown={() => (status = 'Holding...')}
							onmouseup={() => (status === 'Holding...' ? (status = 'Cancelled') : null)}
						>
							<Trash2 class="w-4 h-4" />
							Hold to Delete
						</HoldButton>
					{:else}
						<HoldButton
							duration={1000}
							variant="outline"
							fillColor="bg-black/10"
							onComplete={() => (status = 'Idle')}
						>
							<RotateCcw class="w-4 h-4" />
							Reset
						</HoldButton>
					{/if}

					<p class="text-muted-foreground">
						{#if status === 'Deleted!'}
							...
						{:else if status === 'Holding...'}
							Nooo!
						{:else if status === 'Cancelled'}
							Good, you've changed your mind.
						{:else}
							Hello, I am a text, please dont delete me!
						{/if}
					</p>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<HoldButton
  variant="destructive"
  duration={1500}
  fillColor="bg-black/40"
  onComplete={() => console.log("Action Triggered")}
>
  Hold to Delete
</HoldButton>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'hold-button'}
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

		<DocPage.Heading>Styling Variants</DocPage.Heading>
		<DocPage.Text>
			Customize the <code>fillColor</code> to ensure contrast against your button variant.
		</DocPage.Text>

		<DocPage.Example>
			<DocPage.Preview>
				<div class="flex justify-center gap-8 py-10">
					<div class="flex flex-col items-center gap-2">
						<HoldButton duration={1000} variant="outline" fillColor="bg-emerald-500/20" from="left">
							<Fingerprint class="w-4 h-4 mr-2" />
							Confirm (1s)
						</HoldButton>
						<span class="text-xs text-muted-foreground">Emerald on Outline</span>
					</div>

					<div class="flex flex-col items-center gap-2">
						<HoldButton
							duration={2000}
							variant="ghost"
							class="hover:bg-muted"
							fillColor="bg-primary/10"
						>
							<Power class="w-4 h-4 mr-2" />
							Power Off
						</HoldButton>
						<span class="text-xs text-muted-foreground">Ghost Button</span>
					</div>

					<div class="flex flex-col items-center gap-2">
						<HoldButton duration={3000} variant="secondary" fillColor="bg-amber-500/20" from="top">
							<AlertTriangle class="w-4 h-4 mr-2" />
							Reset (3s)
						</HoldButton>
						<span class="text-xs text-muted-foreground">Long Warning</span>
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<!-- Emerald Fill -->
<HoldButton variant="outline" fillColor="bg-emerald-500/20" from="left" ... />

<!-- Primary Fill -->
<HoldButton variant="ghost" fillColor="bg-primary/10" ... />

<!-- Warning Fill -->
<HoldButton variant="secondary" fillColor="bg-amber-500/20" from="top" ... />`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
