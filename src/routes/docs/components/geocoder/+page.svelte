<script lang="ts">
	import * as Geocoder from '$lib/components/ui/geocoder';
	import * as DocPage from '$lib/components/feature/doc-page';
	import { Check, MapPin } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	let query = $state('');
	let loading = $state(false);
	let selectedLocation = $state<Geocoder.GeoLocation | null>(null);

	let fullQuery = $state('');
	let customQuery = $state('');

	const conventions = [
		{ name: 'continental', example: 'Musterstraße 12, 12345 Musterstadt, Austria' },
		{ name: 'french', example: "12 Rue de l'Exemple, 75000 Exempleville, France" },
		{ name: 'anglo', example: '12 Example Street, Springfield 12345, United States' }
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
					>
						{#snippet emptySnippet()}
							<div class="flex flex-col items-center gap-2 py-2">
								<span class="text-muted-foreground text-sm">No locations found.</span>
							</div>
						{/snippet}
					</Geocoder.Root>

					{#if selectedLocation}
						<p class="text-xs text-muted-foreground">
							{selectedLocation.lat}, {selectedLocation.lon}
						</p>
					{/if}
				</div>
			</DocPage.Preview>

			<DocPage.Code
				code={`<script lang="ts">
  import * as Geocoder from '$lib/components/ui/geocoder';

  let query = $state('');
  let selected = $state<Geocoder.GeoLocation | null>(null);
</script>

<Geocoder.Root bind:value={query} bind:selected={selected} />`}
			/>
		</DocPage.Example>

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

		<DocPage.Heading>Result labels</DocPage.Heading>
		<DocPage.Text>
			Nominatim's <code>display_name</code> is the complete administrative hierarchy, which is rarely
			what you want to show:
		</DocPage.Text>
		<DocPage.Code
			code={`12, Musterstraße, Katastralgemeinde Musterdorf, Musterdorf,
Musterstadt, Bezirk Mustertal, Musterregion, 12345, Austria`}
		/>
		<DocPage.Text>
			By default the geocoder requests <code>addressdetails=1</code> and assembles a compact address
			from the structured fields instead — street, settlement and country only. Set
			<code>format="full"</code> to go back to the raw string, or pass a function for anything else.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="flex flex-col gap-4 min-h-[300px] items-center pt-10">
				<div class="w-full max-w-sm space-y-2">
					<span class="text-sm font-medium">format="full"</span>
					<Geocoder.Root
						bind:value={fullQuery}
						format="full"
						placeholder="Search for a street or city..."
					/>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<!-- compact, the default -->
<Geocoder.Root bind:value={query} />

<!-- the raw display_name -->
<Geocoder.Root bind:value={query} format="full" />

<!-- your own string -->
<Geocoder.Root
  bind:value={query}
  format={(loc) => \`\${loc.address?.road ?? ''} — \${loc.lat}, \${loc.lon}\`}
/>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Ordering</DocPage.Heading>
		<DocPage.Text>
			Address layout differs by country along two axes: whether the house number comes before or
			after the street, and whether the postcode comes before or after the city. Each result is
			ordered using its own <code>country_code</code>, so a mixed result list stays correct.
		</DocPage.Text>
		<div class="rounded-lg border border-border bg-card overflow-hidden text-sm">
			{#each conventions as c, i}
				<div
					class={cn('flex gap-4 px-4 py-2', i < conventions.length - 1 && 'border-b border-border')}
				>
					<span class="w-28 shrink-0 font-mono text-blue-500">{c.name}</span>
					<span class="text-muted-foreground">{c.example}</span>
				</div>
			{/each}
		</div>
		<DocPage.Text>
			Countries that are not mapped fall back to <code>anglo</code>. Pass <code>convention</code> to
			force one layout everywhere regardless of the result's country.
		</DocPage.Text>
		<DocPage.Code
			code={`<Geocoder.Root convention="continental" />
<Geocoder.Root showCountry={false} />

<!-- localise the place names too -->
<Geocoder.Root language="en" />`}
		/>

		<DocPage.Heading>Custom rendering</DocPage.Heading>
		<DocPage.Text>
			Pass a <code>locationSnippet</code> to take over the markup of each result. The
			<code>formatAddress</code> helper is exported, so you can still reuse the label logic — here it
			builds a two line entry with the street on top and the country muted underneath.
		</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="flex flex-col gap-4 min-h-[300px] items-center pt-10">
				<div class="w-full max-w-sm space-y-2">
					<Geocoder.Root bind:value={customQuery} placeholder="Search for a street or city...">
						{#snippet locationSnippet(location, isActive)}
							<div class="flex w-full items-center gap-3">
								<MapPin class="size-4 shrink-0 text-muted-foreground" />
								<div class="flex min-w-0 flex-col text-left">
									<span class="truncate font-medium">
										<Geocoder.Highlight
											text={Geocoder.formatAddress(location, { showCountry: false })}
											query={customQuery}
										/>
									</span>
									<span class="truncate text-xs text-muted-foreground">
										{location.address?.country ?? location.type}
									</span>
								</div>
								{#if isActive}
									<Check class="ml-auto size-4 shrink-0 opacity-50" />
								{/if}
							</div>
						{/snippet}
					</Geocoder.Root>
				</div>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Geocoder.Root bind:value={query}>
  {#snippet locationSnippet(location, isActive)}
    <Geocoder.Highlight
      text={Geocoder.formatAddress(location, { showCountry: false })}
      {query}
    />
    <span class="text-xs text-muted-foreground">
      {location.address?.country}
    </span>
  {/snippet}
</Geocoder.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Usage policy</DocPage.Heading>
		<DocPage.Text>
			The default provider is the public Nominatim instance, whose usage policy asks for an
			identifying <code>User-Agent</code> or <code>Referer</code>, caps requests at one per second
			and forbids heavy use. For anything beyond light traffic, proxy the request through your own
			backend or run your own Nominatim instance.
		</DocPage.Text>
	</DocPage.Content>
</DocPage.Root>
