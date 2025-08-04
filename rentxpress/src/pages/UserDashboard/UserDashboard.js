import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import "./UserDashboard.css";
import axios from "axios";
import { 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaCalendarAlt, 
  FaUser,
  FaExclamationTriangle
} from "react-icons/fa";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [bookingRes, verifyRes, userRes] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings/myBookings", config),
          axios.get("http://localhost:5000/api/users/myVerificationStatus", config),
          axios.get("http://localhost:5000/api/users/profile", config).catch(() => ({ data: {} })),
        ]);

        setBookings(bookingRes.data || []);
        setVerificationStatus(verifyRes.data);
        setUserInfo(userRes.data || {});
        setLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'verified':
      case 'active':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'pending':
        return <FaClock style={{ color: '#F59E0B' }} />;
      case 'rejected':
      case 'cancelled':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      default:
        return <FaExclamationTriangle style={{ color: '#6B7280' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'verified':
      case 'active':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
        <NavigationBar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
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
        <h1>Welcome back, {userInfo.firstName || 'User'}!</h1>
        <p>Here's what's happening with your account</p>
      </div>



      {/* Main Content Sections */}
      <div style={{ display: "flex", gap: "20px", padding: "0 50px" }}>
        {/* Verification Status Section */}
        <div className="dashboard-section verification-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FaUser style={{ color: '#00A8A8', fontSize: '24px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>Verification Status</p>
          </div>
          
          {verificationStatus ? (
            <div className="verification-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                {getStatusIcon(verificationStatus.status)}
                <div>
                  <h3 style={{ margin: 0, color: '#ffffff' }}>
                    Status: {verificationStatus.status}
                  </h3>
                  <p style={{ margin: '5px 0 0 0', color: '#9E9E9E' }}>
                    Role: {verificationStatus.role}
                  </p>
                </div>
              </div>
              
              {verificationStatus.submittedAt && (
                <p style={{ color: '#9E9E9E', margin: '10px 0' }}>
                  Submitted: {formatDate(verificationStatus.submittedAt)}
                </p>
              )}
              
              {verificationStatus.rejectionReason && (
                <div style={{ 
                  backgroundColor: '#EF444420', 
                  border: '1px solid #EF4444', 
                  borderRadius: '8px', 
                  padding: '10px', 
                  marginTop: '10px' 
                }}>
                  <p style={{ color: '#EF4444', margin: 0, fontWeight: 'bold' }}>
                    Rejection Reason:
                  </p>
                  <p style={{ color: '#ffffff', margin: '5px 0 0 0' }}>
                    {verificationStatus.rejectionReason}
                  </p>
                </div>
              )}
              
              {verificationStatus.status?.toLowerCase() === 'pending' && (
                <p style={{ color: '#F59E0B', fontStyle: 'italic', marginTop: '15px' }}>
                  Your verification is being reviewed. Please wait for admin approval.
                </p>
              )}
            </div>
          ) : (
            <div className="verification-card">
              <p style={{ color: '#9E9E9E' }}>No verification status available</p>
              <Button 
                value="Submit Verification" 
                type="button" 
                style={{ marginTop: '10px' }}
                onClick={() => {/* Navigate to verification form */}}
              />
            </div>
          )}
        </div>

        {/* Recent Bookings Section */}
        <div className="dashboard-section bookings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FaCalendarAlt style={{ color: '#00A8A8', fontSize: '24px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>Recent Bookings</p>
          </div>
          
          <div style={{ height: "400px", overflowY: "auto" }}>
            {bookings.length > 0 ? (
              <Table hover={true} style={{ fontSize: "1.10rem" }}>
                <TableRow data={["Vehicle", "Date", "Status", "Action"]} />
                {bookings.slice(0, 5).map((booking, index) => (
                  <TableRow
                    key={booking.id || index}
                    data={[
                      booking.vehicleName || booking.vehicle?.name || 'N/A',
                      formatDate(booking.date || booking.startDate),
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(booking.status)}
                        <span style={{ color: getStatusColor(booking.status) }}>
                          {booking.status || 'Unknown'}
                        </span>
                      </div>,
                      <Button
                        type="button"
                        value="View"
                        outlined
                        style={{ width: "80px", fontSize: "12px" }}
                        onClick={() => {/* Navigate to booking details */}}
                      />
                    ]}
                  />
                ))}
              </Table>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '200px',
                color: '#9E9E9E'
              }}>
                <FaCalendarAlt style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
                <p>No bookings yet</p>
                <Button 
                  value="Browse Vehicles" 
                  type="button" 
                  style={{ marginTop: '10px' }}
                  onClick={() => {/* Navigate to vehicle browse */}}
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