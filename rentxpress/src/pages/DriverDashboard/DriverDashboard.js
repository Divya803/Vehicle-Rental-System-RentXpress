import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import "./DriverDashboard.css";
import axios from "axios";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCalendarAlt,
  FaCar,
  FaUser,
  FaPhone,
  FaExclamationTriangle
} from "react-icons/fa";
import { message } from "antd";



const DriverDashboard = () => {
  const [assignedRides, setAssignedRides] = useState([]);
  const [confirmedRides, setConfirmedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState({});
  const [isAvailable, setIsAvailable] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  // Modal states for accept
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [processingAccept, setProcessingAccept] = useState(false);

  // Modal states for reject
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRejectRide, setSelectedRejectRide] = useState(null);
  const [processingReject, setProcessingReject] = useState(false);

  const token = localStorage.getItem("token");
  const [messageApi, contextHolder] = message.useMessage();


  useEffect(() => {
    const fetchAssignedRides = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          "http://localhost:5000/api/reservation/assigned-rides",
          config
        );
        setAssignedRides(res.data || []);
      } catch (error) {
        console.error("Error fetching assigned rides:", error);
      }
    };

    const fetchConfirmedRides = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          "http://localhost:5000/api/reservation/confirmed-rides-driver", // your backend endpoint
          config
        );
        setConfirmedRides(res.data || []);
      } catch (error) {
        console.error("Error fetching confirmed rides:", error);
      }
    };

    Promise.all([fetchAssignedRides(), fetchConfirmedRides()])
      .finally(() => setLoading(false));
  }, [token]);


  const handleAcceptRideClick = (ride) => {
    setSelectedRide(ride);
    setShowConfirmModal(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedRide) return;

    setProcessingAccept(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(
        "http://localhost:5000/api/reservation/accept-ride",
        {
          reservationId: selectedRide.id,
          logId: selectedRide.logId
        },
        config
      );

      setAssignedRides(prev => prev.filter(ride => ride.id !== selectedRide.id));
      setConfirmedRides(prev => [...prev, {
        ...selectedRide,
        status: 'confirmed'
      }]);

      // Close modal
      setShowConfirmModal(false);
      setSelectedRide(null);

      messageApi.success("Ride accepted successfully");

    } catch (error) {
      console.error("Error accepting ride:", error);
      messageApi.error("Failed to accept ride ❌ Please try again.");
    } finally {
      setProcessingAccept(false);
    }
  };

  const handleRejectRideClick = (ride) => {
    setSelectedRejectRide(ride);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedRejectRide) return;

    setProcessingReject(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(
        "http://localhost:5000/api/reservation/reject-ride",
        { reservationId: selectedRejectRide.id },
        config
      );

      // Remove from assigned rides
      setAssignedRides(prev => prev.filter(ride => ride.id !== selectedRejectRide.id));

      // Close modal
      setShowRejectModal(false);
      setSelectedRejectRide(null);

      messageApi.success("Ride rejected successfully 🚫");

    } catch (error) {
      console.error("Error rejecting ride:", error);
      messageApi.error("Failed to reject ride ❌ Please try again.");
    } finally {
      setProcessingReject(false);
    }
  };

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchDriverInfo = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", config);
        setDriverInfo(res.data || {});
        setIsAvailable(res.data.isAvailable);
      } catch (error) {
        console.error("Error fetching driver info:", error);
      }
    };

    fetchDriverInfo();
  }, [token]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'assigned':
      case 'pending':
        return <FaClock style={{ color: '#F59E0B' }} />;
      case 'rejected':
      case 'cancelled':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      case 'in-progress':
        return <FaCar style={{ color: '#3B82F6' }} />;
      default:
        return <FaClock style={{ color: '#6B7280' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return '#10B981';
      case 'assigned':
      case 'pending':
        return '#F59E0B';
      case 'rejected':
      case 'cancelled':
        return '#EF4444';
      case 'in-progress':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
        {contextHolder}
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

      {/* Accept Confirmation Modal */}
      <Modal
        open={showConfirmModal}
        close={setShowConfirmModal}
        closable={!processingAccept}
      >
        <div style={{
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <FaExclamationTriangle style={{
              fontSize: '48px',
              color: '#F59E0B',
              marginBottom: '15px'
            }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#1F2937' }}>
              Confirm Ride Acceptance
            </h3>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
              Are you sure you want to accept this ride?
            </p>
          </div>

          {selectedRide && (
            <div style={{
              backgroundColor: '#F9FAFB',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'left'
            }}>
              <p><strong>Vehicle:</strong> {selectedRide.vehicleName}</p>
              <p><strong>Customer:</strong> {selectedRide.customer?.firstName} {selectedRide.customer?.lastName}</p>
              <p><strong>Date:</strong> {formatDate(selectedRide.date)} to {formatDate(selectedRide.endDate)}</p>
              <p><strong>Phone:</strong> {selectedRide.customer?.phone}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              type="button"
              value={processingAccept ? "Processing..." : "Yes, Accept"}
              style={{
                backgroundColor: '#10B981',
                color: 'white',
                flex: 1,
                opacity: processingAccept ? 0.7 : 1
              }}
              onClick={handleConfirmAccept}
              disabled={processingAccept}
            />
            <Button
              type="button"
              value="Cancel"
              outlined
              style={{
                borderColor: '#6B7280',
                color: '#6B7280',
                flex: 1
              }}
              onClick={() => {
                setShowConfirmModal(false);
                setSelectedRide(null);
              }}
              disabled={processingAccept}
            />
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        open={showRejectModal}
        close={setShowRejectModal}
        closable={!processingReject}
      >
        <div style={{
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <FaTimesCircle style={{
              fontSize: '48px',
              color: '#EF4444',
              marginBottom: '15px'
            }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#1F2937' }}>
              Confirm Ride Rejection
            </h3>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
              Are you sure you want to reject this ride? This action cannot be undone.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              type="button"
              value={processingReject ? "Processing..." : "Yes, Reject"}
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                flex: 1,
                opacity: processingReject ? 0.7 : 1
              }}
              onClick={handleConfirmReject}
              disabled={processingReject}
            />
            <Button
              type="button"
              value="Cancel"
              outlined
              style={{
                borderColor: '#6B7280',
                color: '#6B7280',
                flex: 1
              }}
              onClick={() => {
                setShowRejectModal(false);
                setSelectedRejectRide(null);
              }}
              disabled={processingReject}
            />
          </div>
        </div>
      </Modal>

      <div className="welcome-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Good day, Driver {driverInfo.firstName || 'User'}!</h1>
            <p>Manage your rides</p>
          </div>

          <div className="availability-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div className="availability-status">
                <span style={{
                  color: isAvailable ? '#10B981' : '#EF4444',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {isAvailable ? <FaCheckCircle /> : <FaTimesCircle />}
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <Button
                type="button"
                value={updatingAvailability ? 'Updating...' : (isAvailable ? 'Go Offline' : 'Go Online')}
                style={{
                  backgroundColor: isAvailable ? '#EF4444' : '#10B981',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  opacity: updatingAvailability ? 0.7 : 1,
                  cursor: updatingAvailability ? 'not-allowed' : 'pointer'
                }}
                disabled={updatingAvailability}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", padding: "0 50px" }}>
        {/* Assigned Rides */}
        <div className="dashboard-section assigned-rides-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FaCar style={{ color: '#00A8A8', fontSize: '24px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>Assigned Rides</p>
          </div>

          <div style={{ height: "450px", overflowY: "auto" }}>
            {assignedRides.length > 0 ? (
              <div className="rides-container">
                {assignedRides.map((ride, index) => (
                  <div key={ride.id || index} className="ride-card">
                    <div className="ride-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {getStatusIcon(ride.status)}
                        <h3 style={{ margin: 0, color: '#ffffff' }}>
                          {ride.vehicleName || ride.vehicle?.name || 'N/A'}
                        </h3>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(ride.status)}20`,
                            color: getStatusColor(ride.status),
                            border: `1px solid ${getStatusColor(ride.status)}`
                          }}
                        >
                          {ride.status}
                        </span>
                      </div>
                      <div className="ride-time">
                        <FaCalendarAlt style={{ marginRight: '5px' }} />
                        {formatDate(ride.date)} to {formatDate(ride.endDate)}
                      </div>
                    </div>

                    <div className="customer-details">
                      <h4 style={{ color: '#00A8A8', marginBottom: '10px' }}>
                        <FaUser style={{ marginRight: '8px' }} />
                        Customer Details
                      </h4>
                      <div className="customer-info">
                        <p><strong>Name:</strong> {ride.customer?.firstName} {ride.customer?.lastName}</p>
                        <p><strong>Phone:</strong>
                          <a href={`tel:${ride.customer?.phone}`} style={{ color: '#00A8A8', marginLeft: '5px' }}>
                            <FaPhone style={{ marginRight: '5px' }} />
                            {ride.customer?.phone}
                          </a>
                        </p>
                        <p><strong>Email:</strong> {ride.customer?.email}</p>
                      </div>
                    </div>

                    {ride.status?.toLowerCase() === 'assigned' && (
                      <div className="ride-actions">
                        <Button
                          type="button"
                          value="Accept Ride"
                          style={{
                            backgroundColor: '#10B981',
                            marginRight: '10px',
                            flex: 1
                          }}
                          onClick={() => handleAcceptRideClick(ride)}
                        />
                        <Button
                          type="button"
                          value="Reject"
                          outlined
                          style={{
                            borderColor: '#EF4444',
                            color: '#EF4444',
                            flex: 1
                          }}
                          onClick={() => handleRejectRideClick(ride)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: '#9E9E9E'
              }}>
                <FaCar style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
                <p>No rides assigned yet</p>
                <p style={{ fontSize: '14px' }}>Check back later for new ride assignments</p>
              </div>
            )}
          </div>
        </div>

        {/* Confirmed Rides */}
        <div className="dashboard-section confirmed-rides-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FaCheckCircle style={{ color: '#00A8A8', fontSize: '24px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>Confirmed Rides</p>
          </div>

          <div style={{ height: "450px", overflowY: "auto" }}>
            {confirmedRides.length > 0 ? (
              <div className="confirmed-rides-table">
                <div className="table-header">
                  <div className="table-cell">Customer</div>
                  <div className="table-cell">Vehicle</div>
                  <div className="table-cell">Date</div>
                  <div className="table-cell">Status</div>
                </div>
                {confirmedRides.map((ride, index) => (
                  <div key={ride.id || index} className="table-row">
                    <div className="table-cell customer-name">
                      {`${ride.customer?.firstName || ''} ${ride.customer?.lastName || ''}`.trim() || 'N/A'}
                    </div>
                    <div className="table-cell vehicle-name">
                      {ride.vehicleName || ride.vehicle?.name || 'N/A'}
                    </div>
                    <div className="table-cell ride-date">
                      {formatDate(ride.date)} to {formatDate(ride.endDate)}
                    </div>
                    <div className="table-cell ride-status" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {getStatusIcon(ride.status)}
                      <span style={{ color: getStatusColor(ride.status), textTransform: 'capitalize' }}>
                        {ride.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: '#9E9E9E'
              }}>
                <FaCheckCircle style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
                <p>No confirmed rides yet</p>
                <p style={{ fontSize: '14px' }}>Accepted rides will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;