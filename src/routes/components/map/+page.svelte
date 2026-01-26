<script lang="ts">
	import * as Map from '$lib/components/ui/map';
	import * as DocPage from '$lib/components/feature/doc-page';
	import { MapInstance } from '$lib/components/ui/map/mapInstance';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

	const mapOptions = {
		center: { lat: 40.7128, lng: -74.006 },
		zoom: 2
	};

	const map = new MapInstance({
		provider: 'google',
		apiKey: PUBLIC_GOOGLE_MAPS_API_KEY
	});
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Map</DocPage.Title>
		<DocPage.Description
			>A multi-target Map rendering component. Currently supports Google Maps and Mapbox.</DocPage.Description
		>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="flex flex-col gap-4 min-h-[300px] items-center overflow-hidden">
				<div class="w-full h-full">
					<Map.Root {map} options={mapOptions}>
						<Map.Marker {map} position={{ lat: 40.7128, lng: -74.006 }} />
					</Map.Root>
				</div>
			</DocPage.Preview>

			<DocPage.Code
				code={`<script lang="ts">
  import * as Map from '$lib/components/ui/map';
  import { MapInstance } from '$lib/components/ui/map/mapInstance';

  const map = new MapInstance({
    provider: 'google',
    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
  });
<\/script>

<Map.Root
  id="map"
  options={{
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 2
  }}
>
  <Map.Marker position={{ lat: 40.7128, lng: -74.006 }} />
</Map.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'map'}
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
