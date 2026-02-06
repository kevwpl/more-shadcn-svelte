<script lang="ts">
	import * as CompareSlider from '$lib/components/ui/compare-slider';
</script>

<div class="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between h-full">
	<div class="mb-4">
		<h3 class="font-semibold leading-none tracking-tight mb-1">Compare Slider</h3>
		<p class="text-sm text-muted-foreground">Reveal differences between layers.</p>
	</div>

	<div class="flex items-center justify-center flex-1">
		<CompareSlider.Root
			class="w-full aspect-video rounded-lg border shadow-sm overflow-hidden bg-muted"
		>
			<CompareSlider.Item target="first">
				<img
					src="https://images.unsplash.com/photo-1764377725021-33bba9d00944?q=80&w=600&auto=format&fit=crop"
					alt="First"
					class="object-cover w-full h-full pointer-events-none select-none"
					draggable="false"
				/>
			</CompareSlider.Item>

			<CompareSlider.Item target="second">
				<img
					src="https://images.unsplash.com/photo-1764014588235-d339ae275f19?q=80&w=600&auto=format&fit=crop"
					alt="Second"
					class="object-cover w-full h-full pointer-events-none select-none grayscale"
					draggable="false"
				/>
			</CompareSlider.Item>

			<CompareSlider.Handle />
		</CompareSlider.Root>
	</div>
</div>
