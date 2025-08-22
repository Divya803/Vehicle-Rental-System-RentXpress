import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import "./OwnerDashboard.css";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCar
} from "react-icons/fa";
import axios from "axios";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Load bookings
      try {
        const bookingsResponse = await axios.get(
          "http://localhost:5000/api/reservation/myBookings",
          config
        );
        setBookings(bookingsResponse.data || []);
      } catch (error) {
        console.error("Error loading bookings:", error);
        setBookings([]);
      }

      // Load verification & user info
      try {
        const verificationResponse = await axios.get(
          "http://localhost:5000/api/users/myVerificationStatus",
          config
        );
        const verificationData = verificationResponse.data;

        setVerificationStatus({
          status: verificationData.status,
          role: verificationData.role,
          submittedAt: verificationData.createdAt || null,
          rejectionReason: verificationData.issueDetails || "",
        });

        setUserInfo({
          firstName: verificationData.firstName,
        });
      } catch (error) {
        console.error("Error loading verification status:", error);
        setVerificationStatus(null);

        try {
          const userResponse = await axios.get(
            "http://localhost:5000/api/users/profile",
            config
          );
          setUserInfo({
            firstName: userResponse.data.firstName,
          });
        } catch (userError) {
          console.error("Error loading user info:", userError);
          setUserInfo({ firstName: "User" });
        }
      }

      // Mock vehicle data (replace this later with backend fetch)
      const mockVehicles = [
        {
          vehicleId: 1,
          vehicleName: "Toyota Prius",
          make: "Toyota",
          model: "Prius",
          year: 2018,
          pricePerDay: 5500,
          licensePlate: "ABC-1234",
          location: "Colombo",
          status: "Approved",
          image: "https://via.placeholder.com/300x180.png?text=Toyota+Prius",
          createdAt: "2024-07-15",
        },
        {
          vehicleId: 2,
          vehicleName: "Honda Civic",
          make: "Honda",
          model: "Civic",
          year: 2020,
          pricePerDay: 6500,
          licensePlate: "XYZ-5678",
          location: "Kandy",
          status: "Pending",
          image: "https://via.placeholder.com/300x180.png?text=Honda+Civic",
          createdAt: "2024-08-01",
        },
        {
          vehicleId: 3,
          vehicleName: "Nissan Leaf",
          make: "Nissan",
          model: "Leaf",
          year: 2019,
          pricePerDay: 7000,
          licensePlate: "EFG-9012",
          location: "Galle",
          status: "Rejected",
          rejectionReason: "Incomplete documents uploaded.",
          image: "https://via.placeholder.com/300x180.png?text=Nissan+Leaf",
          createdAt: "2024-08-10",
        },
      ];
      setVehicles(mockVehicles);

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "verified":
      case "confirmed":
      case "active":
        return <FaCheckCircle style={{ color: "#10B981" }} />;
      case "pending":
        return <FaClock style={{ color: "#F59E0B" }} />;
      case "rejected":
      case "cancelled":
        return <FaTimesCircle style={{ color: "#EF4444" }} />;
      default:
        return <FaExclamationTriangle style={{ color: "#6B7280" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "verified":
      case "confirmed":
      case "active":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "rejected":
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
        <NavigationBar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <NavigationBar />

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back, {userInfo.firstName || "User"}!</h1>
        <p>Here's what's happening with your account</p>
      </div>

      <div style={{ display: "flex", gap: "20px", padding: "0 50px" }}>
        {/* Vehicles Section */}
        <div className="dashboard-section verification-section">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <FaCar style={{ color: "#00A8A8", fontSize: "24px" }} />
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: "500",
                margin: 0,
              }}
            >
              My Vehicles
            </p>
          </div>

          <div style={{ height: "400px", overflowY: "auto" }}>
            {vehicles.length > 0 ? (
              <div className="v-grid">
                {vehicles.map((vehicle, index) => (
                  <div key={vehicle.vehicleId || index} className="v-card">
                    <div className="v-header">
                      <div >
                        <p className="v-name" style={{ color:"white" }}>{vehicle.vehicleName || "Unknown Vehicle"}</p>
                      </div>
                      <div className="v-status">
                        <div className="status-badge" data-status={vehicle.status?.toLowerCase()}>
                          {getStatusIcon(vehicle.status)}
                          <span>{vehicle.status || "Unknown"}</span>
                        </div>
                      </div>
                    </div>

                    {vehicle.status?.toLowerCase() === "rejected" &&
                      vehicle.rejectionReason && (
                        <div className="rejection-reason">
                          <div className="rejection-header">
                            <FaExclamationTriangle
                              style={{ color: "#EF4444", fontSize: "16px" }}
                            />
                            <span>Issue Details:</span>
                          </div>
                          <p className="rejection-text">{vehicle.rejectionReason}</p>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <FaCar style={{ fontSize: "48px", opacity: 0.5, color: "#9E9E9E" }} />
                <p>No vehicles submitted yet</p>
                <Button
                  value="Add Vehicle"
                  type="button"
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    // Navigate to add vehicle page
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bookings Section */}
        <div className="dashboard-section bookings-section">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <FaCalendarAlt style={{ color: "#00A8A8", fontSize: "24px" }} />
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: "500",
                margin: 0,
              }}
            >
              Recent Bookings
            </p>
          </div>

          <div style={{ height: "400px", overflowY: "auto" }}>
            {bookings.length > 0 ? (
              <Table hover={true} style={{ fontSize: "1.10rem" }}>
                <TableRow
                  data={[
                    "Vehicle",
                    "Date Range",
                    "Amount",
                    "Status",
                    "Type",
                  ]}
                />
                {bookings.slice(0, 5).map((booking, index) => (
                  <TableRow
                    key={booking.reservationId || index}
                    data={[
                      booking.vehicle?.vehicleName || "N/A",
                      `${formatDate(booking.startDate)} - ${formatDate(
                        booking.endDate
                      )}`,
                      `Rs. ${booking.totalAmount.toFixed(2)}`,
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {getStatusIcon(booking.status)}
                        <span style={{ color: getStatusColor(booking.status) }}>
                          {booking.status}
                        </span>
                      </div>,
                      booking.reservationType,
                    ]}
                  />
                ))}
              </Table>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  color: "#9E9E9E",
                }}
              >
                <FaCalendarAlt
                  style={{
                    fontSize: "48px",
                    marginBottom: "20px",
                    opacity: 0.5,
                  }}
                />
                <p>No bookings yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;