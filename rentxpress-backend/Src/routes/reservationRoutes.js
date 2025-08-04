const express = require("express");
const router = express.Router();
// const reservationController = require("../controllers/reservationController");
const { postVehicle, getAllVehicles, getVehicleById, createReservation, getPendingReservations, toggleVehicleAvailability} = require("../controllers/reservationController");

router.post("/postVehicle", postVehicle);
router.get("/", getAllVehicles);
router.get("/vehicles/:id", getVehicleById);
router.post("/createReservation", createReservation);
router.get("/pending", getPendingReservations);
router.patch('/vehicles/:vehicleId/availability', toggleVehicleAvailability);


module.exports = router;
