const jwt = require('jsonwebtoken');
const dataSource = require("../config/config"); // ✅ Correct path/ Import the database connection
const User = require('../models/user'); // Your User entity
const bcrypt = require("bcrypt");

const JWT_SECRET = 'your_jwt_secret_key'; // Use env in production

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRepository = dataSource.getRepository(User);
    const foundUser = await userRepository.findOneBy({ email });

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: foundUser.userId, role: foundUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      role: foundUser.role,
      userId: foundUser.userId,
      userName: `${foundUser.firstName} ${foundUser.lastName}`,
      user: {
        userId: foundUser.userId,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};
