const AppDataSource = require("../config/config");
const Vehicle = require("../models/vehicle");
const Reservation = require("../models/reservation");
const User = require("../models/user");
const ReservationDriverLog = require("../models/reservationDriverLog");
const { Not } = require("typeorm");
const { get } = require("../routes/vehicleRoutes");


const postVehicle = async (req, res) => {
  try {
    const { name, price, category, description, userId } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    const newVehicle = vehicleRepo.create({
      vehicleName: name,
      price,
      withDriverPrice: parseFloat(price) + 500,
      image: imagePath, // Save file path
      category,
      description,
      userId,
    });

    await vehicleRepo.save(newVehicle);

    res
      .status(201)
      .json({ message: "Vehicle posted successfully", vehicle: newVehicle });
  } catch (error) {
    console.error("Error posting vehicle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getAllVehicles = async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicles = await vehicleRepo.find({
      where: { status: "Approved" }
    });

    const updatedVehicles = vehicles.map(v => ({
      ...v,
      image: v.image ? `http://localhost:5000/${v.image}` : null
    }));

    res.status(200).json(updatedVehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};


const getVehicleById = async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    const vehicle = await vehicleRepo.findOneBy({
      vehicleId: parseInt(req.params.id),
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.image = vehicle.image
      ? `http://localhost:5000/${vehicle.image}`
      : null;

    res.status(200).json(vehicle);
  } catch (err) {
    console.error("Error fetching vehicle by ID:", err);
    res.status(500).json({ message: "Failed to fetch vehicle" });
  }
};



const toggleVehicleAvailability = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { isAvailable } = req.body;

    const vehicleRepo = AppDataSource.getRepository("Vehicle");

    // Check if vehicle exists
    const vehicle = await vehicleRepo.findOne({
      where: { vehicleId: parseInt(vehicleId) }
    });

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Update availability
    await vehicleRepo.update(
      { vehicleId: parseInt(vehicleId) },
      { isAvailable }
    );

    res.status(200).json({
      message: `Vehicle availability updated to ${isAvailable ? 'available' : 'unavailable'}`,
      vehicleId: parseInt(vehicleId),
      isAvailable
    });
  } catch (error) {
    console.error('Error updating vehicle availability:', error);
    res.status(500).json({ error: 'Failed to update vehicle availability' });
  }
};

const getPendingVehicles = async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicles = await vehicleRepo.find({
      where: { status: "pending" },
      relations: ["user"],
    });

    const mapped = vehicles.map((v) => ({
      id: v.vehicleId,
      name: v.vehicleName,
      price: v.price,
      category: v.category,
      description: v.description,
      status: v.status,
      image: v.image ? `http://localhost:5000/${v.image}` : null,
      ownerName: v.user ? `${v.user.firstName} ${v.user.lastName}` : "Unknown",
      ownerPhone: v.user?.phoneNo || "N/A",
      documents: [], // handle documents if implemented
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Error fetching pending vehicles:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

const approveVehicle = async (req, res) => {
  try {
    const { id } = req.params; // vehicleId from frontend
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    const vehicle = await vehicleRepo.findOneBy({ vehicleId: parseInt(id) });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.status = "Approved";
    await vehicleRepo.save(vehicle);

    res.status(200).json({ message: "Vehicle approved successfully", vehicle });
  } catch (error) {
    console.error("Error approving vehicle:", error);
    res.status(500).json({ message: "Failed to approve vehicle" });
  }
};

const rejectVehicle = async (req, res) => {
  try {
    const { id } = req.params; // vehicleId from frontend
    const { reason } = req.body; // rejection reason
    const vehicleRepo = AppDataSource.getRepository("Vehicle");

    const vehicle = await vehicleRepo.findOneBy({ vehicleId: parseInt(id) });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Update status and save issue details
    vehicle.status = "Rejected";
    vehicle.issueDetails = reason;
    await vehicleRepo.save(vehicle);

    res.status(200).json({ message: "Vehicle rejected successfully", vehicle });
  } catch (error) {
    console.error("Error rejecting vehicle:", error);
    res.status(500).json({ message: "Failed to reject vehicle" });
  }
};

const getVehicleCounts = async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository("Vehicle");

    const pendingCount = await vehicleRepo.count({ where: { status: "pending" } });
    const approvedCount = await vehicleRepo.count({ where: { status: "Approved" } });
    const rejectedCount = await vehicleRepo.count({ where: { status: "Rejected" } });
    const totalCount = await vehicleRepo.count();

    res.status(200).json({
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      total: totalCount,
    });
  } catch (error) {
    console.error("Error fetching vehicle counts:", error);
    res.status(500).json({ error: "Failed to fetch vehicle counts" });
  }
};

const getMyVehicles = async (req, res) => {
  try {
    const userId = req.user.userId; // assuming JWT middleware adds this
    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    const vehicles = await vehicleRepo.find({
      where: { userId }, // only fetch logged-in owner's vehicles
    });

    const mapped = vehicles.map((v) => ({
      vehicleId: v.vehicleId,
      vehicleName: v.vehicleName,
      price: v.price,
      category: v.category,
      description: v.description,
      status: v.status,
      rejectionReason: v.issueDetails || null,
      image: v.image ? `http://localhost:5000/${v.image}` : null,
      createdAt: v.createdAt || null,
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error fetching owner's vehicles:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};


module.exports = {
  postVehicle,
  getAllVehicles,
  getVehicleById,
  toggleVehicleAvailability,
  getPendingVehicles,
  approveVehicle,
  rejectVehicle,
  getVehicleCounts,
  getMyVehicles,

};
