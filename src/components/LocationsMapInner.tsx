import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPin } from "@/components/LocationsMap";

// Inline SVG pin in the site blue, so no Leaflet marker-image assets are
// needed (their default paths break under bundlers).
const pinIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44">
    <path d="M17 1C8.2 1 1 8.1 1 16.9 1 28.9 17 43 17 43s16-14.1 16-26.1C33 8.1 25.8 1 17 1Z" fill="#4f74d6" stroke="#0a0d28" stroke-width="1.5"/>
    <circle cx="17" cy="16.5" r="6" fill="#ffffff"/>
  </svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 43],
  popupAnchor: [0, -40]
});

const LocationsMapInner = ({ pins }: { pins: MapPin[] }) => {
  const bounds = L.latLngBounds(pins.map((pin) => [pin.lat, pin.lng]));

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [56, 56], maxZoom: 13 }}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {pins.map((pin) => (
        <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pinIcon}>
          <Popup>
            <span className="block font-heading text-base font-black uppercase text-foreground">
              {pin.name}
            </span>
            {pin.subtitle ? (
              <span className="mt-0.5 block font-body text-sm text-muted-foreground">
                {pin.subtitle}
              </span>
            ) : null}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LocationsMapInner;
