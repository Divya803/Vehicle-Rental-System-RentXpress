import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import "./UserDashboard.css";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCalendarAlt,
  FaUser,
  FaExclamationTriangle
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

   
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
        {/* Verification Section */}
        <div className="dashboard-section verification-section">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <FaUser style={{ color: "#00A8A8", fontSize: "24px" }} />
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: "500",
                margin: 0,
              }}
            >
              Verification Status
            </p>
          </div>

          {verificationStatus ? (
            <div className="verification-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                {getStatusIcon(verificationStatus.status)}
                <div>
                  <h3 style={{ margin: 0, color: "#ffffff" }}>
                    Status: {verificationStatus.status}
                  </h3>
                  <p style={{ margin: "5px 0 0 0", color: "#9E9E9E" }}>
                    Role: {verificationStatus.role}
                  </p>
                </div>
              </div>

              {verificationStatus.submittedAt && (
                <p style={{ color: "#9E9E9E", margin: "10px 0" }}>
                  Submitted: {formatDate(verificationStatus.submittedAt)}
                </p>
              )}

              {verificationStatus.rejectionReason && (
                <div
                  style={{
                    backgroundColor: "#EF444420",
                    border: "1px solid #EF4444",
                    borderRadius: "8px",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  <p
                    style={{
                      color: "#EF4444",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    Rejection Reason:
                  </p>
                  <p style={{ color: "#ffffff", margin: "5px 0 0 0" }}>
                    {verificationStatus.rejectionReason}
                  </p>
                </div>
              )}

              {verificationStatus.status?.toLowerCase() === "pending" && (
                <p
                  style={{
                    color: "#F59E0B",
                    fontStyle: "italic",
                    marginTop: "15px",
                  }}
                >
                  Your verification is being reviewed. Please wait for admin
                  approval.
                </p>
              )}

              {verificationStatus.status?.toLowerCase() === "approved" && (
                <p
                  style={{
                    color: "#10B981",
                    fontStyle: "italic",
                    marginTop: "15px",
                  }}
                >
                  Congratulations! Your verification has been approved. When you log in again, you can work as a {verificationStatus.role.replace('_', ' ')} with us.
                </p>
              )}

              {verificationStatus.status?.toLowerCase() === "rejected" && (
                <p
                  style={{
                    color: "#EF4444",
                    fontStyle: "italic",
                    marginTop: "15px",
                  }}
                >
                  Your verification has been rejected. Please check the reason above and submit a new verification request.
                </p>
              )}

              
            </div>
          ) : (
            <div className="verification-card">
              <p style={{ color: "#9E9E9E" }}>
                No verification status available
              </p>
              <Button
                value="Submit Verification"
                type="button"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  navigate("/verify-account");
                }}
              />
            </div>
          )}
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
                <Button
                  value="Browse Vehicles"
                  type="button"
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    navigate("/vehicles");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

