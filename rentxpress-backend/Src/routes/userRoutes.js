const express = require("express");
const multer = require("multer");
const verifyToken = require('../middleware/authMiddleware');
const { createUser, getUsers, deleteUser, submitVerification, getProfile, deleteUserProfile, 
  getPendingVerifications, approveVerification,getUserCountsByRole, rejectVerification, getVerificationIssues} = require("../controllers/userController");
const { login } = require('../controllers/authController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

const fs = require("fs");
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");



router.post("/", createUser);
router.get("/", getUsers);
router.delete("/delete", verifyToken, deleteUserProfile);
router.delete("/:id", deleteUser);
// router.post("/verify", verifyToken, upload.single("identification"), submitVerification);
router.post("/verify", verifyToken, upload.array("identification", 5), submitVerification);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.get("/verify/pending", verifyToken, getPendingVerifications);
router.patch("/verify/:id/approve", verifyToken, approveVerification);
router.get("/counts", getUserCountsByRole);
router.patch("/verify/:id/reject", verifyToken, rejectVerification);
router.get("/verify/issues", verifyToken, getVerificationIssues);


module.exports = router;
