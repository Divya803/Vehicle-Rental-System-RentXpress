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
        const response = await axios.get("http://localhost:5000/api/reservation/pending", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPendingRequests(response.data);

        // Optional stats
        setVehicleCounts({
          pending: response.data.length,
          approved: 0,
          rejected: 0
        });
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchData();
  }, []);

  const mockAvailableDrivers = [
    {
      id: 1,
      name: "Kamal Perera",
      phone: "+94 77 111 2222",
      experience: "8 years",
      rating: 4.8,
      licenseType: "Heavy Vehicle",
      availability: "Available"
    },
    {
      id: 2,
      name: "Sunil Fernando",
      phone: "+94 71 333 4444",
      experience: "12 years",
      rating: 4.9,
      licenseType: "Light & Heavy Vehicle",
      availability: "Available"
    },
    {
      id: 3,
      name: "Ravi Silva",
      phone: "+94 76 555 6666",
      experience: "6 years",
      rating: 4.7,
      licenseType: "Light Vehicle",
      availability: "Available"
    },
    {
      id: 4,
      name: "Chaminda Raj",
      phone: "+94 78 777 8888",
      experience: "10 years",
      rating: 4.6,
      licenseType: "Heavy Vehicle",
      availability: "Available"
    }
  ];

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

      // Update the local state
      setPendingRequests(pendingRequests.map(req =>
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
    if (!selectedDriver || !selectedRequest) {
      alert("Please select a driver");
      return;
    }

    try {
      // API call to assign driver
      const response = await axios.post(
        `http://localhost:5000/api/rentals/${selectedRequest.id}/assign-driver`,
        { driverId: selectedDriver },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Automatically set vehicle as unavailable when reservation is approved
      await axios.patch(
        `http://localhost:5000/api/vehicles/${selectedRequest.vehicleId}/availability`,
        { isAvailable: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Driver assigned and vehicle marked as unavailable!");
      
      // Update the requests list
      setPendingRequests(pendingRequests.filter(req => req.id !== selectedRequest.id));
      
      // Close modals and reset state
      setIsAssignModalOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedDriver("");
      setSelectedRequest(null);
      
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Failed to assign driver. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to reject this rental request?")) {
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/rentals/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Rental request rejected");
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
      
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request. Please try again.");
    }
  };

  const openAssignModal = (request) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "150vh" }}>
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

      {/* Vehicle Rental Requests Table */}
      <div className="reservation-requests">
        <div style={{ display: 'flex', alignItems: 'left', gap: '10px', marginBottom: '20px' }}>
          <MdAssignmentInd style={{ color: '#00A8A8', fontSize: '28px' }} />
          <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>
            Vehicle Rental Requests with Driver
          </p>
        </div>
        
        <div style={{ height: "75vh", overflowY: "auto" }}>
          <Table hover={true} style={{ fontSize: "1.10rem"}}>
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
                      onClick={() => handleRejectRequest(request.id)}
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
                onClick={() => handleRejectRequest(selectedRequest.id)}
                style={{ minWidth: "120px" }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Driver Assignment Modal */}
      <Modal open={isAssignModalOpen} close={() => setIsAssignModalOpen(false)} footer={false}>
        <div style={{ padding: "20px", minWidth: "500px" }}>
          <h3 style={{ color: '#161D20', marginBottom: '20px' }}>Select Driver for Assignment</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#161D20' }}>
              Available Drivers:
            </label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #E5E7EB",
                fontSize: "1rem",
                backgroundColor: "white"
              }}
            >
              <option value="">Select a driver...</option>
              {availableDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.experience} experience (Rating: {driver.rating}⭐)
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
                const driver = availableDrivers.find(d => d.id.toString() === selectedDriver);
                return driver ? (
                  <div>
                    <h4 style={{ color: '#161D20', margin: '0 0 10px 0' }}>Selected Driver Details:</h4>
                    <p><strong>Name:</strong> {driver.name}</p>
                    <p><strong>Phone:</strong> {driver.phone}</p>
                    <p><strong>Experience:</strong> {driver.experience}</p>
                    <p><strong>License Type:</strong> {driver.licenseType}</p>
                    <p><strong>Rating:</strong> {driver.rating}⭐</p>
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
              value="Confirm Assignment" 
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
