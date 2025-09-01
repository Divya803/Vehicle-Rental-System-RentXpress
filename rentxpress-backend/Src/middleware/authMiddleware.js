const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log("❌ No token provided");
      return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.log("❌ Invalid token:", err);
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = user;
      console.log("✅ Token verified:", user); // Check if user.id exists
      req.user = user;
      next();
    });
  } catch (error) {
    console.log("❌ Middleware error:", error);
    res.status(500).json({ message: 'Token verification failed' });
  }
};

module.exports = verifyToken;

