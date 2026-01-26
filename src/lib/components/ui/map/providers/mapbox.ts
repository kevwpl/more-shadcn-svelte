import type { MapProvider } from '../provider';
import type { LatLng } from '../index';

export default class MapboxProvider implements MapProvider {
    private map!: any;
    private mapbox!: any;

    constructor(private apiKey: string) { }

    async mount(container: HTMLElement) {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const mapboxgl = await import('mapbox-gl');

                mapboxgl.default.accessToken = this.apiKey;
                this.mapbox = mapboxgl.default;

                this.map = new mapboxgl.default.Map({
                    container,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [0, 0],
                    zoom: 8
                });
                this.map.on('load', () => resolve(true));
            } catch (error) {
                return reject(false);
            }
        });
    }

    setCenter({ lat, lng }: LatLng) {
        this.map.setCenter([lng, lat]);
    }

    addMarker({ lat, lng }: LatLng) {
        new this.mapbox.Marker()
            .setLngLat([lng, lat])
            .addTo(this.map);
    }

    destroy() {
        this.map.remove();
    }
}