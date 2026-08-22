export type LatLng = { lat: number; lng: number };

const isValidLatLng = (lat: number, lng: number) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  Math.abs(lat) <= 90 &&
  Math.abs(lng) <= 180 &&
  // 0,0 is in the ocean off Africa and is almost always a parse artifact
  // rather than a real location.
  !(lat === 0 && lng === 0);

const toLatLng = (lat: number, lng: number): LatLng | null =>
  isValidLatLng(lat, lng) ? { lat, lng } : null;

const COORD_PAIR = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;

// Reads coordinates out of a Google Maps link. Handles the long "pb=" embed
// form (!2d<lng>!3d<lat>), place links with an "@lat,lng" camera, and query
// params that hold a coordinate pair (q=, ll=, center=, destination=).
export const extractLatLngFromEmbedUrl = (embedUrl: string): LatLng | null => {
  const url = embedUrl?.trim();
  if (!url) {
    return null;
  }

  const lngMatch = url.match(/!2d(-?\d+(?:\.\d+)?)/);
  const latMatch = url.match(/!3d(-?\d+(?:\.\d+)?)/);
  if (lngMatch && latMatch) {
    const fromPb = toLatLng(Number(latMatch[1]), Number(lngMatch[1]));
    if (fromPb) {
      return fromPb;
    }
  }

  const atMatch = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const fromAt = toLatLng(Number(atMatch[1]), Number(atMatch[2]));
    if (fromAt) {
      return fromAt;
    }
  }

  for (const param of ["q", "query", "ll", "center", "destination", "daddr"]) {
    const paramMatch = url.match(
      new RegExp(`[?&]${param}=([^&#]+)`, "i")
    );
    if (!paramMatch) {
      continue;
    }

    let value = paramMatch[1];
    try {
      value = decodeURIComponent(value.replace(/\+/g, " "));
    } catch {
      // Keep the raw value when it isn't valid percent-encoding.
    }

    const pair = value.match(COORD_PAIR);
    if (pair) {
      const fromParam = toLatLng(Number(pair[1]), Number(pair[2]));
      if (fromParam) {
        return fromParam;
      }
    }
  }

  return null;
};

// Reads the place name out of a Google Maps link, e.g.
// "https://www.google.com/maps?q=India&output=embed" -> "India". Used to place
// a pin when the link carries a name instead of coordinates.
export const extractPlaceNameFromEmbedUrl = (embedUrl: string): string => {
  const url = embedUrl?.trim();
  if (!url) {
    return "";
  }

  for (const param of ["q", "query", "destination", "daddr"]) {
    const paramMatch = url.match(new RegExp(`[?&]${param}=([^&#]+)`, "i"));
    if (!paramMatch) {
      continue;
    }

    let value = paramMatch[1];
    try {
      value = decodeURIComponent(value.replace(/\+/g, " "));
    } catch {
      // Keep the raw value when it isn't valid percent-encoding.
    }

    // Skip coordinate pairs — those are handled by the coordinate reader.
    if (COORD_PAIR.test(value)) {
      continue;
    }

    if (value.trim()) {
      return value.trim();
    }
  }

  // "/maps/place/Central+Park/..." style links.
  const placeMatch = url.match(/\/maps\/place\/([^/@?#]+)/i);
  if (placeMatch) {
    try {
      return decodeURIComponent(placeMatch[1].replace(/\+/g, " ")).trim();
    } catch {
      return placeMatch[1].replace(/\+/g, " ").trim();
    }
  }

  return "";
};
