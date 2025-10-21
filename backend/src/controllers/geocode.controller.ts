import { Request, Response } from "express";
import { fetchGeocode } from "../services/geocode.service";
import { Location } from "@shared/types";

export const getGeocode = async (req: Request, res: Response) => {
  const { street, limit } = req.query;
  const decodedStreet = decodeURIComponent(street as string);

  if (!decodedStreet) {
    return res.status(400).json({ error: "street is required" });
  }

  try {
    const locations: Location[] = await fetchGeocode(
      decodedStreet,
      Number(limit) || 5
    );
    res.json(locations);
  } catch (err: any) {
    console.error(err);
    res.status(502).json({ error: "Failed to fetch geocode suggestions" });
  }
};
