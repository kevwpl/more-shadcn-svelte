import type { LatLng } from ".";

export interface MapProvider {
    mount(container: HTMLElement): Promise<boolean>;
    setCenter(position: LatLng): void;
    addMarker(position: LatLng): void;
    destroy(): void;
}