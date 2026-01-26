import type { MapProvider } from '../provider';
import type { LatLng } from '../index';

export default class GoogleProvider implements MapProvider {
    private map!: google.maps.Map;
    private markers: google.maps.marker.AdvancedMarkerElement[] = [];
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async mount(container: HTMLElement) {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                if (!(window as any).google?.maps) {
                    await this.loadScript();
                }

                this.map = new google.maps.Map(container, {
                    center: { lat: 0, lng: 0 },
                    zoom: 8,
                    mapId: container.id || "map"
                });
                resolve(true);
            } catch (error) {
                console.error('Error mounting Google Map:', error);
                reject(false);
            }
        })
    }

    setCenter(position: LatLng) {
        this.map.setCenter(position);
    }

    addMarker(position: LatLng) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position,
            map: this.map
        });

        this.markers.push(marker);
    }

    destroy() {
        this.markers.forEach(m => m.map = null);
        this.markers = [];
    }

    private loadScript() {
        return new Promise<void>((resolve) => {
            const script = document.createElement('script');
            script.src =
                `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=maps,marker`;
            script.async = true;
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    }
}