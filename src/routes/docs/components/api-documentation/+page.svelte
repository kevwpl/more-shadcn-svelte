<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import ApiDocumentation from '$lib/components/ui/api-documentation/api-documentation.svelte';
	import { defineAPI } from '$lib/components/ui/api-documentation';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const buttonAPI = defineAPI('Button', 'Button API')
		.component('Button', 'Main button component', (component) =>
			component
				.prop('variant', '"primary" | "secondary"', {
					description: 'Visual style of the button',
					defaultValue: 'primary',
					optional: true
				})
				.prop('disabled', 'boolean', {
					description: 'Disables user interaction',
					defaultValue: false,
					optional: true,
					bindable: true
				})
				.prop('children', 'Snippet', {
					description: 'Rendered inner content',
					optional: true
				})
		)
		.snippet('icon', 'Optional icon renderer', (snippet) =>
			snippet.param('size', 'number', {
				description: 'Requested icon size',
				defaultValue: 16,
				optional: true
			})
		)
		.function('focusButton', 'Focuses a button element', (fn) =>
			fn
				.param('el', 'HTMLButtonElement', {
					description: 'Button element to focus'
				})
				.returns('void')
		)
		.class('ButtonController', 'Imperative controller API', (cls) =>
			cls
				.field('active', 'boolean', {
					description: 'Current active state',
					defaultValue: false
				})
				.method('toggle', '() => void', {
					description: 'Toggles the active state'
				})
		)
		.build();
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>API Documentation</DocPage.Title>
		<DocPage.Description>
			An auto-generated API reference table for all components, snippets and utilities.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<Separator class="my-6" />
			<DocPage.Preview class="relative h-full w-full overflow-x-scroll bg-muted/30">
				<ApiDocumentation api={buttonAPI} />
			</DocPage.Preview>
		</DocPage.Example>
		<!-- <Separator class="my-6" /> -->
		<DocPage.Code
			class="rounded"
			lang="typescript"
			code={`import { defineAPI } from '$lib/components/ui/api-documentation';
const buttonAPI = defineAPI('Button', 'Button API')
    .component('Button', 'Main button component', (component) =>
        component
            .prop('variant', '"primary" | "secondary"', {
                description: 'Visual style of the button',
                defaultValue: 'primary',
                optional: true
            })
            .prop('disabled', 'boolean', {
                description: 'Disables user interaction',
                defaultValue: false,
                optional: true,
                bindable: true
            })
            .prop('children', 'Snippet', {
                description: 'Rendered inner content',
                optional: true
            })
    )
    .snippet('icon', 'Optional icon renderer', (snippet) =>
        snippet.param('size', 'number', {
            description: 'Requested icon size',
            defaultValue: 16,
            optional: true
        })
    )
    .function('focusButton', 'Focuses a button element', (fn) =>
        fn
            .param('el', 'HTMLButtonElement', {
                description: 'Button element to focus'
            })
            .returns('void')
    )
    .class('ButtonController', 'Imperative controller API', (cls) =>
        cls
            .field('active', 'boolean', {
                description: 'Current active state',
                defaultValue: false
            })
            .method('toggle', '() => void', {
                description: 'Toggles the active state'
            })
    )
    .build();`}
		/>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'api-documentation'}
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
	</DocPage.Content>
</DocPage.Root>
