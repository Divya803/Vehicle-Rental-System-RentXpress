import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import "./UserDashboard.css"; // You can style each section
import axios from "axios";

const UserDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [bookingRes, verifyRes, vehicleRes] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings/myBookings", config),
          axios.get("http://localhost:5000/api/users/myVerificationStatus", config),
          axios.get("http://localhost:5000/api/vehicles/myVehicles", config), // Optional if owner
        ]);

        setBookings(bookingRes.data);
        setVerificationStatus(verifyRes.data);
        setVehicles(vehicleRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <NavigationBar />
      <div className="dashboard-container">
        <h2>Welcome to Your Dashboard</h2>

        {/* Verification Status */}
        <div className="dashboard-section">
          <h3>Verification Status</h3>
          {verificationStatus ? (
            <p>
              Role: <strong>{verificationStatus.role}</strong> — Status:{" "}
              <strong>{verificationStatus.status}</strong>
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Booking Info */}
        <div className="dashboard-section">
          <h3>Your Bookings</h3>
          {bookings.length > 0 ? (
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>
                  Vehicle: {booking.vehicleName} | Date: {booking.date} | Status:{" "}
                  <strong>{booking.status}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet.</p>
          )}
        </div>

        {/* Vehicle Owner Only Section */}
        {vehicles.length > 0 && (
          <div className="dashboard-section">
            <h3>Your Posted Vehicles</h3>
            <ul>
              {vehicles.map((v) => (
                <li key={v.id}>
                  {v.name} - {v.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;

