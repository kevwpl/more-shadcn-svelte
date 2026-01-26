import type { LatLng, MapProviderName } from './index';
import type { MapProvider } from './provider';

type MapInstanceOptions = {
    provider: MapProviderName;
    apiKey: string;
};

export class MapInstance {
    private provider!: MapProvider;
    private ready!: boolean;

    constructor(private options: MapInstanceOptions) { }

    async mount(container: HTMLElement) {
        if (!this.provider) {
            this.provider = await this.loadProvider();
            this.ready = await this.provider.mount(container);
        }

        return this.ready;
    }

    private async loadProvider(): Promise<MapProvider> {
        switch (this.options.provider) {
            case 'google': {
                const mod = await import('./providers/google.ts');
                return new mod.default(this.options.apiKey);
            }

            case 'mapbox': {
                const mod = await import('./providers/mapbox.ts');
                return new mod.default(this.options.apiKey);
            }

            default:
                throw new Error('Unknown map provider');
        }
    }

    async addMarker(position: LatLng) {
        if (this.ready) {
            this.provider.addMarker(position);
        }
    }

    async setCenter(position: LatLng) {
        if (this.ready) {
            this.provider.setCenter(position);
        }
    }

    destroy() {
        this.provider?.destroy();
    }
}
