// import { useNavigate, useSearchParams } from "react-router-dom";
// import styles from "./Map.module.css";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { useState } from "react";
// import { useCities } from "../contexts/CitiesContext";

// function Map() {
//   const _navigate = useNavigate();
//   const { cities } = useCities();
//   const [mapPosition, _setMapPosition] = useState([40, 0]);

//   const [searchParams, _setSearchParams] = useSearchParams();
//   const _lat = searchParams.get("lat");
//   const _lng = searchParams.get("lng");

//   return (
//     <div className={styles.mapContainer}>
//       <MapContainer
//         center={mapPosition}
//         zoom={13}
//         scrollWheelZoom={true}
//         className={styles.map}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
//         />
//         {cities.map((city) => (
//           <Marker
//             position={[city.position.lat, city.position.lng]}
//             key={city.id}
//           >
//             <Popup>
//               <span>{city.emoji}</span> <span>{city.cityName}</span>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }

// export default Map;

import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

// Converts emoji flags such as 🇵🇹 into country codes such as "pt"
function emojiToCountryCode(emojiString) {
  if (!emojiString) return "";

  return [...emojiString]
    .map((char) => {
      const code = char.codePointAt(0);

      // Regional indicator symbols: A-Z
      if (code >= 127462 && code <= 127487) {
        return String.fromCharCode(code - 127462 + 65);
      }

      return "";
    })
    .join("")
    .toLowerCase();
}

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng],
  );

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition],
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => {
          const countryCode = emojiToCountryCode(city.emoji);

          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {countryCode ? (
                    <img
                      src={`https://flagcdn.com/w40/${countryCode}.png`}
                      srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
                      width={24}
                      height={18}
                      alt={`${city.cityName} flag`}
                      style={{
                        borderRadius: "2px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      }}
                    />
                  ) : (
                    <span>❓</span>
                  )}

                  <span
                    style={{
                      fontWeight: 600,
                      color: "#ffffff",
                    }}
                  >
                    {city.cityName}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
