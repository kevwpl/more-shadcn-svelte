<script lang="ts">
	import type { LatLng } from '.';
	import type { MapInstance } from './mapInstance';

	let {
		map,
		position = { lat: 0, lng: 0 },
		...restProps
	}: {
		map: MapInstance;
		position?: LatLng;
	} = $props();

	$effect(() => {
		map.addMarker(position);
	});
</script>
