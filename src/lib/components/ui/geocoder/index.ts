import Root from './geocoder.svelte';
import Highlight from './geocoder-highlight.svelte';
import {
	formatAddress,
	resolveConvention,
	COUNTRY_CONVENTIONS,
	DEFAULT_CONVENTION,
	type AddressConvention,
	type FormatAddressOptions
} from './format';

type GeoLocation = {
	/** Only present when the request was made with `addressdetails=1`. */
	address?: Address;
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
	svg?: string;
	type: string;
};

/**
 * Every field is conditional — Nominatim only returns the keys that apply to
 * the matched object and its administrative hierarchy.
 */
type Address = {
	'ISO3166-2-lvl4'?: string;
	borough?: string;
	city?: string;
	city_district?: string;
	country?: string;
	country_code?: string;
	county?: string;
	hamlet?: string;
	historic?: string;
	house_number?: string;
	municipality?: string;
	neighbourhood?: string;
	postcode?: string;
	road?: string;
	state?: string;
	state_district?: string;
	suburb?: string;
	town?: string;
	village?: string;
};

export {
	Root,
	Highlight,
	formatAddress,
	resolveConvention,
	COUNTRY_CONVENTIONS,
	DEFAULT_CONVENTION,
	type GeoLocation,
	type Address,
	type AddressConvention,
	type FormatAddressOptions
};
