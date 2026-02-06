<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as Choicebox from '$lib/components/ui/choicebox';
	import { Label } from '$lib/components/ui/label';
	import { Sun, Moon, Monitor, Laptop, Smartphone, Tablet } from 'lucide-svelte';
	import { setMode } from 'mode-watcher';

	let selectedValue = $state('option-1');
	let planValue = $state('pro');
	let themeValue: 'system' | 'light' | 'dark ' = $state('system');

	function onThemeChange(val: string) {
		setMode(val as 'system' | 'light' | 'dark');
	}
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Choicebox</DocPage.Title>
		<DocPage.Description>A visual radio group for selecting complex options.</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Heading>Basic Usage</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-[600px] space-y-4">
					<Label>Select an option</Label>
					<Choicebox.Root bind:value={selectedValue} class="grid gap-4">
						<Choicebox.Item value="option-1" class="group items-center justify-between">
							<div class="space-y-1">
								<Choicebox.Title>
									Option 1
									<span class="text-xs font-normal text-muted-foreground ml-1"
										>(the first option)</span
									>
								</Choicebox.Title>
								<Choicebox.Description>This is the first option</Choicebox.Description>
							</div>
							<Choicebox.Indicator />
						</Choicebox.Item>
						<Choicebox.Item value="option-2" class="group items-center justify-between">
							<div class="space-y-1">
								<Choicebox.Title>
									Option 2
									<span class="text-xs font-normal text-muted-foreground ml-1"
										>(the second option)</span
									>
								</Choicebox.Title>
								<Choicebox.Description>This is the second option</Choicebox.Description>
							</div>
							<Choicebox.Indicator />
						</Choicebox.Item>
					</Choicebox.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Choicebox.Root bind:value={val}>
  <Choicebox.Item value="1" class="group justify-between">
    ...content
    <Choicebox.Indicator />
  </Choicebox.Item>
</Choicebox.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'choicebox'}
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

		<DocPage.Heading>Grid Layout</DocPage.Heading>
		<DocPage.Text
			>Use CSS grid classes on the <code>Root</code> to create horizontal card layouts.</DocPage.Text
		>
		<DocPage.Example>
			<DocPage.Preview>
				<div class="space-y-4 p-6">
					<Label>Choose a Plan</Label>
					<Choicebox.Root bind:value={planValue} class="grid grid-cols-1 sm:grid-cols-3 gap-2">
						<Choicebox.Item value="basic" class="group flex-col items-start gap-4 h-full">
							<div class="flex w-full items-center justify-between">
								<Choicebox.Title>Basic</Choicebox.Title>
								<Choicebox.Indicator />
							</div>
							<Choicebox.Description>
								Essential features for individuals starting out.
								<span class="block mt-2 font-medium text-foreground">$10/mo</span>
							</Choicebox.Description>
						</Choicebox.Item>

						<Choicebox.Item value="pro" class="group flex-col items-start gap-4 h-full">
							<div class="flex w-full items-center justify-between">
								<Choicebox.Title>Pro</Choicebox.Title>
								<Choicebox.Indicator />
							</div>
							<Choicebox.Description>
								Perfect for growing teams and businesses.
								<span class="block mt-2 font-medium text-foreground">$29/mo</span>
							</Choicebox.Description>
						</Choicebox.Item>

						<Choicebox.Item value="enterprise" class="group flex-col items-start gap-4 h-full">
							<div class="flex w-full items-center justify-between">
								<Choicebox.Title>Enterprise</Choicebox.Title>
								<Choicebox.Indicator />
							</div>
							<Choicebox.Description>
								Advanced features and support.
								<span class="block mt-2 font-medium text-foreground">Custom</span>
							</Choicebox.Description>
						</Choicebox.Item>
					</Choicebox.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Choicebox.Root class="grid grid-cols-3 gap-4">
  <Choicebox.Item value="basic" class="flex-col items-start">
     <div class="flex justify-between w-full">
        <Choicebox.Title>Basic</Choicebox.Title>
        <Choicebox.Indicator />
     </div>
     <Choicebox.Description>...</Choicebox.Description>
  </Choicebox.Item>
  ...
</Choicebox.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Visual Selection</DocPage.Heading>
		<DocPage.Text
			>Combine icons, images and hidden indicators for a polished "Theme Selector" style interface.</DocPage.Text
		>
		<DocPage.Example>
			<DocPage.Preview class="py-10">
				<div class="w-full max-w-[600px] space-y-4">
					<Label>Appearance</Label>
					<Choicebox.Root
						bind:value={themeValue}
						onValueChange={onThemeChange}
						class="grid grid-cols-3 gap-4"
					>
						<Choicebox.Item value="light" class="p-2 overflow-hidden flex flex-col gap-0">
							<img src="/content/Light.png" alt="Light Mode" class="w-full h-full" />
							<Choicebox.Title class="p-2 pb-0 w-full text-center">Light</Choicebox.Title>
							<div class="sr-only"><Choicebox.Indicator /></div>
						</Choicebox.Item>

						<Choicebox.Item value="dark" class="p-2 overflow-hidden flex flex-col gap-0">
							<img src="/content/Dark.png" alt="Dark Mode" class="w-full h-auto" />
							<Choicebox.Title class="p-2 pb-0 w-full text-center">Dark</Choicebox.Title>
							<div class="sr-only"><Choicebox.Indicator /></div>
						</Choicebox.Item>

						<Choicebox.Item value="system" class="p-2 overflow-hidden flex flex-col gap-0">
							<img src="/content/System.png" alt="System" class="w-full h-auto" />
							<Choicebox.Title class="p-2 pb-0 w-full text-center">System</Choicebox.Title>
							<div class="sr-only"><Choicebox.Indicator /></div>
						</Choicebox.Item>
					</Choicebox.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Choicebox.Root {onThemeChange} class="grid grid-cols-3 gap-4">
  <Choicebox.Item value="light" class="p-2 overflow-hidden flex flex-col gap-0">
    <img src="light.png" alt="Light Mode" class="w-full h-full" />
    <Choicebox.Title class="p-2 pb-0 w-full text-center">Light</Choicebox.Title>
    <div class="sr-only"><Choicebox.Indicator /></div>
  </Choicebox.Item>
  ...
</Choicebox.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
