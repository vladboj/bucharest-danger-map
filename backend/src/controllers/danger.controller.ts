import { Request, Response } from "express";
import { getDangerLevel } from "../services/danger.service";

export const getDangerLevelHandler = async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lon = parseFloat(req.query.lon as string);

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: "lat and lon are required" });
  }

  const info = await getDangerLevel(lat, lon);
  res.json(info);
};
