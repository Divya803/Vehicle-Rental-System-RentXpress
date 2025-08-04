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

const createReservation = async (req, res) => {
  try {
    const {
      userId,
      vehicleId,
      startDate,
      endDate,
      totalAmount,
      reservationType
    } = req.body;


    const reservationRepo = AppDataSource.getRepository("Reservation");
    const userRepo = AppDataSource.getRepository("User");
    const vehicleRepo = AppDataSource.getRepository("Vehicle");

    const user = await userRepo.findOne({ where: { userId: parseInt(userId) } });
    const vehicle = await vehicleRepo.findOne({ where: { vehicleId: parseInt(vehicleId) } });


    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const status =
      reservationType === "Without Driver" ? "Confirmed" : "Pending";

    const newReservation = reservationRepo.create({
      user: user,
      vehicle: vehicle,
      startDate,
      endDate,
      totalAmount,
      reservationType,
      status,
    });

    console.log("Created reservation:", newReservation);

    await reservationRepo.save(newReservation);

    res.status(201).json({ message: "Reservation created", reservation: newReservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPendingReservations = async (req, res) => {
  try {
    const reservationRepo = AppDataSource.getRepository("Reservation");
    const reservations = await reservationRepo.find({
      where: {
        reservationType: "With Driver",
        isCancelled: false,
        driver: null
      },
      relations: ["user", "vehicle"]
    });

    const enrichedReservations = reservations.map(reservation => {
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      const timeDiff = Math.abs(endDate - startDate);
      const durationDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // duration in days

      return {
        id: reservation.reservationId,
        customerName: reservation.user?.firstName + " " + reservation.user?.lastName,
        customerPhone: reservation.user?.phoneNo,
        customerEmail: reservation.user?.email,
        vehicleId: reservation.vehicle?.vehicleId,
        vehicleName: reservation.vehicle?.vehicleName,
        vehicleType: reservation.vehicle?.category,
        vehicleAvailable: reservation.vehicle?.isAvailable,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        totalAmount: reservation.totalAmount,
        duration: `${durationDays} day${durationDays > 1 ? 's' : ''}`,
        requestDate: reservation.createdAt || reservation.startDate, // fallback
      };
    });

    res.status(200).json(enrichedReservations);
  } catch (error) {
    console.error("Error fetching pending reservations:", error);
    res.status(500).json({ error: "Internal server error" });
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


module.exports = {
  postVehicle,
  getAllVehicles,
  getVehicleById,
  createReservation,
  getPendingReservations,
  toggleVehicleAvailability
};
