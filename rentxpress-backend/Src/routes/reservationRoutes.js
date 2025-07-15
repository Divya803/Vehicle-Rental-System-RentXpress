const express = require("express");
const router = express.Router();
// const reservationController = require("../controllers/reservationController");
const { postVehicle, getAllVehicles, getVehicleById} = require("../controllers/reservationController");

router.post("/postVehicle", postVehicle);
router.get("/", getAllVehicles);
router.get("/vehicles/:id", getVehicleById);


module.exports = router;
