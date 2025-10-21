import { Location } from "@shared/types";
import { nominatimRateLimiter } from "./rateLimiter.service";

// Type for what Nominatim actually returns (we only care about these fields)
type NominatimResponse = {
  display_name: string;
  lat: string;
  lon: string;
  [key: string]: any; // Nominatim returns many other fields we don't need
}[];

export const fetchGeocode = async (
  street: string,
  limit: number
): Promise<Location[]> => {
  const url = `https://nominatim.openstreetmap.org/search?country=Romania&city=Bucharest&street=${encodeURIComponent(
    street
  )}&limit=${limit}&format=json`;

  const data: NominatimResponse = await nominatimRateLimiter.addToQueue(
    async () => {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "GeoAppDev/0.1 (https://github.com/example/geoapp)",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from Nominatim");
      }

      return response.json();
    }
  );

  // Filter to only return the fields we need
  const locations: Location[] = data.map((item) => ({
    display_name: item.display_name,
    lat: item.lat,
    lon: item.lon,
  }));

  return locations;
};
