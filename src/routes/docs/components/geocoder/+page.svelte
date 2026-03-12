<script lang="ts">
	import * as Geocoder from '$lib/components/ui/geocoder';
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Check } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	let query = $state('');
	let loading = $state(false);
	let selectedLocation = $state<Geocoder.GeoLocation | null>(null);

	function onSelect(location: Geocoder.GeoLocation) {
		query = location.display_name;
	}

	const types = [
		{
			name: 'GeoLocation',
			description: 'Represents a geographical location returned by the geocoding API.',
			fields: [
				{
					name: 'address',
					type: 'Address',
					description: 'Detailed address components for the location.'
				},
				{
					name: 'boundingbox',
					type: 'string[]',
					description: 'Bounding box coordinates for the location.'
				},
				{
					name: 'class',
					type: 'string',
					description: 'Classification of the location (e.g., place, building).'
				},
				{
					name: 'display_name',
					type: 'string',
					description: 'Human-readable name of the location.'
				},
				{
					name: 'importance',
					type: 'number',
					description: 'Relevance score for the location result.'
				},
				{ name: 'lat', type: 'string', description: 'Latitude coordinate of the location.' },
				{ name: 'lon', type: 'string', description: 'Longitude coordinate of the location.' },
				{ name: 'place_id', type: 'string', description: 'Unique identifier for the location.' },
				{ name: 'type', type: 'string', description: 'Type of the location (e.g., city, road).' }
			]
		},
		{
			name: 'Address',
			description: 'Represents the address components of a geocoded location.',
			fields: [
				{ name: 'borough', type: 'string', description: 'Borough or administrative area.' },
				{ name: 'city', type: 'string', description: 'City component of the address.' },
				{
					name: 'country',
					type: 'string',
					description: 'Country name component of the address.'
				},
				{
					name: 'country_code',
					type: 'string',
					description: 'ISO 3166-1 alpha-2 country code.'
				},
				{ name: 'historic', type: 'string', description: 'Historic area or landmark.' },
				{
					name: 'house_number',
					type: 'string',
					description: 'House number component of the address.'
				},
				{
					name: 'ISO3166-2-lvl4',
					type: 'string',
					description:
						'ISO 3166-2 code for the administrative level 4 region (e.g., state, province).'
				},
				{
					name: 'neighbourhood',
					type: 'string',
					description: 'Neighbourhood or district component of the address.'
				},
				{ name: 'postcode', type: 'string', description: 'Postal code for the address.' },
				{
					name: 'road',
					type: 'string',
					description: 'Road or street name component of the address.'
				},
				{
					name: 'suburb',
					type: 'string',
					description: 'Suburb or locality component of the address.'
				}
			]
		}
	];
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Geocoder</DocPage.Title>
		<DocPage.Description>
			A geocoder component that provides search and autocomplete functionality for location-based
			queries. It can be used to find addresses, places, or points of interest based on user input.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="flex flex-col gap-4 min-h-[300px] items-center pt-10">
				<div class="w-full max-w-sm space-y-2">
					<label
						for="location-search"
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Find Location
					</label>

					<Geocoder.Root
						id="location-search"
						bind:value={query}
						bind:selected={selectedLocation}
						{loading}
						{onSelect}
					>
						{#snippet locationSnippet(location, isActive)}
							<div class="flex items-center gap-3 w-full">
								<div class="flex flex-col text-left">
									<span class="font-medium">
										<Geocoder.Highlight text={location.display_name} {query} />
									</span>
								</div>
								{#if isActive}
									<Check class="ml-auto h-4 w-4 opacity-50" />
								{/if}
							</div>
						{/snippet}

						{#snippet emptySnippet()}
							<div class="flex flex-col items-center gap-2 py-2">
								<span class="text-muted-foreground text-sm">No locations found.</span>
							</div>
						{/snippet}
					</Geocoder.Root>
				</div>
			</DocPage.Preview>

			<DocPage.Code
				code={`<Geocoder.Root
  id="location-search"
  bind:value
  {loading}
>
  {#snippet itemSnippet(user)}
    <Autocomplete.Highlight text={user.name} {query} />
  {/snippet}
</Geocoder.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Types</DocPage.Heading>
		<div class="rounded-lg border border-border bg-card overflow-hidden">
			<div class="overflow-auto max-h-80 w-full flex flex-col">
				{#each types as t, idx}
					<div
						class={cn(
							'flex flex-row w-full',
							idx < types.length - 1 ? 'border-b-2 border-border' : ''
						)}
					>
						<div class="w-1/3 p-4 border-r border-border">
							<div class="font-medium">{t.name}</div>
							<div class="text-sm text-muted-foreground">{t.description}</div>
						</div>
						<div class="w-2/3">
							{#each t.fields as field, i}
								<div
									class={cn(
										'flex flex-row w-full gap py-2 px-4 text-sm',
										i < t.fields.length - 1 ? 'border-b border-border' : '',
										i % 2 === 0 ? '' : 'bg-muted/50'
									)}
								>
									<div class="min-w-1/3 self-center">
										<span class="bg-muted py-1 px-1.5 rounded">{field.name}</span>
									</div>
									<div class="w-42 self-center font-mono text-blue-500">
										{field.type}
									</div>
									<div class="w-full self-center text-xs text-muted-foreground">
										{field.description}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'geocoder'}
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
