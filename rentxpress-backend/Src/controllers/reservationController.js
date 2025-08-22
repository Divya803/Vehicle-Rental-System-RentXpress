// const AppDataSource = require("../config/config");
// const Vehicle = require("../models/vehicle");
// const Reservation = require("../models/reservation");
// const User = require("../models/user");
// const ReservationDriverLog = require("../models/reservationDriverLog");
// const { Not } = require("typeorm");


// const postVehicle = async (req, res) => {
//   try {
//     const { name, price, category, description, userId } = req.body;
//     const imagePath = req.file ? req.file.path : null;

//     const vehicleRepo = AppDataSource.getRepository(Vehicle);

//     const newVehicle = vehicleRepo.create({
//       vehicleName: name,
//       price,
//       withDriverPrice: parseFloat(price) + 500,
//       image: imagePath, // Save file path
//       category,
//       description,
//       userId,
//     });

//     await vehicleRepo.save(newVehicle);

//     res
//       .status(201)
//       .json({ message: "Vehicle posted successfully", vehicle: newVehicle });
//   } catch (error) {
//     console.error("Error posting vehicle:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// const getAllVehicles = async (req, res) => {
//   try {
//     const vehicleRepo = AppDataSource.getRepository(Vehicle);
//     const vehicles = await vehicleRepo.find({
//       where: { status: "Approved" }
//     });

//     const updatedVehicles = vehicles.map(v => ({
//       ...v,
//       image: v.image ? `http://localhost:5000/${v.image}` : null
//     }));

//     res.status(200).json(updatedVehicles);
//   } catch (error) {
//     console.error("Error fetching vehicles:", error);
//     res.status(500).json({ error: "Failed to fetch vehicles" });
//   }
// };


// // const getVehicleById = async (req, res) => {
// //   try {
// //     const vehicleRepo = AppDataSource.getRepository("Vehicle");

// //     const vehicle = await vehicleRepo.findOneBy({
// //       vehicleId: parseInt(req.params.id),
// //     });

// //     if (!vehicle) {
// //       return res.status(404).json({ message: "Vehicle not found" });
// //     }

// //     res.status(200).json(vehicle);
// //   } catch (err) {
// //     console.error("Error fetching vehicle by ID:", err);
// //     res.status(500).json({ message: "Failed to fetch vehicle" });
// //   }
// // };

// const getVehicleById = async (req, res) => {
//   try {
//     const vehicleRepo = AppDataSource.getRepository(Vehicle);

//     const vehicle = await vehicleRepo.findOneBy({
//       vehicleId: parseInt(req.params.id),
//     });

//     if (!vehicle) {
//       return res.status(404).json({ message: "Vehicle not found" });
//     }

//     vehicle.image = vehicle.image 
//       ? `http://localhost:5000/${vehicle.image}`  
//       : null;

//     res.status(200).json(vehicle);
//   } catch (err) {
//     console.error("Error fetching vehicle by ID:", err);
//     res.status(500).json({ message: "Failed to fetch vehicle" });
//   }
// };



// const createReservation = async (req, res) => {
//   try {
//     const {
//       userId,
//       vehicleId,
//       startDate,
//       endDate,
//       totalAmount,
//       reservationType
//     } = req.body;


//     const reservationRepo = AppDataSource.getRepository("Reservation");
//     const userRepo = AppDataSource.getRepository("User");
//     const vehicleRepo = AppDataSource.getRepository("Vehicle");

//     const user = await userRepo.findOne({ where: { userId: parseInt(userId) } });
//     const vehicle = await vehicleRepo.findOne({ where: { vehicleId: parseInt(vehicleId) } });


//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (!vehicle) {
//       return res.status(404).json({ error: "Vehicle not found" });
//     }

//     const status =
//       reservationType === "Without Driver" ? "Confirmed" : "Pending";

//     const newReservation = reservationRepo.create({
//       user: user,
//       vehicle: vehicle,
//       startDate,
//       endDate,
//       totalAmount,
//       reservationType,
//       status,
//     });

//     console.log("Created reservation:", newReservation);

//     await reservationRepo.save(newReservation);

//     res.status(201).json({ message: "Reservation created", reservation: newReservation });
//   } catch (error) {
//     console.error("Error creating reservation:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getPendingReservations = async (req, res) => {
//   try {
//     const reservationRepo = AppDataSource.getRepository("Reservation");
//     const reservations = await reservationRepo.find({
//       where: {
//         reservationType: "With Driver",
//         isCancelled: false,
//         driver: null,
//         status: "Pending"
//       },
//       relations: ["user", "vehicle"]
//     });

