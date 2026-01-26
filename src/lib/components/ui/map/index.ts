import Map from "./map.svelte";
import Marker from "./marker.svelte";

export {
    Map as Root,
    Marker
};

export type LatLng = {
    lat: number;
    lng: number;
};

export type MapProviderName = 'google' | 'mapbox';

export interface MapProviderConfig {
    apiKey: string;
}