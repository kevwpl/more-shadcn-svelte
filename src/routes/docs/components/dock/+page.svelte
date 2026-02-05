<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as Dock from '$lib/components/ui/dock';
	import {
		Home,
		Search,
		Calendar,
		Mail,
		Settings,
		User,
		Code,
		Terminal,
		Github
	} from 'lucide-svelte';
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Dock</DocPage.Title>
		<DocPage.Description>
			A macOS-style dock with physics-based magnification, built with <code>svelte-motion</code>.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview>
				<Dock.Root>
					<Dock.Icon class="bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
						<Home class="size-5" />
					</Dock.Icon>
					<Dock.Icon class="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
						<Search class="size-5" />
					</Dock.Icon>
					<Dock.Icon class="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
						<Calendar class="size-5" />
					</Dock.Icon>
					<Dock.Icon class="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
						<Mail class="size-5" />
					</Dock.Icon>
					<Dock.Separator />
					<Dock.Icon class="bg-gray-50 text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
						<Settings class="size-5" />
					</Dock.Icon>
					<Dock.Icon class="bg-gray-50 text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
						<User class="size-5" />
					</Dock.Icon>
				</Dock.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Dock.Root>
  <Dock.Icon class="bg-indigo-100 text-indigo-600">
    <Home class="size-5" />
  </Dock.Icon>
  <Dock.Icon class="bg-blue-100 text-blue-600">
    <Search class="size-5" />
  </Dock.Icon>
  <Dock.Separator />
  <Dock.Icon>
    <User class="size-5" />
  </Dock.Icon>
</Dock.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'dock'}
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

		<DocPage.Heading>Image Icons</DocPage.Heading>
		<DocPage.Text>
			You can put <code>&lt;img&gt;</code> tags inside the Dock items to create a realistic launcher.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview>
				<Dock.Root magnification={80} distance={140} class="bg-secondary">
					<Dock.Icon class="bg-transparent hover:bg-transparent" transparent>
						<img src="/content/finder.png" alt="Finder" class="size-full object-contain" />
					</Dock.Icon>
					<Dock.Icon class="bg-transparent hover:bg-transparent" transparent>
						<img src="/content/safari.png" alt="Safari" class="size-full object-contain" />
					</Dock.Icon>
					<Dock.Icon class="bg-transparent hover:bg-transparent" transparent>
						<img src="/content/messages.png" alt="Messages" class="size-full object-contain" />
					</Dock.Icon>
					<Dock.Icon class="bg-transparent hover:bg-transparent" transparent>
						<img src="/content/mail.png" alt="Mail" class="size-full object-contain" />
					</Dock.Icon>
					<Dock.Icon class="bg-transparent hover:bg-transparent" transparent>
						<img src="/content/maps.png" alt="Maps" class="size-full object-contain" />
					</Dock.Icon>
					<Dock.Separator />
					<Dock.Icon class="bg-transparent hover:bg-transparent" transparent>
						<img src="/content/settings.png" alt="Settings" class="size-full object-contain" />
					</Dock.Icon>
				</Dock.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Dock.Root magnification={80}>
  <Dock.Icon class="bg-transparent" transparent>
     <img src="/icons/finder.png" class="size-full" />
  </Dock.Icon>
  <Dock.Icon class="bg-transparent" transparent>
     <img src="/icons/safari.png" class="size-full" />
  </Dock.Icon>
  ...
</Dock.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Tooltips</DocPage.Heading>
		<DocPage.Text>
			The <code>Icon</code> component wraps the standard Tooltip component internally. Just pass a
			<code>tooltip</code>
			string prop.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview>
				<Dock.Root>
					<Dock.Icon tooltip="GitHub">
						<Github class="size-5" />
					</Dock.Icon>
					<Dock.Icon tooltip="Terminal">
						<Terminal class="size-5" />
					</Dock.Icon>
					<Dock.Separator />
					<Dock.Icon tooltip="Settings">
						<Settings class="size-5" />
					</Dock.Icon>
				</Dock.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Dock.Root>
  <Dock.Icon tooltip="GitHub">
    <Github />
  </Dock.Icon>
  ...
</Dock.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
