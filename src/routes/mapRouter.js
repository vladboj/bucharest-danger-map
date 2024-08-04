const express = require("express");
const mapRouter = express.Router();
const mapController = require("../controllers/mapController.js");
const { isAuthenticated } = require("../middleware/authMiddleware.js");

mapRouter.get("/", isAuthenticated, mapController.showMapPage);

module.exports = mapRouter;