//     const enrichedReservations = reservations.map(reservation => {
//       const startDate = new Date(reservation.startDate);
//       const endDate = new Date(reservation.endDate);
//       const timeDiff = Math.abs(endDate - startDate);
//       const durationDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // duration in days

//       return {
//         id: reservation.reservationId,
//         customerName: reservation.user?.firstName + " " + reservation.user?.lastName,
//         customerPhone: reservation.user?.phoneNo,
//         customerEmail: reservation.user?.email,
//         vehicleId: reservation.vehicle?.vehicleId,
//         vehicleName: reservation.vehicle?.vehicleName,
//         vehicleType: reservation.vehicle?.category,
//         vehicleAvailable: reservation.vehicle?.isAvailable,
//         startDate: reservation.startDate,
//         endDate: reservation.endDate,
//         totalAmount: reservation.totalAmount,
//         duration: `${durationDays} day${durationDays > 1 ? 's' : ''}`,
//         requestDate: reservation.createdAt || reservation.startDate, // fallback
//       };
//     });

//     res.status(200).json(enrichedReservations);
//   } catch (error) {
//     console.error("Error fetching pending reservations:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getConfirmedReservations = async (req, res) => {
//   try {
//     const reservationRepo = AppDataSource.getRepository("Reservation");
//     const reservations = await reservationRepo.find({
//       where: {
//         isCancelled: false,
//         status: "Confirmed" // Get confirmed reservations
//       },
//       relations: ["user", "vehicle"]
//     });

//     const enrichedReservations = reservations.map(reservation => {
//       const startDate = new Date(reservation.startDate);
//       const endDate = new Date(reservation.endDate);
//       const timeDiff = Math.abs(endDate - startDate);
//       const durationDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // duration in days

//       return {
//         id: reservation.reservationId,
//         customerName: reservation.user?.firstName + " " + reservation.user?.lastName,
//         customerPhone: reservation.user?.phoneNo,
//         customerEmail: reservation.user?.email,
//         vehicleId: reservation.vehicle?.vehicleId,
//         vehicleName: reservation.vehicle?.vehicleName,
//         vehicleType: reservation.vehicle?.category,
//         vehicleAvailable: reservation.vehicle?.isAvailable,
//         startDate: reservation.startDate,
//         endDate: reservation.endDate,
//         totalAmount: reservation.totalAmount,
//         duration: `${durationDays} day${durationDays > 1 ? 's' : ''}`,
//         requestDate: reservation.createdAt || reservation.startDate, // fallback
//         status: reservation.status
//       };
//     });

//     res.status(200).json(enrichedReservations);
//   } catch (error) {
//     console.error("Error fetching confirmed reservations without driver:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const toggleVehicleAvailability = async (req, res) => {
//   try {
//     const { vehicleId } = req.params;
//     const { isAvailable } = req.body;

//     const vehicleRepo = AppDataSource.getRepository("Vehicle");
    
//     // Check if vehicle exists
//     const vehicle = await vehicleRepo.findOne({
//       where: { vehicleId: parseInt(vehicleId) }
//     });
    
//     if (!vehicle) {
//       return res.status(404).json({ error: "Vehicle not found" });
//     }

//     // Update availability
//     await vehicleRepo.update(
//       { vehicleId: parseInt(vehicleId) },
//       { isAvailable }
//     );

//     res.status(200).json({ 
//       message: `Vehicle availability updated to ${isAvailable ? 'available' : 'unavailable'}`,
//       vehicleId: parseInt(vehicleId),
//       isAvailable 
//     });
//   } catch (error) {
//     console.error('Error updating vehicle availability:', error);
//     res.status(500).json({ error: 'Failed to update vehicle availability' });
//   }
// };

// const getPendingVehicles = async (req, res) => {
//   try {
//     const vehicleRepo = AppDataSource.getRepository(Vehicle);
//     const vehicles = await vehicleRepo.find({
//       where: { status: "pending" },
//       relations: ["user"],
//     });

//     const mapped = vehicles.map((v) => ({
//   id: v.vehicleId,
//   name: v.vehicleName,
//   price: v.price,
//   category: v.category,
//   description: v.description,
//   status: v.status,
//   image: v.image,
//   ownerName: v.user ? `${v.user.firstName} ${v.user.lastName}` : "Unknown",
//   ownerPhone: v.user?.phoneNo || "N/A",
//   documents: [], // handle documents if implemented
// }));

