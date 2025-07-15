const jwt = require('jsonwebtoken');
const dataSource = require("../config/config"); // ✅ Correct path/ Import the database connection
const User = require('../models/user'); // Your User entity

const JWT_SECRET = 'your_jwt_secret_key'; // Use env in production

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRepository = dataSource.getRepository(User);
    const foundUser = await userRepository.findOneBy({ email });

    if (!foundUser || foundUser.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: foundUser.userId, role: foundUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: foundUser.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};
