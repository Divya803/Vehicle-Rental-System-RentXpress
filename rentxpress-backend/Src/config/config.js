
const { DataSource } = require("typeorm");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Reservation = require("../models/reservation");
const Payment = require("../models/payment");
const VerificationRequest = require("../models/verificationRequest");
const ReservationDriverLog = require("../models/reservationDriverLog");
const Review = require("../models/review");
const review = require("../models/review");

const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",    
    port: 5432,         
    username: "postgres", 
    password: "Divya803", 
    database: "rentxpress",  
    entities: [User, Vehicle, Reservation, Payment, VerificationRequest, ReservationDriverLog, Review],
    synchronize: true,   
    logging: false,     
});

module.exports = dataSource;