//     res.json(mapped);
//   } catch (error) {
//     console.error("Error fetching pending vehicles:", error);
//     res.status(500).json({ error: "Failed to fetch vehicles" });
//   }
// };

// const getMyBookings = async (req, res) => {
//   try {
//     const userId = req.user.id; // still correct here

//     const reservationRepo = AppDataSource.getRepository(Reservation);

//     const bookings = await reservationRepo.find({
//       where: { user: { userId } }, // 🔥 the key fix
//       relations: ["vehicle"],
//       order: { startDate: "DESC" },
//     });

//     res.status(200).json(bookings);
//   } catch (error) {
//     console.error("Error in getMyBookings:", error);
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// };

// const getAvailableDrivers = async (req, res) => {
//   try {
//     const userRepository = AppDataSource.getRepository("User");

//     const drivers = await userRepository.find({
//       where: {
//         role: "Driver",
//         isAvailable: true,
//       },
//       select: ["userId", "firstName", "lastName", "email", "phoneNo"], // select only needed fields
//     });

//     res.json(drivers);
//   } catch (error) {
//     console.error("Error fetching available drivers:", error);
//     res.status(500).json({ message: "Failed to fetch available drivers" });
//   }
// };

// // const assignDriver = async (req, res) => {
// //   const { reservationId, driverId } = req.body;

// //   try {
// //     const reservationRepo = AppDataSource.getRepository(Reservation);
// //     const driverRepo = AppDataSource.getRepository(User);
// //     const logRepo = AppDataSource.getRepository(ReservationDriverLog);

// //     const reservation = await reservationRepo.findOneBy({ reservationId });
// //     if (!reservation) {
// //       return res.status(404).json({ message: "Reservation not found." });
// //     }

// //     const driver = await driverRepo.findOneBy({ userId: driverId });
// //     if (!driver || driver.role !== "Driver") {
// //       return res.status(400).json({ message: "Invalid driver selected." });
// //     }

// //     const log = logRepo.create({
// //       reservation,
// //       driver,
// //       status: "Pending" // or "Requested", your choice
// //     });
// //     await logRepo.save(log);

// //     return res.status(200).json({ message: "Driver assignment request sent successfully." });

// //   } catch (error) {
// //     console.error("Assign driver error:", error);
// //     return res.status(500).json({ message: "Internal server error." });
// //   }
// // };

// const assignDriver = async (req, res) => {
//   const { reservationId, driverId } = req.body;

//   try {
//     const reservationRepo = AppDataSource.getRepository(Reservation);
//     const driverRepo = AppDataSource.getRepository(User);
//     const logRepo = AppDataSource.getRepository(ReservationDriverLog);

//     const reservation = await reservationRepo.findOneBy({ reservationId });
//     if (!reservation) {
//       return res.status(404).json({ message: "Reservation not found." });
//     }

//     const driver = await driverRepo.findOneBy({ userId: driverId });
//     if (!driver || driver.role !== "Driver") {
//       return res.status(400).json({ message: "Invalid driver selected." });
//     }

//     // Update reservation status
//     reservation.status = "Requested"; // mark as requested
//     await reservationRepo.save(reservation); // persist change

//     // Create log
//     const log = logRepo.create({
//       reservation,
//       driver,
//       status: "Pending" // driver hasn't confirmed yet
//     });
//     await logRepo.save(log);

//     return res.status(200).json({ message: "Driver requested successfully" });

//   } catch (error) {
//     console.error("Assign driver error:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };



// const getAssignedRides = async (req, res) => {
//   try {
//     const driverId = req.user.id; 

//     const logRepo = AppDataSource.getRepository(ReservationDriverLog);

//     const assignedLogs = await logRepo.find({
//       where: { driver: { userId: driverId }, status: "Pending" },
//       relations: ["reservation", "reservation.user", "reservation.vehicle"]
//     });

//     const formatted = assignedLogs.map(log => ({
//       id: log.reservation.reservationId,
//       status: "assigned",
//       vehicleName: log.reservation.vehicle?.vehicleName || "N/A",
//       date: log.reservation.startDate,
//       endDate: log.reservation.endDate,
//       customer: {
//         firstName: log.reservation.user?.firstName || "",
//         lastName: log.reservation.user?.lastName || "",
//         phone: log.reservation.user?.phoneNo || "",
//         email: log.reservation.user?.email || ""
//       }
//     }));

//     res.status(200).json(formatted);
//   } catch (error) {
//     console.error("Error fetching assigned rides:", error);
//     res.status(500).json({ error: "Failed to fetch assigned rides" });
//   }
// };

