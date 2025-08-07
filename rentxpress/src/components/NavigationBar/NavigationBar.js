// import React from "react";
// import { Link } from "react-router-dom";
// import { FaUser } from "react-icons/fa"; // Import person icon
// import "./NavigationBar.css";
// import logo from "../../assets/logo.png"; // Import logo

// const HomeNavigationBar = () => {
//   return (
//     <nav className="navbar">
//       <div className="nav-container">
//         {/* Logo */}
//         <div className="logo">
//           <img src={logo} alt="App Logo" className="logo-img" />
//         </div>

//         {/* Navigation Links */}
//         <ul className="nav-links">
//           <li><Link to="/" className="nav-link">Home</Link></li>
//           <li><Link to="/vehicles" className="nav-link">Vehicles</Link></li>
//           <li><Link to="/verify-account" className="nav-link">Verify Account</Link></li>
//           <li><Link to="/post-vehicle" className="nav-link">Postings</Link></li>
//           <li><Link to="/admin-dashboard" className="nav-link">Dashboard</Link></li>
//           <li><Link to="/user-details" className="nav-link">Users</Link></li>
//           <li><Link to="/pending-vehicle" className="nav-link">Pending Vehicles</Link></li>
//           <li><Link to="/user-dashboard" className="nav-link">User Dashboard</Link></li>
//         </ul>
//       </div>

//       {/* Person Icon (Login) */}
//       <div className="nav-profile">
//         <Link to="/user-profile" className="nav-icon">
//           <FaUser size={26} />
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default HomeNavigationBar;

// import React from "react";
// import { Link } from "react-router-dom";
// import { FaUser } from "react-icons/fa";
// import "./NavigationBar.css";
// import logo from "../../assets/logo.png";

// const NavigationBar = ({ isLoggedIn = false }) => {
//   const userRole = localStorage.getItem("userRole");

//   // Determine if user is actually logged in (has a role or isLoggedIn prop is true)
//   const isAuthenticated = isLoggedIn || !!userRole;

//   return (
//     <nav className="navbar">
//       <div className="nav-container">
//         {/* Logo */}
//         <div className="logo">
//           <img src={logo} alt="App Logo" className="logo-img" />
//         </div>

//         {/* Navigation Links */}
//         <ul className="nav-links">
//           {/* Always show Home link */}
//           <li><Link to="/" className="nav-link">Home</Link></li>

//           {/* Show generic links for authenticated non-admin users */}
//           {isAuthenticated && userRole !== "Admin" && (
//             <>
//               <li><Link to="/vehicles" className="nav-link">Vehicles</Link></li>
//               <li><Link to="/verify-account" className="nav-link">Verify Account</Link></li>
//               <li><Link to="/user-dashboard" className="nav-link">User Dashboard</Link></li>
//             </>
//           )}

//           {/* VehicleOwner specific link */}
//           {userRole === "VehicleOwner" && (
//             <li><Link to="/post-vehicle" className="nav-link">Postings</Link></li>
//           )}

//           {/* Admin specific links - ONLY for admin users */}
//           {userRole === "Admin" && isAuthenticated && (
//             <>
//               <li><Link to="/admin-dashboard" className="nav-link">Dashboard</Link></li>
//               <li><Link to="/user-details" className="nav-link">Users</Link></li>
//               <li><Link to="/pending-vehicle" className="nav-link">Pending Vehicles</Link></li>
//             </>
//           )}
//         </ul>
//       </div>

//       {/* Right side - Profile icon OR Signup button */}
//       <div className="nav-profile">
//         {isAuthenticated ? (
//           /* Show profile icon when logged in */
//           <Link to="/user-profile" className="nav-icon">
//             <FaUser size={26} />
//           </Link>
//         ) : (
//           /* Show signup button when not logged in */
//           <div className="nav-button">
//             <Link to="/signup">
//               <button className="signup-btn" style={{ fontSize: "16px" }}>
//                 Signup
//               </button>
//             </Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default NavigationBar;

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

          {isAuthenticated && userRole !== "Admin" && (
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
          )}
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
