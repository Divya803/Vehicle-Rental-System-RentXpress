import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Image from "../../assets/login car.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userId", data.userId);

      alert("Login successful!");

      if (data.role === "Admin") {
    navigate("/admin-dashboard");
  } else if (data.role === "Driver") {
    navigate("/driver-dashboard");
  } else if (data.role === "Vehicle Owner") {
    navigate("/owner-dashboard");
  } 
  else {
    navigate("/user-dashboard");
  }
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("An error occurred");
    console.error(err);
  }
};

  return (
    <div className="login-container">
      <img src={Image} alt="Car" className="car-image" />
      <div className="login-box">
        <h2>Log in</h2>
        <p className="signup-text">
          New to RentXpress? <a href="/signup">Sign up for free</a>
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "👁 Show"}
              </span>
            </div>
          </div>

          <a href="/forgot-password" className="forgot-password">
            Forgot password?
          </a>

          <button type="submit" className="login-btn">Log in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
