import { afterEach, describe, expect, it, vi } from "vitest";
import { geocodePlace, isShortMapsLink } from "@/lib/geocode";

const mockFetch = (impl: typeof fetch) => {
  vi.stubGlobal("fetch", vi.fn(impl));
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("isShortMapsLink", () => {
  it("detects Google's shortened map links", () => {
    expect(isShortMapsLink("https://maps.app.goo.gl/abc123")).toBe(true);
    expect(isShortMapsLink("https://goo.gl/maps/xyz")).toBe(true);
  });

  it("does not flag full map links", () => {
    expect(
      isShortMapsLink("https://www.google.com/maps?q=India&output=embed")
    ).toBe(false);
  });
});

describe("geocodePlace", () => {
  it("returns coordinates from the first result", async () => {
    mockFetch((async () =>
      new Response(JSON.stringify([{ lat: "13.7563", lon: "100.5018" }]), {
        status: 200
      })) as typeof fetch);

    await expect(geocodePlace("Bangkok, Thailand")).resolves.toEqual({
      lat: 13.7563,
      lng: 100.5018
    });
  });

  it("sends the place as an encoded query", async () => {
    const spy = vi.fn(
      async () => new Response(JSON.stringify([]), { status: 200 })
    );
    mockFetch(spy as unknown as typeof fetch);

    await geocodePlace("Cary Leeds Center, Bronx NY");

    const requestedUrl = String(spy.mock.calls[0][0]);
    expect(requestedUrl).toContain("nominatim.openstreetmap.org/search");
    expect(requestedUrl).toContain(
      `q=${encodeURIComponent("Cary Leeds Center, Bronx NY")}`
    );
  });

  it("returns null for an empty query without calling the network", async () => {
    const spy = vi.fn(
      async () => new Response(JSON.stringify([]), { status: 200 })
    );
    mockFetch(spy as unknown as typeof fetch);

    await expect(geocodePlace("   ")).resolves.toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it("returns null when nothing matches", async () => {
    mockFetch((async () =>
      new Response(JSON.stringify([]), { status: 200 })) as typeof fetch);

    await expect(geocodePlace("qqqqzzzz")).resolves.toBeNull();
  });

  it("returns null when the service errors or is unreachable", async () => {
    mockFetch((async () => new Response("", { status: 500 })) as typeof fetch);
    await expect(geocodePlace("Anywhere")).resolves.toBeNull();

    mockFetch((async () => {
      throw new Error("network down");
    }) as typeof fetch);
    await expect(geocodePlace("Anywhere")).resolves.toBeNull();
  });

  it("rejects out-of-range coordinates", async () => {
    mockFetch((async () =>
      new Response(JSON.stringify([{ lat: "999", lon: "12" }]), {
        status: 200
      })) as typeof fetch);

    await expect(geocodePlace("Broken")).resolves.toBeNull();
  });
});
