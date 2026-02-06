<script lang="ts">
	import { Knob } from '$lib/components/ui/knob';

	let vol = $state(65);
	let pan = $state(0);
	let tune = $state(12);
</script>

<div class="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between h-full">
	<div class="mb-4">
		<h3 class="font-semibold leading-none tracking-tight mb-1">Knob</h3>
		<p class="text-sm text-muted-foreground">Tactile dial for precise input.</p>
	</div>

	<div class="flex-1 flex items-center justify-center">
		<div class="flex items-center gap-6 rounded-2xl border bg-muted/20 p-6 shadow-inner">
			<Knob label="Vol" bind:value={vol} defaultValue={0} size={50} />
			<Knob
				label="Pan"
				bind:value={pan}
				min={-50}
				max={50}
				defaultValue={0}
				size={50}
				color="oklch(0.722 0.133 226.54)"
			/>
			<Knob
				label="Tune"
				bind:value={tune}
				min={-24}
				max={24}
				defaultValue={0}
				size={50}
				color="var(--destructive)"
			/>
		</div>
	</div>

	<div class="mt-4 flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
		<span>Output: {vol}%</span>
		<span>Phase: Normal</span>
	</div>
</div>
