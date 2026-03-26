import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import type { Country } from '@/types';

interface WorldMapProps {
  countries?: Country[];
  center?: LatLngExpression;
  zoom?: number;
  onCountryClick?: (country: Country) => void;
  onClick?: (lat: number, lng: number) => void;
  children?: React.ReactNode;
}

export default function WorldMap({
  countries = [],
  center = [20, 0],
  zoom = 2,
  onCountryClick,
  onClick,
  children,
}: WorldMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-[500px] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {onClick && <MapClickHandler onClick={onClick} />}
      {countries.map((country) =>
        country.lat && country.lng ? (
          <Marker
            key={country.code_alpha2}
            position={[country.lat, country.lng]}
            eventHandlers={{
              click: () => onCountryClick?.(country),
            }}
          >
            <Popup>
              <div className="text-center">
                <span className="text-2xl">{country.flag_emoji}</span>
                <p className="font-semibold">{country.name}</p>
                {country.capital && <p className="text-sm text-gray-500">{country.capital}</p>}
              </div>
            </Popup>
          </Marker>
        ) : null,
      )}
      {children}
    </MapContainer>
  );
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: { latlng: { lat: number; lng: number } }) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
