import type { LatLng } from "@/lib/geo";

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

// Google's short links (maps.app.goo.gl / goo.gl/maps) hide the real place
// behind a redirect that a browser can't follow cross-origin, so they can't be
// resolved here — the admin is asked for the full link instead.
export const isShortMapsLink = (url: string) =>
  /(?:maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(url);

// Looks a place up with OpenStreetMap's Nominatim service (free, no API key).
// Only called from the admin, one lookup per location, and the result is saved
// as coordinates — the public site never geocodes.
export const geocodePlace = async (
  query: string,
  signal?: AbortSignal
): Promise<LatLng | null> => {
  const search = query.trim();
  if (!search) {
    return null;
  }

  const url = `${NOMINATIM_SEARCH_URL}?format=jsonv2&limit=1&q=${encodeURIComponent(search)}`;

  try {
    const response = await fetch(url, {
      signal,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      return null;
    }

    const results = (await response.json()) as
      | { lat?: string; lon?: string }[]
      | null;

    const first = Array.isArray(results) ? results[0] : null;
    if (!first?.lat || !first?.lon) {
      return null;
    }

    const lat = Number(first.lat);
    const lng = Number(first.lon);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      Math.abs(lat) > 90 ||
      Math.abs(lng) > 180
    ) {
      return null;
    }

    return { lat, lng };
  } catch {
    // Offline, blocked, or aborted — the caller shows a retry option.
    return null;
  }
};