// // const acceptRide = async (req, res) => {
// //   const { reservationId } = req.body;
// //   const driverId = req.user.id; // from JWT middleware

// //   try {
// //     const reservationRepo = AppDataSource.getRepository("Reservation");
// //     const userRepo = AppDataSource.getRepository("User");
// //     const logRepo = AppDataSource.getRepository("ReservationDriverLog");

// //     // Find the reservation
// //     const reservation = await reservationRepo.findOne({
// //       where: { reservationId: parseInt(reservationId) },
// //       relations: ["user", "vehicle"]
// //     });

// //     if (!reservation) {
// //       return res.status(404).json({ error: "Reservation not found" });
// //     }

// //     // Find the driver log entry for this reservation and driver
// //     const driverLog = await logRepo.findOne({
// //       where: { 
// //         reservation: { reservationId: parseInt(reservationId) },
// //         driver: { userId: driverId },
// //         status: "Pending"
// //       },
// //       relations: ["reservation", "driver"]
// //     });

// //     if (!driverLog) {
// //       return res.status(404).json({ error: "No pending assignment found for this ride" });
// //     }

// //     // Start database transaction
// //     await AppDataSource.transaction(async (transactionalEntityManager) => {
// //       // 1. Update reservation status to "Confirmed" and assign driver
// //       await transactionalEntityManager.update("Reservation", 
// //         { reservationId: parseInt(reservationId) },
// //         { 
// //           status: "Confirmed",
// //           driver: { userId: driverId }
// //         }
// //       );

// //       // 2. Update driver log status to "Assigned" 
// //       await transactionalEntityManager.update("ReservationDriverLog",
// //         { logId: driverLog.logId },
// //         { status: "Assigned" }
// //       );

// //       // 3. Update driver availability to false
// //       await transactionalEntityManager.update("User",
// //         { userId: driverId },
// //         { isAvailable: false }
// //       );

// //       // 4. Reject all other pending assignments for this reservation
// //       await transactionalEntityManager.update("ReservationDriverLog",
// //         { 
// //           reservation: { reservationId: parseInt(reservationId) },
// //           logId: transactionalEntityManager.not(driverLog.logId),
// //           status: "Pending"
// //         },
// //         { status: "Rejected" }
// //       );
// //     });

// //     res.status(200).json({ 
// //       message: "Ride accepted successfully",
// //       reservationId: parseInt(reservationId),
// //       status: "Confirmed"
// //     });

// //   } catch (error) {
// //     console.error("Error accepting ride:", error);
// //     res.status(500).json({ error: "Failed to accept ride" });
// //   }
// // };

// const acceptRide = async (req, res) => {
//   const { reservationId } = req.body;
//   const driverId = req.user.id;

//   try {
//     const reservationRepo = AppDataSource.getRepository("Reservation");
//     const logRepo = AppDataSource.getRepository("ReservationDriverLog");
//     const userRepo = AppDataSource.getRepository("User");

//     const reservation = await reservationRepo.findOne({
//       where: { reservationId: parseInt(reservationId) },
//       relations: ["user", "vehicle", "driver"]
//     });
//     if (!reservation) return res.status(404).json({ error: "Reservation not found" });

//     const driverLog = await logRepo.findOne({
//       where: {
//         reservation: { reservationId: parseInt(reservationId) },
//         driver: { userId: driverId },
//         status: "Pending"
//       }
//     });
//     if (!driverLog) return res.status(404).json({ error: "No pending assignment found for this ride" });

//     // Reject other pending logs for this reservation
//     const otherLogs = await logRepo.find({
//       where: {
//         reservation: { reservationId: parseInt(reservationId) },
//         logId: Not(driverLog.logId),
//         status: "Pending"
//       }
//     });
//     for (const log of otherLogs) {
//       log.status = "Rejected";
//       await logRepo.save(log);
//     }

//     // Update the accepted driver's log
//     driverLog.status = "Assigned";
//     await logRepo.save(driverLog);

//     // Update reservation driver and status
//     reservation.driver = { userId: driverId };
//     reservation.status = "Confirmed";
//     await reservationRepo.save(reservation);

//     // Update driver availability
//     const driver = await userRepo.findOneBy({ userId: driverId });
//     driver.isAvailable = false;
//     await userRepo.save(driver);

//     res.status(200).json({ message: "Ride accepted successfully", reservationId: reservation.reservationId, status: reservation.status });

