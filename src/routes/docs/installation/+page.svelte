<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Link } from '$lib/components/ui/link';
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Installation</DocPage.Title>
		<DocPage.Description>
			How to install and use components from the More Shadcn registry.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Heading>Prerequisites</DocPage.Heading>
		<DocPage.Text>
			This library is built specifically for Svelte 5 and <Link
				href="https://shadcn-svelte.com/"
				target="_blank">shadcn-svelte</Link
			>. Ensure you have a working Shadcn-Svelte project initialized.
		</DocPage.Text>
		<DocPage.Text>
			If you haven't started yet, follow the
			<Link href="https://shadcn-svelte.com/docs/installation" target="_blank">
				official installation guide
			</Link> to get up and running.
		</DocPage.Text>

		<DocPage.Heading>Automatic Installation</DocPage.Heading>
		<DocPage.Text>
			The easiest way to add components is via the Shadcn-Svelte CLI. Point the CLI to the
			component's remote JSON registry file.
		</DocPage.Text>
		<DocPage.PM
			command="execute"
			args={['shadcn-svelte@latest', 'add', 'https://more-shadcn.noair.fun/r/[component].json']}
		/>
		<DocPage.Text class="text-sm italic text-muted-foreground">
			Replace <code>[component]</code> with the name of the component (e.g., <code>stepper</code>).
		</DocPage.Text>

		<DocPage.Heading>Dependencies</DocPage.Heading>
		<DocPage.Text>
			Some components require additional libraries like <code>svelte-motion</code> or
			<code>lucide-svelte</code>. The CLI will attempt to install these automatically, but you can
			also add them manually if needed:
		</DocPage.Text>
		<DocPage.PM
			command="install"
			args={['svelte-motion', 'lucide-svelte', 'clsx', 'tailwind-merge']}
		/>

		<DocPage.Heading>Manual Installation</DocPage.Heading>
		<DocPage.Text>If you prefer to copy-paste the code manually:</DocPage.Text>

		<div class="space-y-6 mt-6">
			<div class="flex gap-4">
				<div
					class="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold"
				>
					1
				</div>
				<div class="space-y-1">
					<p class="font-medium leading-none">Create the component directory</p>
					<p class="text-sm text-muted-foreground">
						Create a folder inside your <code>$lib/components/ui</code> directory corresponding to the
						component name.
					</p>
				</div>
			</div>

			<div class="flex gap-4">
				<div
					class="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold"
				>
					2
				</div>
				<div class="space-y-1">
					<p class="font-medium leading-none">Copy the source code</p>
					<p class="text-sm text-muted-foreground">
						Copy the <code>.svelte</code> and <code>.ts</code> files from the GitHub repository into
						your newly created directory.
					</p>
				</div>
			</div>

			<div class="flex gap-4">
				<div
					class="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold"
				>
					3
				</div>
				<div class="space-y-1">
					<p class="font-medium leading-none">Update imports</p>
					<p class="text-sm text-muted-foreground">
						Ensure the internal imports point correctly to your project's aliases (usually <code
							>$lib</code
						>).
					</p>
				</div>
			</div>
		</div>

		<DocPage.Heading>That's it!</DocPage.Heading>
		<DocPage.Text>
			You are now ready to start using the expanded component library in your Svelte 5 apps.
		</DocPage.Text>
	</DocPage.Content>
</DocPage.Root>
