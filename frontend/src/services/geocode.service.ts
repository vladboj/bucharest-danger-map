import { Location } from "@shared/types";

export const fetchSuggestions = async (
  street: string,
  limit: number,
): Promise<Location[]> => {
  const trimmedStreet = street.trim();
  if (!trimmedStreet) {
    throw new Error("Street cannot be empty");
  }

  const encodedStreet = encodeURIComponent(trimmedStreet);
  const response = await fetch(
    `http://localhost:3000/geocode?street=${encodedStreet}&limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch suggestions");
  }

  return await response.json();
};
