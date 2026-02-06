<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as CompareSlider from '$lib/components/ui/compare-slider';
	import { Badge } from '$lib/components/ui/badge';
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Compare Slider</DocPage.Title>
		<DocPage.Description>
			Interactively reveal the difference between two overlapping layers.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Heading>Image Comparison</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="p-10">
				<CompareSlider.Root class="w-full max-w-lg aspect-video rounded-xl border shadow-sm">
					<CompareSlider.Item target="first">
						<img
							src="https://images.unsplash.com/photo-1764377725021-33bba9d00944?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt="First Image"
							class="object-cover pointer-events-none"
							draggable="false"
						/>
					</CompareSlider.Item>

					<CompareSlider.Item target="second">
						<img
							src="https://images.unsplash.com/photo-1764014588235-d339ae275f19?q=80&w=1538&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt="Second Image"
							class="object-cover pointer-events-none"
							draggable="false"
						/>
					</CompareSlider.Item>

					<CompareSlider.Handle />
				</CompareSlider.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<CompareSlider.Root class="aspect-video">
  <CompareSlider.Item target="first">
     <img src="/after.jpg" />
  </CompareSlider.Item>
  <CompareSlider.Item target="second">
     <img src="/before.jpg" />
  </CompareSlider.Item>
  <CompareSlider.Handle />
</CompareSlider.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Vertical Orientation</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="p-10">
				<CompareSlider.Root
					orientation="vertical"
					class="w-64 aspect-[3/4] rounded-xl border shadow-sm mx-auto"
				>
					<CompareSlider.Item target="first">
						<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
					</CompareSlider.Item>
					<CompareSlider.Item target="second">
						<div class="w-full h-full bg-slate-900 grayscale" />
					</CompareSlider.Item>
					<CompareSlider.Handle />
				</CompareSlider.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<CompareSlider.Root orientation="vertical">
   ...
</CompareSlider.Root>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>

<style>
	.drag-none {
		user-drag: none;
		-webkit-user-drag: none;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
</style>
