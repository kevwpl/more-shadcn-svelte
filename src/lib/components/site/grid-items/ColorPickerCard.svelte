<script lang="ts">
	import * as ColorPicker from '$lib/components/ui/color-picker';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Paintbrush } from 'lucide-svelte';

	let color = $state('#f73c00');
</script>

<div class="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
	<div class="mb-4">
		<h3 class="font-semibold leading-none tracking-tight mb-1">Color Picker</h3>
		<p class="text-sm text-muted-foreground">Professional-grade color selection.</p>
	</div>

	<div class="flex items-center gap-4 justify-center">
		<div class="w-8 h-8 rounded-full border shadow-sm" style:background-color={color}></div>
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						class="w-[220px] justify-start text-left font-normal"
					>
						<Paintbrush class="mr-2 h-4 w-4" />
						{color}
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0 border-none shadow-none">
				<ColorPicker.Root bind:value={color} />
			</Popover.Content>
		</Popover.Root>
	</div>
</div>
