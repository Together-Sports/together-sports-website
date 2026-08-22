import { describe, expect, it } from "vitest";
import {
  extractLatLngFromEmbedUrl,
  extractPlaceNameFromEmbedUrl
} from "@/lib/geo";
import { lookupPlaceCoords } from "@/lib/place-coords";
import { resolveLocationPin } from "@/lib/resolve-location-pin";

describe("extractLatLngFromEmbedUrl", () => {
  it("reads coordinates from a long pb embed url", () => {
    const url =
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2!2d-74.1197!3d40.6976!2m3!1f0!2f0!3f0";
    expect(extractLatLngFromEmbedUrl(url)).toEqual({
      lat: 40.6976,
      lng: -74.1197
    });
  });

  it("reads coordinates from an @lat,lng place url", () => {
    const url = "https://www.google.com/maps/place/Central+Park/@40.7829,-73.9654,15z";
    expect(extractLatLngFromEmbedUrl(url)).toEqual({
      lat: 40.7829,
      lng: -73.9654
    });
  });

  it("reads a coordinate pair passed as the q parameter", () => {
    const url = "https://www.google.com/maps?q=13.7563,100.5018&output=embed";
    expect(extractLatLngFromEmbedUrl(url)).toEqual({
      lat: 13.7563,
      lng: 100.5018
    });
  });

  it("returns null for a place-name url with no coordinates", () => {
    const url = "https://www.google.com/maps?q=India&output=embed";
    expect(extractLatLngFromEmbedUrl(url)).toBeNull();
  });
});

describe("extractPlaceNameFromEmbedUrl", () => {
  it("reads the place name from a q parameter", () => {
    expect(
      extractPlaceNameFromEmbedUrl(
        "https://www.google.com/maps?q=India&output=embed"
      )
    ).toBe("India");
  });

  it("decodes multi-word place names", () => {
    expect(
      extractPlaceNameFromEmbedUrl(
        "https://www.google.com/maps?q=New+York+City&output=embed"
      )
    ).toBe("New York City");
  });

  it("reads the place name from a /maps/place/ url", () => {
    expect(
      extractPlaceNameFromEmbedUrl(
        "https://www.google.com/maps/place/Central+Park/@40.78,-73.96,15z"
      )
    ).toBe("Central Park");
  });
});

describe("lookupPlaceCoords", () => {
  it("resolves countries and US states", () => {
    expect(lookupPlaceCoords("India")).toEqual({ lat: 20.59, lng: 78.96 });
    expect(lookupPlaceCoords("thailand")).toEqual({ lat: 15.87, lng: 100.99 });
    expect(lookupPlaceCoords("Texas")).toEqual({ lat: 31.48, lng: -99.33 });
  });

  it("resolves aliases", () => {
    expect(lookupPlaceCoords("USA")).toEqual(lookupPlaceCoords("United States"));
    expect(lookupPlaceCoords("NYC")).toEqual(
      lookupPlaceCoords("New York City")
    );
  });

  it("falls back to a recognizable part of a longer name", () => {
    expect(lookupPlaceCoords("Chiang Mai, Thailand")).toEqual(
      lookupPlaceCoords("Thailand")
    );
  });

  it("returns null for something it does not know", () => {
    expect(lookupPlaceCoords("Somewhere Nobody Has Heard Of")).toBeNull();
  });
});

describe("resolveLocationPin", () => {
  it("prefers coordinates typed into the admin", () => {
    const pin = resolveLocationPin({
      name: "India",
      embedUrl: "https://www.google.com/maps?q=India&output=embed",
      lat: 12.34,
      lng: 56.78
    });
    expect(pin).toEqual({ coords: { lat: 12.34, lng: 56.78 }, source: "manual" });
  });

  it("places a pin for the q=<place> embed urls saved in the admin", () => {
    for (const name of ["India", "Thailand", "Florida", "Texas"]) {
      const pin = resolveLocationPin({
        name,
        embedUrl: `https://www.google.com/maps?q=${name}&output=embed`
      });
      expect(pin.source).toBe("place-name");
      expect(pin.coords).toEqual(lookupPlaceCoords(name));
    }
  });

  it("falls back to the location name when the url has no place", () => {
    const pin = resolveLocationPin({ name: "Kenya", embedUrl: "" });
    expect(pin.source).toBe("place-name");
    expect(pin.coords).toEqual(lookupPlaceCoords("Kenya"));
  });

  it("reports no pin when nothing resolves", () => {
    const pin = resolveLocationPin({ name: "", embedUrl: "" });
    expect(pin).toEqual({ coords: null, source: "none" });
  });
});
