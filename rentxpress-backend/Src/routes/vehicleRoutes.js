const express = require("express");
const router = express.Router();
const { postVehicle, getAllVehicles, getVehicleById, toggleVehicleAvailability, getPendingVehicles, 
  approveVehicle, rejectVehicle, getVehicleCounts, getMyVehicles} = require("../controllers/vehicleController");
const verifyToken = require('../middleware/authMiddleware');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in /uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/postVehicle", upload.single("image"), postVehicle);
router.get("/", getAllVehicles);
router.get("/pending",getPendingVehicles);
router.get("/vehicles/:id", getVehicleById);
router.patch('/vehicles/:vehicleId/availability', toggleVehicleAvailability);
router.patch("/:id/approve", verifyToken, approveVehicle);
router.patch("/:id/reject", verifyToken, rejectVehicle);
router.get("/counts", verifyToken, getVehicleCounts);
router.get("/myVehicles", verifyToken, getMyVehicles);



module.exports = router;
