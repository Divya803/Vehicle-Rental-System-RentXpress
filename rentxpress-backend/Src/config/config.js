// src/config/config.js
const { DataSource } = require("typeorm");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Reservation = require("../models/reservation");
const Payment = require("../models/payment");
const VerificationRequest = require("../models/verificationRequest");

const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",    // Local PostgreSQL server
    port: 5432,          // Default PostgreSQL port
    username: "postgres", // Your PostgreSQL username
    password: "Divya803", // Your PostgreSQL password
    database: "rentxpress",  // Your local database name
    entities: [User, Vehicle, Reservation, Payment, VerificationRequest],
    synchronize: true,   // ⚠️ Set to `false` in production, use migrations instead
    logging: false,      // Change to `true` if you want SQL logs in the console
});

module.exports = dataSource;
