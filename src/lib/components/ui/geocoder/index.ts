import Root from './geocoder.svelte';
import Highlight from './geocoder-highlight.svelte';

type GeoLocation = {
	address: Address;
	boundingbox: string[];
	class: string;
	display_name: string;
	importance: number;
	lat: string;
	licence: string;
	lon: string;
	osm_id: number;
	osm_type: string;
	place_id: number;
	svg: string;
	type: string;
};

type Address = {
	'ISO3166-2-lvl4': string;
	borough: string;
	city: string;
	country_code: string;
	country: string;
	historic: string;
	house_number: string;
	neighbourhood: string;
	postcode: string;
	road: string;
	suburb: string;
};

export { Root, Highlight, type GeoLocation, type Address };
