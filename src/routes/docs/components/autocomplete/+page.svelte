<script lang="ts">
	import * as Autocomplete from '$lib/components/ui/autocomplete';
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Check } from 'lucide-svelte';

	// --- Mock Data ---
	type User = { id: string; name: string; email: string; role: string };
	const allUsers: User[] = [
		{ id: '1', name: 'Kevin Wippel', email: 'kevin@example.com', role: 'Admin' },
		{ id: '2', name: 'Alice Smith', email: 'alice@example.com', role: 'Editor' },
		{ id: '3', name: 'Bob Jones', email: 'bob@test.com', role: 'User' },
		{ id: '4', name: 'Charlie Brown', email: 'charlie@peanuts.com', role: 'User' }
	];

	let query = $state('');
	let loading = $state(false);
	let filteredUsers = $state<User[]>([]);
	let selectedUser = $state<User | null>(null);

	let timer: number;

	$effect(() => {
		const q = query;

		clearTimeout(timer);
		loading = true;

		timer = setTimeout(() => {
			if (!q) {
				filteredUsers = [];
				loading = false;
				return;
			}

			// Perform filter using the local 'q' variable
			filteredUsers = allUsers.filter(
				(u) =>
					u.name.toLowerCase().includes(q.toLowerCase()) ||
					u.email.toLowerCase().includes(q.toLowerCase())
			);
			loading = false;
		}, 500);

		// Cleanup
		return () => clearTimeout(timer);
	});

	function onSelect(user: User) {
		query = user.name;
	}
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Autocomplete</DocPage.Title>
		<DocPage.Description>
			A lightweight, async-ready combobox with result highlighting and custom rendering.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="flex flex-col gap-4 min-h-[300px] items-center pt-10">
				<div class="w-full max-w-sm space-y-2">
					<label
						for="user-search"
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Find User
					</label>

					<Autocomplete.Root
						id="user-search"
						bind:value={query}
						bind:selected={selectedUser}
						options={filteredUsers}
						{loading}
						placeholder="Type 'Kevin' or 'Bob'..."
						{onSelect}
					>
						{#snippet itemSnippet(user)}
							<div class="flex items-center gap-3 w-full">
								<Avatar class="h-8 w-8">
									<AvatarFallback>{user.name[0]}</AvatarFallback>
								</Avatar>
								<div class="flex flex-col text-left">
									<span class="font-medium">
										<Autocomplete.Highlight text={user.name} {query} />
									</span>
									<span class="text-xs text-muted-foreground">
										<Autocomplete.Highlight text={user.email} {query} />
									</span>
								</div>
								{#if selectedUser?.id === user.id}
									<Check class="ml-auto h-4 w-4 opacity-50" />
								{/if}
							</div>
						{/snippet}

						{#snippet emptySnippet()}
							<div class="flex flex-col items-center gap-2 py-2">
								<span class="text-muted-foreground text-sm">No users found.</span>
							</div>
						{/snippet}
					</Autocomplete.Root>
				</div>
			</DocPage.Preview>

			<DocPage.Code
				code={`<Autocomplete.Root
  id="user-search"
  bind:value={query}
  options={filteredUsers}
  {loading}
>
  {#snippet itemSnippet(user)}
    <Autocomplete.Highlight text={user.name} {query} />
  {/snippet}
</Autocomplete.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'autocomplete'}
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
