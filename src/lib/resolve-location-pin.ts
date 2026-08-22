import type { OtherLocation } from "@/lib/editable-content-format";
import {
  extractLatLngFromEmbedUrl,
  extractPlaceNameFromEmbedUrl,
  type LatLng
} from "@/lib/geo";
import { lookupPlaceCoords } from "@/lib/place-coords";

export type PinSource = "manual" | "embed-coords" | "place-name" | "none";

export type ResolvedPin = {
  coords: LatLng | null;
  source: PinSource;
};

// Where a location's map pin comes from, in priority order:
//   1. coordinates typed into the admin
//   2. coordinates inside the Google Maps link
//   3. the place name — from the link's "q=" value or the location's own name
export const resolveLocationPin = (
  location: Pick<OtherLocation, "name" | "embedUrl" | "lat" | "lng">
): ResolvedPin => {
  if (typeof location.lat === "number" && typeof location.lng === "number") {
    return {
      coords: { lat: location.lat, lng: location.lng },
      source: "manual"
    };
  }

  const embedUrl = location.embedUrl ?? "";
  const fromUrl = extractLatLngFromEmbedUrl(embedUrl);
  if (fromUrl) {
    return { coords: fromUrl, source: "embed-coords" };
  }

  const placeName =
    extractPlaceNameFromEmbedUrl(embedUrl) || (location.name ?? "");
  const fromName = lookupPlaceCoords(placeName);
  if (fromName) {
    return { coords: fromName, source: "place-name" };
  }

  return { coords: null, source: "none" };
};
