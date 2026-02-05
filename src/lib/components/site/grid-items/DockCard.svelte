<script lang="ts">
	import * as Dock from '$lib/components/ui/dock';
	import { Home, Search, Calendar, Mail, Settings, User } from 'lucide-svelte';
</script>

<div class="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
	<div class="mb-4">
		<h3 class="font-semibold leading-none tracking-tight mb-1">Dock</h3>
		<p class="text-sm text-muted-foreground">macOS-style magnification dock.</p>
	</div>

	<div class="flex items-end justify-center flex-1 pb-4">
		<Dock.Root>
			<Dock.Icon>
				<Home class="size-5" />
			</Dock.Icon>
			<Dock.Icon>
				<Search class="size-5" />
			</Dock.Icon>
			<Dock.Icon>
				<Calendar class="size-5" />
			</Dock.Icon>
			<Dock.Icon>
				<Mail class="size-5" />
			</Dock.Icon>
			<Dock.Separator />
			<Dock.Icon>
				<Settings class="size-5" />
			</Dock.Icon>
			<Dock.Icon>
				<User class="size-5" />
			</Dock.Icon>
		</Dock.Root>
	</div>
</div>
