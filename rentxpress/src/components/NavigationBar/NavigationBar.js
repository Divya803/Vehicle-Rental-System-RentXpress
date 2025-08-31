import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import { FaUser } from "react-icons/fa";
import "./NavigationBar.css";
import logo from "../../assets/logo.png";
import Button from "../Button/Button";

const NavigationBar = ({ isLoggedIn = false }) => {
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = isLoggedIn || !!userRole;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/user-profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

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



          {/* {isAuthenticated && userRole !== "Admin" && (
            <>
              {userRole === "Driver" ? (
                <li><Link to="/driver-dashboard" className="nav-link">Driver Dashboard</Link></li>
              ) : (
                <li><Link to="/user-dashboard" className="nav-link">User Dashboard</Link></li>
              )}
              <li><Link to="/vehicles" className="nav-link">Vehicles</Link></li>
              <li><Link to="/verify-account" className="nav-link">Verify Account</Link></li>
            </>
          )}


          {userRole === "Vehicle Owner" && (
            <li><Link to="/post-vehicle" className="nav-link">Postings</Link></li>
          )}

          {userRole === "Admin" && isAuthenticated && (
            <>
              <li><Link to="/admin-dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/pending-reservations" className="nav-link">Reservations</Link></li>
              <li><Link to="/pending-vehicle" className="nav-link">Pending Vehicles</Link></li>
              <li><Link to="/user-details" className="nav-link">Users</Link></li>

            </>
          )} */}
          {isAuthenticated && userRole !== "Admin" && (
            <>
              {userRole === "Driver" && (
                <li><Link to="/driver-dashboard" className="nav-link">Driver Dashboard</Link></li>
              )}

              {userRole === "User" && (
                <>
                  <li><Link to="/user-dashboard" className="nav-link">User Dashboard</Link></li>
                  <li><Link to="/vehicles" className="nav-link">Vehicles</Link></li>
                  <li><Link to="/verify-account" className="nav-link">Verify Account</Link></li>
                </>
              )}

              {userRole === "Vehicle Owner" && (
                <>
                  <li><Link to="/owner-dashboard" className="nav-link">Vehicle Owner Dashboard</Link></li>
                  <li><Link to="/post-vehicle" className="nav-link">Postings</Link></li>
                  <li><Link to="/vehicles" className="nav-link">Vehicles</Link></li>

                </>
              )}

            </>
          )}

          {userRole === "Admin" && isAuthenticated && (
            <>
              <li><Link to="/admin-dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/pending-reservations" className="nav-link">Reservations</Link></li>
              <li><Link to="/pending-vehicle" className="nav-link">Pending Vehicles</Link></li>
              <li><Link to="/user-details" className="nav-link">Users</Link></li>
            </>
          )}
          <li><Link to="/reviews" className="nav-link">Reviews & Ratings</Link></li>

        </ul>
      </div>

      {/* Profile or Signup */}
      <div className="nav-profile">
        {isAuthenticated ? (
          <Dropdown overlay={menu} trigger={['click']} overlayClassName="custom-dropdown">
            <div style={{ cursor: "pointer", padding: "4px" }}>
              <FaUser size={26} />
            </div>
          </Dropdown>
        ) : (
          <div className="nav-button">
            <Link to="/signup">
              <Button value="Signup" style={{ fontSize: "16px" }} />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
