const AppDataSource = require("../config/config");
const Vehicle = require("../models/vehicle");

const postVehicle = async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      category,
      description,
      userId, // passed from frontend
    } = req.body;

    const vehicleRepo = AppDataSource.getRepository(Vehicle);

    const newVehicle = vehicleRepo.create({
      vehicleName: name,
      price,
      withDriverPrice: parseFloat(price) + 500,
      image,
      category,
      description,
      userId,
    });

    await vehicleRepo.save(newVehicle);
    res.status(201).json({ message: "Vehicle posted successfully", vehicle: newVehicle });
  } catch (error) {
    console.error("Error posting vehicle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getAllVehicles = async (req, res) => {
//   try {
//     const vehicleRepo = AppDataSource.getRepository(Vehicle);
//     const vehicles = await vehicleRepo.find();
//     res.status(200).json(vehicles);
//   } catch (error) {
//     console.error("Error fetching vehicles:", error);
//     res.status(500).json({ error: "Failed to fetch vehicles" });
//   }
// };

const getAllVehicles = async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const vehicles = await vehicleRepo.find({
      where: { status: "Approved" }
    });
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicleRepo = AppDataSource.getRepository("Vehicle");

    const vehicle = await vehicleRepo.findOneBy({
      vehicleId: parseInt(req.params.id),
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (err) {
    console.error("Error fetching vehicle by ID:", err);
    res.status(500).json({ message: "Failed to fetch vehicle" });
  }
};


module.exports = {
  postVehicle,
  getAllVehicles,
  getVehicleById
};
