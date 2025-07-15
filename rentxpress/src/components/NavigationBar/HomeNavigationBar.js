import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./NavigationBar.css"; 
import Button from "../Button/Button";
import logo from "../../assets/logo.png";

const HomeNavigationBar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="App Logo" className="logo-img" />
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/vehicles" className="nav-link">Vehicles</Link></li>
          <li><Link to="/verify-account" className="nav-link">Verify Account</Link></li>
          <li><Link to="/post-vehicle" className="nav-link">Postings</Link></li>
          <li><Link to="/admin-dashboard" className="nav-link">Dashboard</Link></li>
          <li><Link to="/user-details" className="nav-link">Users</Link></li>
          <li><Link to="/pending-vehicle" className="nav-link">Pending Vehicles</Link></li>
        </ul>
      </div>

      {/* Signup Button on the Right */}
      <div className="nav-button">
        <Link to="/signup">
          <Button value="Signup" style={{ fontSize: "16px" }} />
        </Link>
      </div>
    </nav>
  );
};

export default HomeNavigationBar;
