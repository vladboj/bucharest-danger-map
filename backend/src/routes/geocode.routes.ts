import { Router } from "express";
import { getGeocode } from "../controllers/geocode.controller";

const router = Router();

router.get("/geocode", getGeocode);

export default router;
