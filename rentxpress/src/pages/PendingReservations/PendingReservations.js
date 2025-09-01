import React, { useState, useEffect } from "react";
import "./PendingReservations.css";
import { Link, useNavigate } from "react-router-dom";
import { FaCar, FaUser, FaClock, FaMapMarkerAlt, FaCheckCircle, FaToggleOn, FaToggleOff, FaTimes } from "react-icons/fa";
import { MdOutlineCarCrash, MdAssignmentInd } from "react-icons/md";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import AdminCard from "../../components/AdminCard/AdminCard";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import axios from "axios";
import { message } from "antd";

export default function PendingReservations() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [confirmedRequests, setConfirmedRequests] = useState([]);
  const [cancelledRequests, setCancelledRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [vehicleCounts, setVehicleCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pending requests
        const pendingResponse = await axios.get("http://localhost:5000/api/reservation/pending", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPendingRequests(pendingResponse.data);

        // Confirmed requests
        const confirmedResponse = await axios.get("http://localhost:5000/api/reservation/confirmed", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setConfirmedRequests(confirmedResponse.data);

        // Cancelled requests
        const cancelledResponse = await axios.get("http://localhost:5000/api/reservation/cancelled", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCancelledRequests(cancelledResponse.data);

        fetchReservationCounts();
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchData();
  }, []);

  const fetchReservationCounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reservation/counts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVehicleCounts(res.data);
    } catch (error) {
      console.error("Error fetching reservation counts:", error);
    }
  };


  useEffect(() => {
    const fetchAvailableDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reservation/availableDrivers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAvailableDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchAvailableDrivers();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  // Toggle vehicle availability manually
  const toggleVehicleAvailability = async (vehicleId, currentStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/vehicles/vehicles/${vehicleId}/availability`,
        { isAvailable: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local state
      setPendingRequests(pendingRequests.map(req =>
        req.vehicleId === vehicleId ? { ...req, vehicleAvailable: !currentStatus } : req
      ));
      setConfirmedRequests(confirmedRequests.map(req =>
        req.vehicleId === vehicleId ? { ...req, vehicleAvailable: !currentStatus } : req
      ));
      setCancelledRequests(cancelledRequests.map(req =>
        req.vehicleId === vehicleId ? { ...req, vehicleAvailable: !currentStatus } : req
      ));

      messageApi.success(`Vehicle availability updated to ${!currentStatus ? 'Available' : 'Unavailable'}`);
    } catch (error) {
      console.error("Error updating vehicle availability:", error);
      messageApi.error("Failed to update vehicle availability");
    }
  };


  const handleAssignDriver = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reservation/assign-driver",
        {
          reservationId: selectedRequest.reservationId,
          driverId: selectedDriver
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      messageApi.success(response.data.message || "Driver assigned successfully");

      // Refresh data
      setIsAssignModalOpen(false);
      setIsDetailsModalOpen(false);

      const pendingRes = await axios.get("http://localhost:5000/api/reservation/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPendingRequests(pendingRes.data);

      const confirmedRes = await axios.get("http://localhost:5000/api/reservation/confirmed", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setConfirmedRequests(confirmedRes.data);

    } catch (error) {
      console.error("Error assigning driver:", error);
      messageApi.error("Failed to assign driver");
    }
  };

  const openAssignModal = (request) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/reservation/${selectedRequest.id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPendingRequests(pendingRequests.filter(r => r.reservationId !== selectedRequest.reservationId));
      setIsRejectModalOpen(false);

      messageApi.success("Reservation rejected successfully 🚫");
    } catch (error) {
      console.error("Error rejecting reservation:", error);
      messageApi.error("Failed to reject reservation ");
    }
  };

  const renderTable = (requests, showActions = false) => (
    <Table hover={true} style={{ fontSize: "1.10rem" }}>
      <TableRow data={[
        "Customer",
        "Vehicle",
        "Date Range",
        "Duration",
        "Amount",
        "Vehicle Status",
        ...(showActions ? ["Actions"] : [])
      ]} />
      {requests.map((request) => (
        <TableRow
          key={request.id}
          data={[
            <div className="customer-info-cell">
              <div className="customer-name">{request.customerName}</div>
              <div className="customer-phone">{request.customerPhone}</div>
            </div>,
            <div className="vehicle-info-cell">
              <div className="vehicle-name">{request.vehicleName}</div>
              <div className="vehicle-type">{request.vehicleType}</div>
            </div>,
            <div className="date-info-cell">
              <div className="date-start">{formatDate(request.startDate)}</div>
              <div className="date-end">to {formatDate(request.endDate)}</div>
            </div>,
            <div className="duration-cell">
              <span className="duration-badge">
                {request.duration}
              </span>
            </div>,
            <div className="amount-cell">
              {request.totalAmount}
            </div>,
            <div className="availability-cell">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  color: request.vehicleAvailable ? '#10B981' : '#EF4444',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                  {request.vehicleAvailable ? 'Available' : 'Unavailable'}
                </span>
                <button
                  onClick={() => toggleVehicleAvailability(request.vehicleId, request.vehicleAvailable)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: request.vehicleAvailable ? '#10B981' : '#6B7280',
                    fontSize: '18px',
                    padding: '2px'
                  }}
                  title={`Click to ${request.vehicleAvailable ? 'disable' : 'enable'} vehicle`}
                >
                  {request.vehicleAvailable ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
            </div>,
            ...(showActions ? [
              <div className="actions-cell" >
                <Button
                  type="button"
                  value="Assign Driver"
                  style={{
                    width: "100px",
                    fontSize: "12px",
                    marginBottom: "5px",
                    opacity: request.vehicleAvailable ? 1 : 0.5
                  }}
                  onClick={() => openAssignModal(request)}
                  disabled={!request.vehicleAvailable}
                />
                <Button
                  type="button"
                  value="Reject"
                  red
                  outlined
                  style={{ width: "70px", fontSize: "12px" }}
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsRejectModalOpen(true);
                  }}
                />
              </div>
            ] : [])
          ]}
        />
      ))}
    </Table>
  );

  const renderEmptyState = (iconComponent, message) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px',
      color: '#9E9E9E'
    }}>
      {iconComponent}
      <p>{message}</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: "white", minHeight: "190vh" }}>
      {contextHolder}
      <NavigationBar />

      <div style={{ display: "flex" }}>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Pending Requests</div>
              <div className="count">{vehicleCounts.pending}</div>
            </div>
            <div className="user-icon">
              <FaClock />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Confirmed Rentals</div>
              <div className="count">{vehicleCounts.confirmed}</div>
            </div>
            <div className="user-icon">
              <FaCheckCircle />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Rejected Requests</div>
              <div className="count">{vehicleCounts.rejected}</div>
            </div>
            <div className="user-icon">
              <MdOutlineCarCrash />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Available Drivers</div>
              <div className="count">{availableDrivers.length}</div>
            </div>
            <div className="user-icon">
              <FaUser />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Toggle Buttons */}
      <div style={{
        display: 'flex', gap: '10px', margin: '30px 0 10px 0', paddingLeft: '50px'
      }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            background: activeTab === 'pending' ? '#00A8A8' : '#F3F4F6',
            color: activeTab === 'pending' ? 'white' : '#161D20',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 28px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'pending' ? '0 2px 8px #00A8A820' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Pending Reservations
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          style={{
            background: activeTab === 'confirmed' ? '#00A8A8' : '#F3F4F6',
            color: activeTab === 'confirmed' ? 'white' : '#161D20',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 28px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'confirmed' ? '0 2px 8px #00A8A820' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Confirmed Reservations
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          style={{
            background: activeTab === 'cancelled' ? '#00A8A8' : '#F3F4F6',
            color: activeTab === 'cancelled' ? 'white' : '#161D20',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 28px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'cancelled' ? '0 2px 8px #00A8A820' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Cancelled Reservations
        </button>
      </div>

      {/* Pending Requests Table */}
      {activeTab === 'pending' && (
        <div className="reservation-requests">
          <div style={{ display: 'flex', alignItems: 'left', gap: '10px', marginBottom: '20px' }}>
            <MdAssignmentInd style={{ color: '#00A8A8', fontSize: '28px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>
              Pending Requests With Driver Option
            </p>
          </div>
          <div style={{ height: "100vh", overflowY: "auto" }}>
            {renderTable(pendingRequests, true)}
            {pendingRequests.length === 0 && renderEmptyState(
              <FaClock style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />,
              "No pending rental requests"
            )}
          </div>
        </div>
      )}

      {/* Confirmed Requests Table */}
      {activeTab === 'confirmed' && (
        <div className="reservation-requests">
          <div style={{ display: 'flex', alignItems: 'left', gap: '10px', marginBottom: '20px' }}>
            <FaCheckCircle style={{ color: '#00A8A8', fontSize: '28px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>
              Confirmed Reservations
            </p>
          </div>
          <div style={{ height: "100vh", overflowY: "auto" }}>
            {renderTable(confirmedRequests)}
            {confirmedRequests.length === 0 && renderEmptyState(
              <FaCheckCircle style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />,
              "No confirmed rental requests"
            )}
          </div>
        </div>
      )}

      {/* Cancelled Requests Table */}
      {activeTab === 'cancelled' && (
        <div className="reservation-requests">
          <div style={{ display: 'flex', alignItems: 'left', gap: '10px', marginBottom: '20px' }}>
            <FaTimes style={{ color: '#00A8A8', fontSize: '28px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>
              Cancelled Reservations
            </p>
          </div>
          <div style={{ height: "100vh", overflowY: "auto" }}>
            {renderTable(cancelledRequests)}
            {cancelledRequests.length === 0 && renderEmptyState(
              <FaTimes style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />,
              "No cancelled rental requests"
            )}
          </div>
        </div>
      )}

      {/* Request Details and Driver Assignment Modal */}
      <Modal open={isDetailsModalOpen} close={() => setIsDetailsModalOpen(false)} footer={false}>
        {selectedRequest && (
          <div style={{ padding: "20px", maxWidth: "600px" }}>
            <h2 style={{ color: '#161D20', marginBottom: '20px' }}>Rental Request Details</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              <div>
                <h4 style={{ color: '#00A8A8', margin: '0 0 5px 0' }}>Customer Information</h4>
                <p><strong>Name:</strong> {selectedRequest.customerName}</p>
                <p><strong>Phone:</strong> {selectedRequest.customerPhone}</p>
                <p><strong>Email:</strong> {selectedRequest.customerEmail}</p>
              </div>

              <div>
                <h4 style={{ color: '#00A8A8', margin: '0 0 5px 0' }}>Vehicle Information</h4>
                <p><strong>Vehicle:</strong> {selectedRequest.vehicleName}</p>
                <p><strong>Type:</strong> {selectedRequest.vehicleType}</p>
                <p><strong>Amount:</strong> {selectedRequest.totalAmount}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <strong>Status:</strong>
                  <span style={{
                    color: selectedRequest.vehicleAvailable ? '#10B981' : '#EF4444',
                    fontWeight: 'bold'
                  }}>
                    {selectedRequest.vehicleAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <button
                    onClick={() => toggleVehicleAvailability(selectedRequest.vehicleId, selectedRequest.vehicleAvailable)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: selectedRequest.vehicleAvailable ? '#10B981' : '#6B7280',
                      fontSize: '18px'
                    }}
                  >
                    {selectedRequest.vehicleAvailable ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#00A8A8', margin: '0 0 5px 0' }}>Dates</h4>
                <p><strong>Start:</strong> {formatDate(selectedRequest.startDate)}</p>
                <p><strong>End:</strong> {formatDate(selectedRequest.endDate)}</p>
                <p><strong>Requested:</strong> {formatDate(selectedRequest.requestDate)}</p>
              </div>
            </div>

            {!selectedRequest.vehicleAvailable && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px'
              }}>
                <p style={{ color: '#EF4444', margin: 0, fontSize: '14px' }}>
                  ⚠️ This vehicle is currently unavailable. Enable it to proceed with the reservation.
                </p>
              </div>
            )}

            <div style={{ marginTop: "25px", display: "flex", gap: "15px", justifyContent: "center" }}>
              <Button
                value="Assign Driver"
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                style={{
                  minWidth: "120px",
                  opacity: selectedRequest.vehicleAvailable ? 1 : 0.5
                }}
                disabled={!selectedRequest.vehicleAvailable}
              />
              <Button
                value="Reject Request"
                type="button"
                red
                outlined
                onClick={() => {
                  setIsRejectModalOpen(true);
                }}
                style={{ minWidth: "120px" }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Driver Assignment Modal */}
      <Modal open={isAssignModalOpen} close={() => setIsAssignModalOpen(false)} footer={false}>
        <div style={{ padding: "20px", minWidth: "300px" }}>
          <h3 style={{ color: '#161D20', marginBottom: '20px' }}>Select Driver for Assignment</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#161D20' }}>
              Available Drivers:
            </label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              style={{
                width: "80%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #E5E7EB",
                fontSize: "1rem",
                backgroundColor: "white"
              }}
            >
              <option value="">Select a driver...</option>
              {availableDrivers.map((driver) => (
                <option key={driver.userId} value={driver.userId}>
                  {driver.firstName} {driver.lastName} - {driver.phoneNo}
                </option>

              ))}
            </select>
          </div>

          {selectedDriver && (
            <div style={{
              backgroundColor: '#F8F9FA',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #E5E7EB'
            }}>
              {(() => {
                const driver = availableDrivers.find(d => d.userId.toString() === selectedDriver);

                return driver ? (
                  <div>
                    <h4 style={{ color: '#161D20', margin: '0 0 10px 0' }}>Selected Driver Details:</h4>
                    <p><strong>Name:</strong> {driver.firstName} {driver.lastName}</p>
                    <p><strong>Phone:</strong> {driver.phoneNo}</p>
                    <p><strong>Email:</strong> {driver.email}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button
              value="Cancel"
              type="button"
              outlined
              onClick={() => setIsAssignModalOpen(false)}

            />
            <Button
              value="Confirm "
              type="button"
              onClick={handleAssignDriver}
              disabled={!selectedDriver}
            />
          </div>
        </div>
      </Modal>
      <Modal open={isRejectModalOpen} close={() => setIsRejectModalOpen(false)} footer={false}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h3 style={{ color: '#161D20', marginBottom: '20px' }}>Are you sure you want to reject this reservation?</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <Button
              value="Cancel"
              type="button"
              outlined
              onClick={() => setIsRejectModalOpen(false)}
            />
            <Button
              value="Confirm Reject"
              type="button"
              red
              onClick={handleRejectRequest}
            />
          </div>
        </div>
      </Modal>

    </div>
  );
}
