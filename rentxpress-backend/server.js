// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const dataSource = require("./Src/config/config"); // Import the database connection
// const userRoutes = require("./Src/routes/userRoutes");
// const reservationRoutes = require("./Src/routes/reservationRoutes");
// const path = require("path");

// // Load environment variables from .env file
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json()); // Parse JSON request bodies
// app.use(cors()); // Enable CORS for frontend communication

// // Test Route
// app.get("/", (req, res) => {
//     res.send("RentXpress API is running...");
// });

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api/users", userRoutes);
// app.use("/api/reservation", reservationRoutes);

// // Start Server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// dataSource.initialize()
//     .then(() => {
//         console.log("Database connected successfully!");
//     })
//     .catch((error) => console.error("Database connection failed:", error));


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dataSource = require("./Src/config/config");
const userRoutes = require("./Src/routes/userRoutes");
const reservationRoutes = require("./Src/routes/reservationRoutes");
const path = require("path");
const mime = require('mime-types');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Custom middleware for serving uploads with proper MIME types
app.use("/uploads", (req, res, next) => {
  const filePath = path.join(__dirname, "uploads", req.path);
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  res.setHeader('Content-Type', mimeType);
  next();
}, express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req, res) => {
    res.send("RentXpress API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/reservation", reservationRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

dataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch((error) => console.error("Database connection failed:", error));