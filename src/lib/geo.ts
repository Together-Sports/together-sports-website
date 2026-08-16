export type LatLng = { lat: number; lng: number };

// Google Maps embed URLs encode the pinned point as "!2d<lng>!3d<lat>" in the
// pb parameter, so existing saved embed links can place map pins without the
// admin entering coordinates by hand.
export const extractLatLngFromEmbedUrl = (embedUrl: string): LatLng | null => {
  const lngMatch = embedUrl.match(/!2d(-?\d+(?:\.\d+)?)/);
  const latMatch = embedUrl.match(/!3d(-?\d+(?:\.\d+)?)/);

  if (!lngMatch || !latMatch) {
    return null;
  }

  const lat = Number(latMatch[1]);
  const lng = Number(lngMatch[1]);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    return null;
  }

  return { lat, lng };
};
