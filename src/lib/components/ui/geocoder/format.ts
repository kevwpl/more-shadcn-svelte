import type { Address, GeoLocation } from './index';

/**
 * Address layouts differ along two independent axes: whether the house number
 * comes before or after the street, and whether the postcode comes before or
 * after the city. Three combinations cover essentially every Latin-script
 * convention in use.
 */
export type AddressConvention =
	/** `Musterstraße 12, 12345 Musterstadt` — most of Europe and Latin America. */
	| 'continental'
	/** `12 Rue de l'Exemple, 75000 Exempleville` — number first, postcode still before the city. */
	| 'french'
	/** `12 Example Street, Springfield 12345` — number first, postcode after the city. */
	| 'anglo';

export type FormatAddressOptions = {
	/** `auto` picks a convention from the result's country. */
	convention?: AddressConvention | 'auto';
	showCountry?: boolean;
};

/** Used for countries that are not mapped below. */
export const DEFAULT_CONVENTION: AddressConvention = 'anglo';

export const COUNTRY_CONVENTIONS: Record<string, AddressConvention> = {
	// Street then number, postcode then city.
	at: 'continental',
	de: 'continental',
	ch: 'continental',
	li: 'continental',
	nl: 'continental',
	be: 'continental',
	it: 'continental',
	es: 'continental',
	pt: 'continental',
	pl: 'continental',
	cz: 'continental',
	sk: 'continental',
	hu: 'continental',
	si: 'continental',
	hr: 'continental',
	rs: 'continental',
	ba: 'continental',
	me: 'continental',
	mk: 'continental',
	al: 'continental',
	bg: 'continental',
	ro: 'continental',
	gr: 'continental',
	tr: 'continental',
	se: 'continental',
	dk: 'continental',
	no: 'continental',
	fi: 'continental',
	is: 'continental',
	ee: 'continental',
	lv: 'continental',
	lt: 'continental',
	ru: 'continental',
	ua: 'continental',
	by: 'continental',
	br: 'continental',
	mx: 'continental',
	ar: 'continental',
	cl: 'continental',
	co: 'continental',
	pe: 'continental',
	uy: 'continental',
	id: 'continental',
	vn: 'continental',
	il: 'continental',

	// Number then street, postcode then city.
	fr: 'french',
	mc: 'french',
	lu: 'french',

	// Number then street, postcode after city.
	us: 'anglo',
	gb: 'anglo',
	ca: 'anglo',
	au: 'anglo',
	nz: 'anglo',
	ie: 'anglo',
	in: 'anglo',
	za: 'anglo',
	ph: 'anglo',
	my: 'anglo',
	sg: 'anglo',
	hk: 'anglo',
	ng: 'anglo',
	ke: 'anglo',
	pk: 'anglo',
	bd: 'anglo',
	lk: 'anglo'
};

/**
 * Nominatim reports the settlement under whichever key matches its
 * administrative level, so the first populated one wins.
 */
const CITY_KEYS = ['city', 'town', 'village', 'municipality', 'hamlet', 'suburb'] as const;

function pickCity(address: Address) {
	for (const key of CITY_KEYS) {
		const value = address[key];
		if (value) return value;
	}
	return undefined;
}

export function resolveConvention(
	address: Address | undefined,
	convention: AddressConvention | 'auto' = 'auto'
): AddressConvention {
	if (convention !== 'auto') return convention;

	const code = address?.country_code?.toLowerCase();
	return (code && COUNTRY_CONVENTIONS[code]) || DEFAULT_CONVENTION;
}

/**
 * Turns a Nominatim result into a compact, locally ordered address such as
 * `Musterstraße 12, 12345 Musterstadt, Austria`.
 *
 * Requires the request to have been made with `addressdetails=1`; without the
 * structured `address` object this falls back to the raw `display_name`.
 */
export function formatAddress(location: GeoLocation, options: FormatAddressOptions = {}): string {
	const { convention = 'auto', showCountry = true } = options;

	const fallback = location?.display_name ?? '';
	const address = location?.address;
	if (!address) return fallback;

	const resolved = resolveConvention(address, convention);
	const numberFirst = resolved !== 'continental';
	const postcodeFirst = resolved !== 'anglo';

	const street = address.road;
	const number = address.house_number;
	const city = pickCity(address);
	const postcode = address.postcode;

	const locality = (postcodeFirst ? [postcode, city] : [city, postcode]).filter(Boolean).join(' ');

	// Without a road this is a place rather than an address (a city, a landmark),
	// so lead with the object's own name — the first segment of display_name.
	let primary = street
		? (numberFirst ? [number, street] : [street, number]).filter(Boolean).join(' ')
		: fallback.split(',')[0].trim();

	// Guard against "Vienna, 1010 Vienna" when the name is the settlement itself.
	if (!street && locality && primary && locality.includes(primary)) primary = '';

	const parts = [primary, locality];
	if (showCountry && address.country) parts.push(address.country);

	return parts.filter(Boolean).join(', ') || fallback;
}
