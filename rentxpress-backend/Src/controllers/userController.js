const AppDataSource = require("../config/config");
const User = require("../models/user");
const VerificationRequest = require("../models/verificationRequest");
const { getRepository } = require("typeorm");
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');


const userRepository = AppDataSource.getRepository("User");
const verificationRepo = AppDataSource.getRepository("VerificationRequest");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, password } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Save user with plain text password (not secure)
    const newUser = userRepository.create({
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      role: "User",
    });

    await userRepository.save(newUser);
    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userRepository.findOne({ where: { userId: req.params.id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    await userRepository.remove(user);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const submitVerification = async (req, res) => {
  try {
    const { firstName, lastName, age, phoneNo, nic, dateOfBirth, role } = req.body;

    const userId = req.user.id; // Use token's user ID

    // Handle different file types based on role
    const documentPaths = {};
    
    // NIC document is required for all roles
    if (req.files.nicDocument && req.files.nicDocument[0]) {
      documentPaths.nicDocument = `/uploads/${req.files.nicDocument[0].filename}`;
    }

    // Role-specific documents
    if (role === "Driver" && req.files.licenseDocument && req.files.licenseDocument[0]) {
      documentPaths.licenseDocument = `/uploads/${req.files.licenseDocument[0].filename}`;
    }

    if (role === "Vehicle Owner" && req.files.vehicleRegistration && req.files.vehicleRegistration[0]) {
      documentPaths.vehicleRegistration = `/uploads/${req.files.vehicleRegistration[0].filename}`;
    }

    const verificationRequest = verificationRepo.create({
      firstName,
      lastName,
      age,
      phoneNo,
      nic,
      dateOfBirth,
      role,
      identification: JSON.stringify(documentPaths), // Store all document paths
      status: "pending",
      user: { userId },
    });

    await verificationRepo.save(verificationRequest);

    res.status(201).json({ 
      message: "Verification submitted successfully",
      documents: Object.keys(documentPaths)
    });
  } catch (error) {
    console.error("Submit verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ userId: req.user.id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: 'Failed to get user profile' });
  }
};

const approveVerification = async (req, res) => {
  try {
    console.log("🔔 approveVerification API hit");

    const verifyId = req.params.id;

    const request = await verificationRepo.findOne({
      where: { verifyId },
      relations: ["user"],
    });

    console.log("⚠️ request fetched:", request);

    if (!request) {
      return res.status(404).json({ message: "Verification request not found" });
    }

    const userId = request.user?.userId;

    if (!userId) {
      return res.status(404).json({ message: "Linked user not found" });
    }

    console.log("🧾 Will update userId:", userId);
    console.log("Data:", {
      role: request.role,
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      nic: request.nic,
      age: request.age,
      phoneNo: request.phoneNo,
    });

    await userRepository.update(userId, {
      role: request.role,
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      nic: request.nic,
      age: request.age,
      phoneNo: request.phoneNo,
    });

    request.status = "approved";
    await verificationRepo.save(request);

    res.json({ message: "User verified and data updated successfully" });
  } catch (error) {
    console.error("❌ Approve verification error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  console.log("🛠 deleteUserProfile called");
  console.log("🧠 req.user:", req.user);

  try {
    const userRepository = AppDataSource.getRepository(User);

    const result = await userRepository.delete({ userId: req.user.id });

    if (result.affected === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getPendingVerifications = async (req, res) => {
  const repo = AppDataSource.getRepository("VerificationRequest");
  const pendingRequests = await repo.find({
    where: { status: "pending" },
    relations: ["user"],
  });
  res.json(pendingRequests);
};


const getUserCountsByRole = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const results = await userRepository
      .createQueryBuilder("user")
      .select("user.role", "role")
      .addSelect("COUNT(*)", "count")
      .groupBy("user.role")
      .getRawMany();

    // Optional: Format into a role-count object
    const counts = results.reduce((acc, curr) => {
      acc[curr.role] = parseInt(curr.count);
      return acc;
    }, {});

    res.status(200).json(counts);
  } catch (error) {
    console.error("Error fetching user counts:", error);
    res.status(500).json({ message: "Failed to fetch user counts" });
  }
};


const rejectVerification = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const verificationRepo = AppDataSource.getRepository("VerificationRequest");

    const existing = await verificationRepo.findOneBy({ verifyId: parseInt(id) });

    if (!existing) {
      return res.status(404).json({ message: "Verification request not found" });
    }

    await verificationRepo.update(id, {
      status: "rejected",
      issueDetails: reason,
    });

    res.status(200).json({ message: "Verification rejected" });
  } catch (err) {
    console.error("Rejection error:", err);
    res.status(500).json({ message: "Failed to reject verification" });
  }
};


const getVerificationIssues = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository("VerificationRequest");

    const rejectedRequests = await repo.find({
      where: { status: "rejected" },
      relations: ["user"],
    });

    const formatted = rejectedRequests.map((req) => ({
      userId: req.user?.userId,
      userName: `${req.firstName} ${req.lastName}`,
      issue: req.issueDetails || "No issue specified",
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching verification issues:", error);
    res.status(500).json({ message: "Failed to fetch verification issues" });
  }
};



const getMyVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const repo = AppDataSource.getRepository(VerificationRequest);
    const latestRequest = await repo.findOne({
      where: { user: { userId } },
      order: { verifyId: "DESC" },
    });

    if (!latestRequest) {
      return res.status(404).json({ message: "No verification request found" });
    }

    return res.status(200).json(latestRequest);
  } catch (error) {
    console.error("Error fetching verification status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../../uploads", filename); // Adjust path as needed

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  // Get the MIME type
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  
  // Set proper headers
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  // Send the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("File send error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error sending file" });
      }
    }
  });
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body; 
    const userId = req.user.id; // set by auth middleware
    const repo = AppDataSource.getRepository(User);

    const foundUser = await repo.findOneBy({ userId });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (foundUser.password !== currentPassword) {  
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    foundUser.password = newPassword; 
    await repo.save(foundUser);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createUser,
  getUsers,
  deleteUser,
  submitVerification,
  getProfile,
  deleteUserProfile,
  getPendingVerifications,
  approveVerification,
  getUserCountsByRole,
  rejectVerification,
  getVerificationIssues,
  getMyVerificationStatus,
  downloadFile,
  changePassword
};
