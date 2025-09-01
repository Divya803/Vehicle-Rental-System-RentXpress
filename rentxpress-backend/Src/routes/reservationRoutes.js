const express = require("express");
const router = express.Router();
const {createReservation, getPendingReservations, getConfirmedReservations, getCancelledReservations, getMyBookings, getAvailableDrivers, assignDriver, getAssignedRides,acceptRide,
  rejectRide,getConfirmedRidesForDriver, rejectReservation, getReservationCounts, getOwnerBookings, cancelReservation} = require("../controllers/reservationController");
const verifyToken = require('../middleware/authMiddleware');


router.post("/createReservation", createReservation);
router.get("/pending", getPendingReservations);
router.get("/confirmed", getConfirmedReservations);
router.get("/cancelled", getCancelledReservations);
router.get('/myBookings', verifyToken, getMyBookings);
router.get('/availableDrivers', verifyToken, getAvailableDrivers);
router.post("/assign-driver", verifyToken, assignDriver);
router.get('/assigned-rides', verifyToken, getAssignedRides);
router.post('/accept-ride', verifyToken, acceptRide);
router.post('/reject-ride', verifyToken, rejectRide);
router.get('/confirmed-rides-driver', verifyToken, getConfirmedRidesForDriver);
router.patch("/:reservationId/reject", rejectReservation);
router.get("/counts", verifyToken, getReservationCounts);
router.get("/ownerBookings", verifyToken, getOwnerBookings);
router.put("/cancel/:id", verifyToken, cancelReservation);

module.exports = router;
