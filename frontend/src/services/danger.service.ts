export type DangerInfo = { label: string; color: string };

export async function fetchDangerLevel(
  lat: number,
  lon: number,
): Promise<DangerInfo> {
  const response = await fetch(
    `http://localhost:3000/danger?lat=${lat}&lon=${lon}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch danger level");
  }

  return (await response.json()) as DangerInfo;
}
