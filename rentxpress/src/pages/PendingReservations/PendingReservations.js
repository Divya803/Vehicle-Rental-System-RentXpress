import React, { useState, useEffect } from "react";
import "./PendingReservations.css";
import { Link, useNavigate } from "react-router-dom";
import { FaCar, FaUser, FaClock, FaMapMarkerAlt, FaCheckCircle, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { MdOutlineCarCrash, MdAssignmentInd } from "react-icons/md";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import AdminCard from "../../components/AdminCard/AdminCard";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import axios from "axios";

export default function PendingReservations() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [confirmedRequests, setConfirmedRequests] = useState([]); // For confirmed requests
  const [showWithDriver, setShowWithDriver] = useState(true); // Toggle state
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
  
  const navigate = useNavigate();

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

        // Optional stats
        setVehicleCounts({
          pending: pendingResponse.data.length,
          approved: confirmedResponse.data.length,
          rejected: 0
        });
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchData();
  }, []);

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
      const response = await axios.patch(
        `http://localhost:5000/api/reservation/vehicles/${vehicleId}/availability`,
        { isAvailable: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local state for pending requests
      setPendingRequests(pendingRequests.map(req =>
        req.vehicleId === vehicleId
          ? { ...req, vehicleAvailable: !currentStatus }
          : req
      ));

      // Update the local state for confirmed requests
      setConfirmedRequests(confirmedRequests.map(req =>
        req.vehicleId === vehicleId
          ? { ...req, vehicleAvailable: !currentStatus }
          : req
      ));

      alert(`Vehicle availability updated to ${!currentStatus ? 'Available' : 'Unavailable'}`);
    } catch (error) {
      console.error("Error updating vehicle availability:", error);
      alert("Failed to update vehicle availability. Please try again.");
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

    alert(response.data.message);

    // Refresh data
    setIsAssignModalOpen(false);
    setIsDetailsModalOpen(false);

    // Re-fetch reservations
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
    alert("Failed to assign driver. Please try again.");
  }
};



  const openAssignModal = (request) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "190vh" }}>
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
              <div className="Dash-card">Approved Rentals</div>
              <div className="count">{vehicleCounts.approved}</div>
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
        display: 'flex', gap: '10px', margin: '30px 0 10px 0', paddingLeft
          : '50px'
      }}>
        <button
          onClick={() => setShowWithDriver(true)}
          style={{
            background: showWithDriver ? '#00A8A8' : '#F3F4F6',
            color: showWithDriver ? 'white' : '#161D20',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 28px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: showWithDriver ? '0 2px 8px #00A8A820' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Pending Requests
        </button>
        <button
          onClick={() => setShowWithDriver(false)}
          style={{
            background: !showWithDriver ? '#00A8A8' : '#F3F4F6',
            color: !showWithDriver ? 'white' : '#161D20',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 28px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: !showWithDriver ? '0 2px 8px #00A8A820' : 'none',
            transition: 'all 0.2s'
          }}
        >
          Confirmed Requests
        </button>
      </div>

      {/* Vehicle Rental Requests Table (With Driver) */}
      {showWithDriver && (
        <div className="reservation-requests">
          <div style={{ display: 'flex', alignItems: 'left', gap: '10px', marginBottom: '20px' }}>
            <MdAssignmentInd style={{ color: '#00A8A8', fontSize: '28px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>
              Pending Requests with Driver
            </p>
          </div>
          <div style={{ height: "100vh", overflowY: "auto" }}>
            <Table hover={true} style={{ fontSize: "1.10rem" }}>
              <TableRow data={[
                "Customer",
                "Vehicle",
                "Date Range",
                "Duration",
                "Amount",
                "Vehicle Status",
                "Actions"
              ]} />
              {pendingRequests.map((request) => (
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
                        // onClick={() => handleRejectRequest(request.id)}
                      />
                    </div>
                  ]}
                />
              ))}
            </Table>
            {pendingRequests.length === 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#9E9E9E'
              }}>
                <FaClock style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
                <p>No pending rental requests</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vehicle Rental Requests Table */}
      {!showWithDriver && (
        <div className="reservation-requests">
          <div style={{ display: 'flex', alignItems: 'left', gap: '10px', marginBottom: '20px' }}>
            <MdAssignmentInd style={{ color: '#00A8A8', fontSize: '28px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>
              Confirmed Requests
            </p>
          </div>
          <div style={{ height: "100vh", overflowY: "auto" }}>
            <Table hover={true} style={{ fontSize: "1.10rem" }}>
              <TableRow data={[
                "Customer",
                "Vehicle",
                "Date Range",
                "Duration",
                "Amount",
                "Vehicle Status",
                "Actions"
              ]} />
              {confirmedRequests.map((request) => (
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
                    <div className="actions-cell" >
                      <Button
                        type="button"
                        value="Reject"
                        red
                        outlined
                        style={{ width: "70px", fontSize: "12px" }}
                        // onClick={() => handleRejectRequest(request.id)}
                      />
                    </div>
                  ]}
                />
              ))}
            </Table>
            {confirmedRequests.length === 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#9E9E9E'
              }}>
                <FaClock style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
                <p>No confirmed rental requests</p>
              </div>
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
                // onClick={() => handleRejectRequest(selectedRequest.id)}
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
    </div>
  );
}
