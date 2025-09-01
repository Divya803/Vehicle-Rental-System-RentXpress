const express = require("express");
const multer = require("multer");
const verifyToken = require('../middleware/authMiddleware');
const { createUser, getUsers, deleteUser, submitVerification, getProfile, deleteUserProfile, 
  getPendingVerifications, approveVerification,getUserCountsByRole, rejectVerification, getVerificationIssues, 
  getMyVerificationStatus, downloadFile, changePassword, forgotPassword} = require("../controllers/userController");
const { login } = require('../controllers/authController');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post("/", createUser);
router.get("/", getUsers);
router.delete("/delete", verifyToken, deleteUserProfile);
router.delete("/:id", deleteUser);
router.post('/verify', 
  verifyToken, 
  upload.fields([
    { name: 'nicDocument', maxCount: 1 },
    { name: 'licenseDocument', maxCount: 1 },
    { name: 'vehicleRegistration', maxCount: 1 }
  ]), 
  submitVerification
);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.get("/verify/pending", verifyToken, getPendingVerifications);
router.patch("/verify/:id/approve", verifyToken, approveVerification);
router.get("/counts", getUserCountsByRole);
router.patch("/verify/:id/reject", verifyToken, rejectVerification);
router.get("/verify/issues", verifyToken, getVerificationIssues);
router.get("/myVerificationStatus", verifyToken, getMyVerificationStatus);
router.get("/file/:filename", downloadFile);
router.put("/change-password", verifyToken, changePassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;