//   } catch (error) {
//     console.error("Error accepting ride:", error);
//     res.status(500).json({ error: "Failed to accept ride" });
//   }
// };

// // const rejectRide = async (req, res) => {
// //   const { reservationId } = req.body;
// //   const driverId = req.user.id;

// //   try {
// //     const logRepo = AppDataSource.getRepository("ReservationDriverLog");

// //     // Find the driver log entry for this reservation and driver
// //     const driverLog = await logRepo.findOne({
// //       where: { 
// //         reservation: { reservationId: parseInt(reservationId) },
// //         driver: { userId: driverId },
// //         status: "Pending"
// //       }
// //     });

// //     if (!driverLog) {
// //       return res.status(404).json({ error: "No pending assignment found for this ride" });
// //     }

// //     // Update the log status to "Rejected"
// //     await logRepo.update(
// //       { logId: driverLog.logId },
// //       { status: "Rejected" }
// //     );

// //     res.status(200).json({ 
// //       message: "Ride rejected successfully",
// //       reservationId: parseInt(reservationId)
// //     });

// //   } catch (error) {
// //     console.error("Error rejecting ride:", error);
// //     res.status(500).json({ error: "Failed to reject ride" });
// //   }
// // };

// const rejectRide = async (req, res) => {
//   const { reservationId } = req.body;
//   const driverId = req.user.id;

//   try {
//     const logRepo = AppDataSource.getRepository("ReservationDriverLog");
//     const reservationRepo = AppDataSource.getRepository("Reservation");
//     const userRepo = AppDataSource.getRepository("User");

//     // Find the driver log entry for this reservation and driver
//     const driverLog = await logRepo.findOne({
//       where: { 
//         reservation: { reservationId: parseInt(reservationId) },
//         driver: { userId: driverId },
//         status: "Pending"
//       },
//       relations: ["driver", "reservation"]
//     });

//     if (!driverLog) {
//       return res.status(404).json({ error: "No pending assignment found for this ride" });
//     }

//     // Get driver details for the response message
//     const driver = await userRepo.findOneBy({ userId: driverId });
//     const driverName = `${driver.firstName} ${driver.lastName}`;

//     // Update the log status to "Rejected"
//     await logRepo.update(
//       { logId: driverLog.logId },
//       { status: "Rejected" }
//     );

//     // Update reservation status back to "Pending" 
//     await reservationRepo.update(
//       { reservationId: parseInt(reservationId) },
//       { status: "Pending" }
//     );

//     res.status(200).json({ 
//       message: `${driverName} rejected the request`,
//       reservationId: parseInt(reservationId),
//       driverName: driverName
//     });

//   } catch (error) {
//     console.error("Error rejecting ride:", error);
//     res.status(500).json({ error: "Failed to reject ride" });
//   }
// };

// const getConfirmedRidesForDriver = async (req, res) => {
//   try {
//     const driverId = req.user.id;

//     const reservationRepo = AppDataSource.getRepository("Reservation");
    
//     const confirmedRides = await reservationRepo.find({
//       where: {
//         driver: { userId: driverId },
//         status: "Confirmed",
//         isCancelled: false
//       },
//       relations: ["user", "vehicle"],
//       order: { startDate: "ASC" }
//     });

//     const formatted = confirmedRides.map(reservation => ({
//       id: reservation.reservationId,
//       status: reservation.status.toLowerCase(),
//       vehicleName: reservation.vehicle?.vehicleName || "N/A",
//       date: reservation.startDate,
//       endDate: reservation.endDate,
//       totalAmount: reservation.totalAmount,
//       customer: {
//         firstName: reservation.user?.firstName || "",
//         lastName: reservation.user?.lastName || "",
//         phone: reservation.user?.phoneNo || "",
//         email: reservation.user?.email || ""
//       }
//     }));

//     res.status(200).json(formatted);

//   } catch (error) {
//     console.error("Error fetching confirmed rides for driver:", error);
//     res.status(500).json({ error: "Failed to fetch confirmed rides" });
//   }
// };




// module.exports = {
//   postVehicle,
//   getAllVehicles,
//   getVehicleById,
//   createReservation,
//   getPendingReservations,
//   getConfirmedReservations,
//   toggleVehicleAvailability,
//   getPendingVehicles,
//   getMyBookings,
//   getAvailableDrivers,
//   assignDriver,
//   getAssignedRides,
//   acceptRide,
//   rejectRide,
//   getConfirmedRidesForDriver

// };

