import { useState } from "react";

export function useGeolocation(defaultPosition = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);

  function getPosition() {
    setError(null);

    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation.");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        switch (error.code) {
          case 1:
            setError(
              "Location access was denied. Please reset browser permissions.",
            );
            break;
          case 2:
            setError("Your location could not be determined.");
            break;
          case 3:
            setError("Location request timed out.");
            break;
          default:
            setError("Unable to determine your location.");
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  return { isLoading, position, error, getPosition };
}
