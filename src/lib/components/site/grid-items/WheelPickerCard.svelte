<script lang="ts">
	import * as WheelPicker from '$lib/components/ui/wheel-picker';

	let hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
	let minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
	let ampm = ['AM', 'PM'];

	let time = $state({ h: '09', m: '41', p: 'AM' });
</script>

<div class="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between h-full">
	<div class="mb-4">
		<h3 class="font-semibold leading-none tracking-tight mb-1">Wheel Picker</h3>
		<p class="text-sm text-muted-foreground">iOS-style drum selector.</p>
	</div>

	<div class="flex-1 flex items-center justify-center py-2">
		<div class="border rounded-xl overflow-hidden shadow-sm bg-background w-full max-w-[200px]">
			<WheelPicker.Root>
				<WheelPicker.Group bind:value={time.h} loop>
					{#each hours as h}
						<WheelPicker.Item value={h}>{h}</WheelPicker.Item>
					{/each}
				</WheelPicker.Group>

				<div class="flex items-center justify-center text-muted-foreground pb-1 font-bold">:</div>

				<WheelPicker.Group bind:value={time.m} loop>
					{#each minutes as m}
						<WheelPicker.Item value={m}>{m}</WheelPicker.Item>
					{/each}
				</WheelPicker.Group>

				<WheelPicker.Group bind:value={time.p}>
					{#each ampm as p}
						<WheelPicker.Item value={p}>{p}</WheelPicker.Item>
					{/each}
				</WheelPicker.Group>
			</WheelPicker.Root>
		</div>
	</div>

	<div class="mt-4 flex items-center justify-center gap-2">
		<span class="text-xs font-medium px-2 py-1 rounded bg-secondary">
			Selected: {time.h}:{time.m}
			{time.p}
		</span>
	</div>
</div>
