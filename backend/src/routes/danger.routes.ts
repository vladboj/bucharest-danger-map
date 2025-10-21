import { Router } from "express";
import { getDangerLevelHandler } from "../controllers/danger.controller";

const router = Router();

router.get("/danger", getDangerLevelHandler);

export default router;
