import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";

export type MapPin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  subtitle?: string;
};

// Leaflet touches `window` at import time, so the real map is loaded only in
// the browser after mount — the prerender (and the first client paint) show
// the placeholder instead.
let InnerMap: ComponentType<{ pins: MapPin[] }> | null = null;
const loadInnerMap = () => {
  InnerMap =
    InnerMap ?? lazy(() => import("@/components/LocationsMapInner"));
  return InnerMap;
};

const MapPlaceholder = () => (
  <div className="flex h-full w-full items-center justify-center bg-[#eef2fb]">
    <span className="font-heading text-sm font-bold uppercase tracking-widest text-foreground/40">
      Loading map...
    </span>
  </div>
);

const LocationsMap = ({
  pins,
  className
}: {
  pins: MapPin[];
  className?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const Inner = isMounted ? loadInnerMap() : null;

  return (
    <div
      className={`relative z-0 overflow-hidden border-2 border-border bg-white ${className ?? ""}`}
    >
      {Inner ? (
        <Suspense fallback={<MapPlaceholder />}>
          <Inner pins={pins} />
        </Suspense>
      ) : (
        <MapPlaceholder />
      )}
    </div>
  );
};

export default LocationsMap;
