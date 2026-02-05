<script lang="ts">
	import * as Cursor from '$lib/components/ui/cursor';
	import { onMount } from 'svelte';

	let x = $state(0);
	let y = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			x = Math.sin(Date.now() / 2000) * 80;
			y = Math.cos(Date.now() / 2000) * 40;
		}, 16);
		return () => clearInterval(interval);
	});
</script>

<div
	class="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between h-full overflow-hidden"
>
	<div class="mb-4">
		<h3 class="font-semibold leading-none tracking-tight mb-1">Collaborative Cursor</h3>
		<p class="text-sm text-muted-foreground">Multiplayer presence for your app.</p>
	</div>

	<div
		class="relative flex-1 min-h-[160px] bg-muted/30 rounded-lg border border-dashed flex items-center justify-center"
	>
		<Cursor.Root x={60} y={40} color="#ea580c" name="Kevin" />

		<div class="absolute inset-0 flex items-center justify-center">
			<div style:transform="translate({x}px, {y}px)">
				<Cursor.Root x={0} y={0} color="#0ea5e9" name="Guest" message="Watching..." />
			</div>
		</div>

		<div class="text-[10px] text-muted-foreground uppercase font-medium tracking-widest opacity-50">
			Canvas Area
		</div>
	</div>
</div>
