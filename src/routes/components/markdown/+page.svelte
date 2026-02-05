<script lang="ts">
	import { Markdown } from '$lib/components/ui/markdown';
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card } from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';

	let blogPost = $state(`# Building Scalable Systems

Managing state in large applications requires a mix of **local reactivity** and **global stores**. In Svelte 5, the introduction of runes simplifies this significantly.

## Key Takeaways
*   Use \`$state\` for simple values
*   Leverage \`$derived\` for computed logic
*   Always clean up listeners in \`$effect\`

---

> "Runes are the biggest shift in Svelte's history, and they're worth the learning curve." — *Lead Developer*

For more info, check the [Official Docs](https://svelte.dev).`);

	let comment =
		$state(`I really liked the part about **derived state**. It's much cleaner than the old \`$: \` syntax!

1. Faster
2. Explicit
3. Type-safe`);
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Markdown</DocPage.Title>
		<DocPage.Description>
			Render user-generated content, blog posts, or comments with optimized typography and safety.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="p-8 block h-auto">
				<Markdown content={blogPost} />
			</DocPage.Preview>
			<DocPage.Code
				code={`<Markdown \n  content={blogPost} \n  class="text-lg leading-relaxed"\n/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'markdown'}
		<DocPage.Text>
			Run the following command to install the `{componentName}` components:
		</DocPage.Text>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>
	</DocPage.Content>
</DocPage.Root>
