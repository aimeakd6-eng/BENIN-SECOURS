export interface Position {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function getCurrentPosition(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("La géolocalisation n'est pas supportée par ce navigateur"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let message = "Erreur de localisation";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Permission de localisation refusée. Veuillez activer le GPS.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Position indisponible. Vérifiez votre connexion GPS.";
            break;
          case error.TIMEOUT:
            message = "Délai de localisation dépassé. Réessayez.";
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
}

export function watchPosition(
  onSuccess: (pos: Position) => void,
  onError: (err: Error) => void
): number {
  if (!navigator.geolocation) {
    onError(new Error("La géolocalisation n'est pas supportée"));
    return -1;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      onError(new Error(`Erreur de suivi GPS: ${error.message}`));
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    }
  );
}

export function clearWatchPosition(watchId: number) {
  if (watchId >= 0) {
    navigator.geolocation.clearWatch(watchId);
  }
}

export function calculerDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
