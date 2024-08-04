const express = require("express");
const savedLocationsRouter = express.Router();
const savedLocationsController = require("../controllers/savedLocationsController.js");
const { isAuthenticated } = require("../middleware/authMiddleware.js");

savedLocationsRouter.get("/", isAuthenticated, savedLocationsController.showPage);
savedLocationsRouter.get("/:address", isAuthenticated, savedLocationsController.getLocation);
savedLocationsRouter.post("/", isAuthenticated, savedLocationsController.saveLocation);
savedLocationsRouter.delete("/", isAuthenticated, savedLocationsController.deleteLocation);

module.exports = savedLocationsRouter;