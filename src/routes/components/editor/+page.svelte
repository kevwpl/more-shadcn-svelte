<script lang="ts">
	import { Editor } from '$lib/components/ui/editor';
	import * as DocPage from '$lib/components/feature/doc-page';
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Editor</DocPage.Title>
		<DocPage.Description
			>An inline markdown editor with live formatting as you type.</DocPage.Description
		>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview>
				<div class="w-full max-w-2xl mx-auto p-4">
					<Editor
						value={`# WelcomeType
**bold**, *italic* ,or \`code\` and see it render inline.
- List items work too
- Just like this`}
					/>
				</div>
			</DocPage.Preview>
			<DocPage.Code code={`<Editor />`} />
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'editor'}
		<DocPage.Text
			>Run the following command to install the `{componentName}` component:</DocPage.Text
		>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>

		<DocPage.Heading>How It Works</DocPage.Heading>
		<DocPage.Text>
			The editor renders markdown formatting in real-time as you type. Your raw text stays editable
			while a styled overlay shows the formatted result.
		</DocPage.Text>

		<DocPage.Heading>Supported Syntax</DocPage.Heading>

		<DocPage.Example>
			<DocPage.Preview>
				<div class="grid grid-cols-2 gap-4 p-6 text-sm">
					<div class="space-y-2">
						<div><code class="bg-muted px-2 py-1 rounded"># H1</code> Heading 1</div>
						<div><code class="bg-muted px-2 py-1 rounded">## H2</code> Heading 2</div>
						<div><code class="bg-muted px-2 py-1 rounded">### H3</code> Heading 3</div>
						<div><code class="bg-muted px-2 py-1 rounded">**bold**</code> Bold</div>
						<div><code class="bg-muted px-2 py-1 rounded">*italic*</code> Italic</div>
					</div>
					<div class="space-y-2">
						<div><code class="bg-muted px-2 py-1 rounded">- item</code> Bullet list</div>
						<div><code class="bg-muted px-2 py-1 rounded">1. item</code> Numbered list</div>
						<div><code class="bg-muted px-2 py-1 rounded">- [ ] task</code> Checkbox</div>
						<div><code class="bg-muted px-2 py-1 rounded">&gt; quote</code> Blockquote</div>
						<div><code class="bg-muted px-2 py-1 rounded">`code`</code> Inline code</div>
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`# Heading 1
## Heading 2
### Heading 3
**bold** *italic* ~~strikethrough~~
\`inline code\`
- Bullet item
1. Numbered item
- [ ] Todo
- [x] Done
> Quote
---`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Slash Commands</DocPage.Heading>
		<DocPage.Text>
			Type <code>/</code> at the start of a line to open the command menu. Disable with
			<code>enableSlashCommands={'{'}false{'}'}</code>.
		</DocPage.Text>

		<DocPage.Example>
			<DocPage.Preview>
				<div class="grid grid-cols-3 gap-3 p-6 text-sm">
					<div class="flex items-center gap-2">
						<span class="font-mono bg-muted px-2 py-1 rounded">H1</span> Heading 1
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono bg-muted px-2 py-1 rounded">H2</span> Heading 2
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono bg-muted px-2 py-1 rounded">H3</span> Heading 3
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono bg-muted px-2 py-1 rounded">•</span> Bullet List
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono bg-muted px-2 py-1 rounded">1.</span> Numbered List
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono bg-muted px-2 py-1 rounded">☐</span> To-do
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono bg-muted px-2 py-1 rounded">"</span> Quote
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono bg-muted px-2 py-1 rounded">&lt;/&gt;</span> Code Block
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono bg-muted px-2 py-1 rounded">—</span> Divider
					</div>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Editor enableSlashCommands={true} />
<Editor enableSlashCommands={false} />`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Without Slash Commands</DocPage.Heading>

		<DocPage.Example>
			<DocPage.Preview>
				<div class="w-full max-w-2xl mx-auto p-4">
					<Editor enableSlashCommands={false} placeholder="Plain markdown editing..." />
				</div>
			</DocPage.Preview>
			<DocPage.Code code={`<Editor enableSlashCommands={false} />`} />
		</DocPage.Example>

		<DocPage.Heading>Custom Placeholder</DocPage.Heading>

		<DocPage.Example>
			<DocPage.Preview>
				<div class="w-full max-w-2xl mx-auto p-4">
					<Editor placeholder="Write your thoughts..." />
				</div>
			</DocPage.Preview>
			<DocPage.Code code={`<Editor placeholder="Write your thoughts..." />`} />
		</DocPage.Example>

		<DocPage.Heading>Controlled Value</DocPage.Heading>

		<DocPage.Example>
			<DocPage.Preview>
				<div class="w-full max-w-2xl mx-auto p-4">
					<Editor value="# Controlled Content\n\nBind to `value` for two-way data binding." />
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<script lang="ts">
  let content = $state('# Hello');
</script>

<Editor bind:value={content} />`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
