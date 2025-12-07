<script lang="ts">
	import { VerifyHuman } from '$lib/components/ui/verify-human';
	import * as DocPage from '$lib/components/feature/doc-page';
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Verify Human</DocPage.Title>
		<DocPage.Description>
			A self-contained heuristic bot protection component. It uses honeypots, velocity checks, and
			event trust analysis.
		</DocPage.Description>
	</DocPage.Header>
	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview>
				<VerifyHuman />
			</DocPage.Preview>
			<DocPage.Code code={`<VerifyHuman bind:verified={isVerified} onVerify={() => { ... }}/>`} />
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'verify-human'}
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
