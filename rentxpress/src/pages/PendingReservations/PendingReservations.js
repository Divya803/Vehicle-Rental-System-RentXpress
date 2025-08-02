// import React, { useState, useEffect } from "react";
// import "./PendingVehicles.css";
// import { Link, useNavigate } from "react-router-dom";
// import { FaCarRear, FaCarOn } from "react-icons/fa6";
// import { MdOutlineCarCrash } from "react-icons/md";
// import NavigationBar from "../../components/NavigationBar/NavigationBar";
// import VehicleCard from "../../components/AdminCard/VehicleCard";
// import Button from "../../components/Button/Button";
// import Table, { TableRow } from "../../components/Table/Table";

// export default function AdDashboard() {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [verificationIssues, setVerificationIssues] = useState([]);
//   const navigate = useNavigate();

//   // Static JSON data for pending verification requests
//   const pendingUsersData = [
//     { userId: 1, userName: "Alice Smith", requestDate: "2025-03-18" },
//     { userId: 2, userName: "John Doe", requestDate: "2025-03-17" },
//     { userId: 3, userName: "Emma Brown", requestDate: "2025-03-16" },
//   ];

//   // Static JSON data for verification issues
//   const verificationIssuesData = [
//     { userId: 4, userName: "Michael Lee", issue: "Invalid documents" },
//     { userId: 5, userName: "Sophia Wilson", issue: "Mismatched ID details" },
//     { userId: 6, userName: "David Johnson", issue: "Unclear image" },
//   ];

//   useEffect(() => {
//     setPendingUsers(pendingUsersData);
//   }, []);

//   useEffect(() => {
//     setVerificationIssues(verificationIssuesData);
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? "Invalid Date" : date.toISOString().split("T")[0];
//   };

//   return (
//     <div style={{ backgroundColor: "white", minHeight: "200vh" }}>
//       <NavigationBar />

//       <div style={{ display: "flex" }}>
//         <VehicleCard>
//           <div style={{ display: "flex" }}>
//             <div>
//               <div className="vehicle-Dash-card">Pending Vehicles</div>
//               <div className="vehicle-count">100</div>
//             </div>
//             <div className="vehicle-icon">
//               <FaCarRear />
//             </div>
//           </div>
//         </VehicleCard>
//         <VehicleCard>
//           <div style={{ display: "flex" }}>
//             <div>
//               <div className="vehicle-Dash-card">Approved Vehicles</div>
//               <div className="vehicle-count">50</div>
//             </div>
//             <div className="vehicle-icon">
//               <FaCarOn />
//             </div>
//           </div>
//         </VehicleCard>
//         <VehicleCard>
//           <div style={{ display: "flex" }}>
//             <div>
//               <div className="vehicle-Dash-card">Rejected Vehicles</div>
//               <div className="vehicle-count">30</div>
//             </div>
//             <div className="vehicle-icon">
//               <MdOutlineCarCrash />
//             </div>
//           </div>
//         </VehicleCard>

//       </div>

     

//         {/* vehicle Request Table */}
//         <div className="vehicle-requests">
//           <p style={{ fontSize: "1.75rem", fontWeight: "500" }}>Vehicle Request</p>
//           <div style={{ height: "410px" }}>
            
//           </div>
//         </div>
    
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import "./PendingReservations.css";
import { Link, useNavigate } from "react-router-dom";
import { FaCar, FaUser, FaClock, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
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

  // Static data for development - replace with actual API calls
  const mockPendingRequests = [
    {
      id: 1,
      customerName: "Alice Johnson",
      customerPhone: "+94 77 123 4567",
      vehicleType: "SUV",
      vehicleName: "Toyota Prado",
      pickupLocation: "Colombo",
      dropoffLocation: "Kandy",
      startDate: "2025-08-05",
      endDate: "2025-08-07",
      duration: "2 days",
      needsDriver: true,
      totalAmount: "Rs. 45,000",
      requestDate: "2025-08-01",
      status: "pending",
      customerEmail: "alice.johnson@email.com"
    },
    {
      id: 2,
      customerName: "Michael Chen",
      customerPhone: "+94 71 987 6543",
      vehicleType: "Sedan",
      vehicleName: "Honda Civic",
      pickupLocation: "Negombo",
      dropoffLocation: "Galle",
      startDate: "2025-08-06",
      endDate: "2025-08-08",
      duration: "2 days",
      needsDriver: true,
      totalAmount: "Rs. 32,000",
      requestDate: "2025-08-01",
      status: "pending",
      customerEmail: "michael.chen@email.com"
    },
    {
      id: 3,
      customerName: "Sarah Williams",
      customerPhone: "+94 76 555 1234",
      vehicleType: "Van",
      vehicleName: "Toyota Hiace",
      pickupLocation: "Colombo Airport",
      dropoffLocation: "Sigiriya",
      startDate: "2025-08-10",
      endDate: "2025-08-12",
      duration: "2 days",
      needsDriver: true,
      totalAmount: "Rs. 52,000",
      requestDate: "2025-08-02",
      status: "pending",
      customerEmail: "sarah.williams@email.com"
    }
  ];

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

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      try {
        // Replace with actual API calls
        setPendingRequests(mockPendingRequests);
        setAvailableDrivers(mockAvailableDrivers);
        setVehicleCounts({
          pending: mockPendingRequests.length,
          approved: 45,
          rejected: 12
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
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

      alert("Driver assigned successfully!");
      
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <MdAssignmentInd style={{ color: '#00A8A8', fontSize: '28px' }} />
          <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>
            Vehicle Rental Requests with Driver
          </p>
        </div>
        
        <div style={{ height: "65vh", overflowY: "auto" }}>
          <Table hover={true} style={{ fontSize: "1.10rem"}}>
            <TableRow data={[
              "Customer", 
              "Vehicle",  
              "Date Range", 
              "Duration",
              "Amount",
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
                  <div className="actions-cell" >
                    <Button
                      type="button"
                      value="Assign Driver"
                      style={{ width: "100px", fontSize: "12px", marginBottom: "5px" }}
                      onClick={() => openAssignModal(request)}
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
              </div>
              
              <div>
                <h4 style={{ color: '#00A8A8', margin: '0 0 5px 0' }}>Trip Details</h4>
                <p><strong>Pickup:</strong> {selectedRequest.pickupLocation}</p>
                <p><strong>Drop-off:</strong> {selectedRequest.dropoffLocation}</p>
                <p><strong>Duration:</strong> {selectedRequest.duration}</p>
              </div>
              
              <div>
                <h4 style={{ color: '#00A8A8', margin: '0 0 5px 0' }}>Dates</h4>
                <p><strong>Start:</strong> {formatDate(selectedRequest.startDate)}</p>
                <p><strong>End:</strong> {formatDate(selectedRequest.endDate)}</p>
                <p><strong>Requested:</strong> {formatDate(selectedRequest.requestDate)}</p>
              </div>
            </div>

            <div style={{ marginTop: "25px", display: "flex", gap: "15px", justifyContent: "center" }}>
              <Button 
                value="Assign Driver" 
                type="button" 
                onClick={() => setIsAssignModalOpen(true)} 
                style={{ minWidth: "120px" }}
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