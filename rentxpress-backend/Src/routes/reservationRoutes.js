const express = require("express");
const router = express.Router();
// const reservationController = require("../controllers/reservationController");
const { postVehicle, getAllVehicles, getVehicleById, createReservation, getPendingReservations, getConfirmedReservations, toggleVehicleAvailability,
    getPendingVehicles, getMyBookings, getAvailableDrivers, assignDriver} = require("../controllers/reservationController");
const verifyToken = require('../middleware/authMiddleware');

router.post("/postVehicle", postVehicle);
router.get("/", getAllVehicles);
router.get("/vehicles/pending",getPendingVehicles);
router.get("/vehicles/:id", getVehicleById);
router.post("/createReservation", createReservation);
router.get("/pending", getPendingReservations);
router.get("/confirmed", getConfirmedReservations);
router.patch('/vehicles/:vehicleId/availability', toggleVehicleAvailability);
router.get('/myBookings', verifyToken, getMyBookings);
router.get('/availableDrivers', verifyToken, getAvailableDrivers);
router.post("/assign-driver", verifyToken, assignDriver);


module.exports = router;