const AppDataSource = require("../config/config");
const Vehicle = require("../models/vehicle");
const Reservation = require("../models/reservation");
const User = require("../models/user");
const ReservationDriverLog = require("../models/reservationDriverLog");
const { Not } = require("typeorm");



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
        driver: null,
        status: "Pending"
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

const getConfirmedReservations = async (req, res) => {
  try {
    const reservationRepo = AppDataSource.getRepository("Reservation");
    const reservations = await reservationRepo.find({
      where: {
        isCancelled: false,
        status: "Confirmed" // Get confirmed reservations
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
        status: reservation.status
      };
    });

    res.status(200).json(enrichedReservations);
  } catch (error) {
    console.error("Error fetching confirmed reservations without driver:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id; // still correct here

    const reservationRepo = AppDataSource.getRepository(Reservation);

    const bookings = await reservationRepo.find({
      where: { user: { userId } }, // 🔥 the key fix
      relations: ["vehicle"],
      order: { startDate: "DESC" },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getMyBookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

const getAvailableDrivers = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository("User");

    const drivers = await userRepository.find({
      where: {
        role: "Driver",
        isAvailable: true,
      },
      select: ["userId", "firstName", "lastName", "email", "phoneNo"], // select only needed fields
    });

    res.json(drivers);
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    res.status(500).json({ message: "Failed to fetch available drivers" });
  }
};

// const assignDriver = async (req, res) => {
//   const { reservationId, driverId } = req.body;

//   try {
//     const reservationRepo = AppDataSource.getRepository(Reservation);
//     const driverRepo = AppDataSource.getRepository(User);
//     const logRepo = AppDataSource.getRepository(ReservationDriverLog);

//     const reservation = await reservationRepo.findOneBy({ reservationId });
//     if (!reservation) {
//       return res.status(404).json({ message: "Reservation not found." });
//     }

//     const driver = await driverRepo.findOneBy({ userId: driverId });
//     if (!driver || driver.role !== "Driver") {
//       return res.status(400).json({ message: "Invalid driver selected." });
//     }

//     const log = logRepo.create({
//       reservation,
//       driver,
//       status: "Pending" // or "Requested", your choice
//     });
//     await logRepo.save(log);

//     return res.status(200).json({ message: "Driver assignment request sent successfully." });

//   } catch (error) {
//     console.error("Assign driver error:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

const assignDriver = async (req, res) => {
  const { reservationId, driverId } = req.body;

  try {
    const reservationRepo = AppDataSource.getRepository(Reservation);
    const driverRepo = AppDataSource.getRepository(User);
    const logRepo = AppDataSource.getRepository(ReservationDriverLog);

    const reservation = await reservationRepo.findOneBy({ reservationId });
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    const driver = await driverRepo.findOneBy({ userId: driverId });
    if (!driver || driver.role !== "Driver") {
      return res.status(400).json({ message: "Invalid driver selected." });
    }

    // Update reservation status
    reservation.status = "Requested"; // mark as requested
    await reservationRepo.save(reservation); // persist change

    // Create log
    const log = logRepo.create({
      reservation,
      driver,
      status: "Pending" // driver hasn't confirmed yet
    });
    await logRepo.save(log);

    return res.status(200).json({ message: "Driver requested successfully" });

  } catch (error) {
    console.error("Assign driver error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};



const getAssignedRides = async (req, res) => {
  try {
    const driverId = req.user.id; 

    const logRepo = AppDataSource.getRepository(ReservationDriverLog);

    const assignedLogs = await logRepo.find({
      where: { driver: { userId: driverId }, status: "Pending" },
      relations: ["reservation", "reservation.user", "reservation.vehicle"]
    });

    const formatted = assignedLogs.map(log => ({
      id: log.reservation.reservationId,
      status: "assigned",
      vehicleName: log.reservation.vehicle?.vehicleName || "N/A",
      date: log.reservation.startDate,
      endDate: log.reservation.endDate,
      customer: {
        firstName: log.reservation.user?.firstName || "",
        lastName: log.reservation.user?.lastName || "",
        phone: log.reservation.user?.phoneNo || "",
        email: log.reservation.user?.email || ""
      }
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching assigned rides:", error);
    res.status(500).json({ error: "Failed to fetch assigned rides" });
  }
};

// const acceptRide = async (req, res) => {
//   const { reservationId } = req.body;
//   const driverId = req.user.id; // from JWT middleware

//   try {
//     const reservationRepo = AppDataSource.getRepository("Reservation");
//     const userRepo = AppDataSource.getRepository("User");
//     const logRepo = AppDataSource.getRepository("ReservationDriverLog");

//     // Find the reservation
//     const reservation = await reservationRepo.findOne({
//       where: { reservationId: parseInt(reservationId) },
//       relations: ["user", "vehicle"]
//     });

//     if (!reservation) {
//       return res.status(404).json({ error: "Reservation not found" });
//     }

//     // Find the driver log entry for this reservation and driver
//     const driverLog = await logRepo.findOne({
//       where: { 
//         reservation: { reservationId: parseInt(reservationId) },
//         driver: { userId: driverId },
//         status: "Pending"
//       },
//       relations: ["reservation", "driver"]
//     });

//     if (!driverLog) {
//       return res.status(404).json({ error: "No pending assignment found for this ride" });
//     }

//     // Start database transaction
//     await AppDataSource.transaction(async (transactionalEntityManager) => {
//       // 1. Update reservation status to "Confirmed" and assign driver
//       await transactionalEntityManager.update("Reservation", 
//         { reservationId: parseInt(reservationId) },
//         { 
//           status: "Confirmed",
//           driver: { userId: driverId }
//         }
//       );

//       // 2. Update driver log status to "Assigned" 
//       await transactionalEntityManager.update("ReservationDriverLog",
//         { logId: driverLog.logId },
//         { status: "Assigned" }
//       );

//       // 3. Update driver availability to false
//       await transactionalEntityManager.update("User",
//         { userId: driverId },
//         { isAvailable: false }
//       );

//       // 4. Reject all other pending assignments for this reservation
//       await transactionalEntityManager.update("ReservationDriverLog",
//         { 
//           reservation: { reservationId: parseInt(reservationId) },
//           logId: transactionalEntityManager.not(driverLog.logId),
//           status: "Pending"
//         },
//         { status: "Rejected" }
//       );
//     });

//     res.status(200).json({ 
//       message: "Ride accepted successfully",
//       reservationId: parseInt(reservationId),
//       status: "Confirmed"
//     });

//   } catch (error) {
//     console.error("Error accepting ride:", error);
//     res.status(500).json({ error: "Failed to accept ride" });
//   }
// };

const acceptRide = async (req, res) => {
  const { reservationId } = req.body;
  const driverId = req.user.id;

  try {
    const reservationRepo = AppDataSource.getRepository("Reservation");
    const logRepo = AppDataSource.getRepository("ReservationDriverLog");
    const userRepo = AppDataSource.getRepository("User");

    const reservation = await reservationRepo.findOne({
      where: { reservationId: parseInt(reservationId) },
      relations: ["user", "vehicle", "driver"]
    });
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    const driverLog = await logRepo.findOne({
      where: {
        reservation: { reservationId: parseInt(reservationId) },
        driver: { userId: driverId },
        status: "Pending"
      }
    });
    if (!driverLog) return res.status(404).json({ error: "No pending assignment found for this ride" });

    // Reject other pending logs for this reservation
    const otherLogs = await logRepo.find({
      where: {
        reservation: { reservationId: parseInt(reservationId) },
        logId: Not(driverLog.logId),
        status: "Pending"
      }
    });
    for (const log of otherLogs) {
      log.status = "Rejected";
      await logRepo.save(log);
    }

    // Update the accepted driver's log
    driverLog.status = "Assigned";
    await logRepo.save(driverLog);

    // Update reservation driver and status
    reservation.driver = { userId: driverId };
    reservation.status = "Confirmed";
    await reservationRepo.save(reservation);

    // Update driver availability
    const driver = await userRepo.findOneBy({ userId: driverId });
    driver.isAvailable = false;
    await userRepo.save(driver);

    res.status(200).json({ message: "Ride accepted successfully", reservationId: reservation.reservationId, status: reservation.status });

  } catch (error) {
    console.error("Error accepting ride:", error);
    res.status(500).json({ error: "Failed to accept ride" });
  }
};

// const rejectRide = async (req, res) => {
//   const { reservationId } = req.body;
//   const driverId = req.user.id;

//   try {
//     const logRepo = AppDataSource.getRepository("ReservationDriverLog");

//     // Find the driver log entry for this reservation and driver
//     const driverLog = await logRepo.findOne({
//       where: { 
//         reservation: { reservationId: parseInt(reservationId) },
//         driver: { userId: driverId },
//         status: "Pending"
//       }
//     });

//     if (!driverLog) {
//       return res.status(404).json({ error: "No pending assignment found for this ride" });
//     }

//     // Update the log status to "Rejected"
//     await logRepo.update(
//       { logId: driverLog.logId },
//       { status: "Rejected" }
//     );

//     res.status(200).json({ 
//       message: "Ride rejected successfully",
//       reservationId: parseInt(reservationId)
//     });

//   } catch (error) {
//     console.error("Error rejecting ride:", error);
//     res.status(500).json({ error: "Failed to reject ride" });
//   }
// };

const rejectRide = async (req, res) => {
  const { reservationId } = req.body;
  const driverId = req.user.id;

  try {
    const logRepo = AppDataSource.getRepository("ReservationDriverLog");
    const reservationRepo = AppDataSource.getRepository("Reservation");
    const userRepo = AppDataSource.getRepository("User");

    // Find the driver log entry for this reservation and driver
    const driverLog = await logRepo.findOne({
      where: { 
        reservation: { reservationId: parseInt(reservationId) },
        driver: { userId: driverId },
        status: "Pending"
      },
      relations: ["driver", "reservation"]
    });

    if (!driverLog) {
      return res.status(404).json({ error: "No pending assignment found for this ride" });
    }

    // Get driver details for the response message
    const driver = await userRepo.findOneBy({ userId: driverId });
    const driverName = `${driver.firstName} ${driver.lastName}`;

    // Update the log status to "Rejected"
    await logRepo.update(
      { logId: driverLog.logId },
      { status: "Rejected" }
    );

    // Update reservation status back to "Pending" 
    await reservationRepo.update(
      { reservationId: parseInt(reservationId) },
      { status: "Pending" }
    );

    res.status(200).json({ 
      message: `${driverName} rejected the request`,
      reservationId: parseInt(reservationId),
      driverName: driverName
    });

  } catch (error) {
    console.error("Error rejecting ride:", error);
    res.status(500).json({ error: "Failed to reject ride" });
  }
};

const getConfirmedRidesForDriver = async (req, res) => {
  try {
    const driverId = req.user.id;

    const reservationRepo = AppDataSource.getRepository("Reservation");
    
    const confirmedRides = await reservationRepo.find({
      where: {
        driver: { userId: driverId },
        status: "Confirmed",
        isCancelled: false
      },
      relations: ["user", "vehicle"],
      order: { startDate: "ASC" }
    });

    const formatted = confirmedRides.map(reservation => ({
      id: reservation.reservationId,
      status: reservation.status.toLowerCase(),
      vehicleName: reservation.vehicle?.vehicleName || "N/A",
      date: reservation.startDate,
      endDate: reservation.endDate,
      totalAmount: reservation.totalAmount,
      customer: {
        firstName: reservation.user?.firstName || "",
        lastName: reservation.user?.lastName || "",
        phone: reservation.user?.phoneNo || "",
        email: reservation.user?.email || ""
      }
    }));

    res.status(200).json(formatted);

  } catch (error) {
    console.error("Error fetching confirmed rides for driver:", error);
    res.status(500).json({ error: "Failed to fetch confirmed rides" });
  }
};

const rejectReservation = async (req, res) => {
  const reservationId = parseInt(req.params.reservationId);

  try {
    const reservationRepo = AppDataSource.getRepository("Reservation");
    const reservation = await reservationRepo.findOneBy({ reservationId });
    console.log("Rejecting reservationId:", reservationId, "Found:", reservation);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = "Rejected";
    reservation.isCancelled = true; // optional, mark as cancelled
    await reservationRepo.save(reservation);

    return res.status(200).json({ message: "Reservation rejected successfully" });
  } catch (error) {
    console.error("Error rejecting reservation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getReservationCounts = async (req, res) => {
  try {
    const reservationRepository = AppDataSource.getRepository("Reservation"); // ✅ use entity name string

    const pendingCount = await reservationRepository.count({ where: { status: "Pending" } });
    const confirmedCount = await reservationRepository.count({ where: { status: "Confirmed" } });
    const rejectedCount = await reservationRepository.count({ where: { status: "Rejected" } });

    res.json({
      pending: pendingCount,
      confirmed: confirmedCount,
      rejected: rejectedCount,
    });
  } catch (error) {
    console.error("Error fetching reservation counts:", error);
    res.status(500).json({ error: "Failed to fetch reservation counts" });
  }
};





module.exports = {
  createReservation,
  getPendingReservations,
  getConfirmedReservations,
  getMyBookings,
  getAvailableDrivers,
  assignDriver,
  getAssignedRides,
  acceptRide,
  rejectRide,
  getConfirmedRidesForDriver,
  rejectReservation,
  getReservationCounts

};

