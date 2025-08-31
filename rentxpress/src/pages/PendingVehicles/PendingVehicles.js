import React, { useState, useEffect } from "react";
import "./PendingVehicles.css";
import { FaCar, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import AdminCard from "../../components/AdminCard/AdminCard";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import { message } from "antd";
import axios from "axios";


export default function AdminVehicleApproval() {
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [vehicleCounts, setVehicleCounts] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchPendingVehicles();
    fetchVehicleCounts();
  }, []);

  const fetchPendingVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (Array.isArray(res.data)) {
        setPendingVehicles(res.data);
      } else {
        console.error("Unexpected response format:", res.data);
        setPendingVehicles([]);
      }
    } catch (error) {
      console.error("Error fetching pending vehicles:", error);
      setPendingVehicles([]);
    }
  };

  const fetchVehicleCounts = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/vehicles/counts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setVehicleCounts(res.data);
  } catch (error) {
    console.error("Error fetching vehicle counts:", error);
  }
};


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price).replace('LKR', 'Rs.');
  };

  const handleApprove = async () => {
  try {
    await axios.patch(
      `http://localhost:5000/api/vehicles/${selectedVehicle.id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    messageApi.success("Vehicle approved successfully!");
    setPendingVehicles(pendingVehicles.filter((v) => v.id !== selectedVehicle.id));
    setIsModalOpen(false);
    fetchVehicleCounts(); // Refresh counts
  } catch (err) {
    console.error("Approval error:", err);
    messageApi.error("Something went wrong");
  }
};

 

  const handleReject = async () => {
  if (!rejectionReason.trim()) return;

  try {
    await axios.patch(
      `http://localhost:5000/api/vehicles/${selectedVehicle.id}/reject`,
      { reason: rejectionReason },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    messageApi.success("Vehicle rejected");
    setPendingVehicles(pendingVehicles.filter((v) => v.id !== selectedVehicle.id));
    setIsRejectModalOpen(false);
    setIsModalOpen(false);
    setRejectionReason("");
    fetchVehicleCounts(); // Refresh counts
  } catch (err) {
    console.error("Rejection error:", err);
    messageApi.error("Something went wrong");
  }
};


  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {contextHolder}
      <NavigationBar />

      {/* Stats Cards */}
      <div style={{ display: "flex" }}>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Pending</div>
              <div className="count">{vehicleCounts.pending || 0}</div>
            </div>
            <div className="user-icon">
              <FaClock />
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Approved</div>
              <div className="count">{vehicleCounts.approved || 0}</div>
            </div>
            <div className="user-icon">
              <FaCheckCircle />
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Rejected</div>
              <div className="count">{vehicleCounts.rejected || 0}</div>
            </div>
            <div className="user-icon">
              <FaTimesCircle />
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Total</div>
              <div className="count">{vehicleCounts.total || 0}</div>
            </div>
            <div className="user-icon">
              <FaCar />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Pending Vehicles Table */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="vehicle-requests">
          <p style={{ fontSize: "1.75rem", fontWeight: "500" }}>Vehicle Approval Requests</p>
          <div style={{ height: "500px" }}>
            <Table hover={true} style={{ height: "70vh", overflowY: "auto", fontSize: "1.10rem" }}>
              <TableRow data={["Vehicle Name", "Owner", "Category", "Price", "Status", "Action"]} />
              {pendingVehicles.map((vehicle) => (
                <TableRow
                  key={vehicle.id}
                  data={[
                    vehicle.name,
                    vehicle.ownerName,
                    vehicle.category,
                    formatPrice(vehicle.price),
                    <span className="status-pending">Pending</span>,
                    <Button
                      type="button"
                      style={{ width: "100px" }}
                      value="Review"
                      outlined
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setIsModalOpen(true);
                      }}
                    />,
                  ]}
                />
              ))}
            </Table>
          </div>
        </div>
      </div>

      {/* Vehicle Details Modal */}
      <Modal open={isModalOpen} close={() => setIsModalOpen(false)} footer={false}>
        {selectedVehicle && (
          <div style={{ padding: "20px", maxWidth: "600px" }}>
            <h2 style={{ color: "#161D20", marginBottom: "20px" }}>Vehicle Approval Request</h2>
            
            <div className="vehicle-details-grid">
              <div className="vehicle-info">
                <div className="info-row">
                  <span className="info-label">Vehicle Name:</span>
                  <span className="info-value">{selectedVehicle.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Owner:</span>
                  <span className="info-value">{selectedVehicle.ownerName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{selectedVehicle.category}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Price:</span>
                  <span className="info-value price">{formatPrice(selectedVehicle.price)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Contact:</span>
                  <span className="info-value">{selectedVehicle.ownerPhone}</span>
                </div>
              </div>

              <div className="vehicle-image">
                {selectedVehicle.image && (
                  <img
                    src={selectedVehicle.image}
                    alt={selectedVehicle.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "2px solid #e0e0e0"
                    }}
                  />
                )}
              </div>
            </div>

            <div className="description-section">
              <span className="info-label">Description:</span>
              <div className="description-text">
                {selectedVehicle.description}
              </div>
            </div>

            {selectedVehicle.documents && selectedVehicle.documents.length > 0 && (
              <div className="documents-section">
                <h4 style={{ color: "#161D20", marginBottom: "10px" }}>Documents:</h4>
                {selectedVehicle.documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <a
                      href={`http://localhost:5000${doc.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      📄 {doc.name || `Document ${index + 1}`}
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <Button 
                value="Approve" 
                type="button" 
                onClick={handleApprove}
                style={{ backgroundColor: "#00A8A8", color: "white" }}
              />
              <Button 
                value="Reject" 
                type="button" 
                red 
                onClick={() => setIsRejectModalOpen(true)} 
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal open={isRejectModalOpen} close={() => setIsRejectModalOpen(false)} footer={false}>
        <div style={{ padding: "20px" }}>
          <h3 style={{ color: "#161D20", marginBottom: "15px" }}>Reason for Rejection</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            style={{
              width: "100%",
              height: "120px",
              padding: "15px",
              marginTop: "10px",
              resize: "none",
              fontSize: "1rem",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontFamily: "inherit"
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <Button 
              value="Cancel" 
              type="button" 
              onClick={() => setIsRejectModalOpen(false)} 
              outlined 
            />
            <Button 
              value="Confirm Reject" 
              type="button" 
              red 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}