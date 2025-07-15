import React, { useState, useEffect } from "react";
import "./PendingVehicles.css";
import { Link, useNavigate } from "react-router-dom";
import { FaCarRear, FaCarOn } from "react-icons/fa6";
import { MdOutlineCarCrash } from "react-icons/md";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import VehicleCard from "../../components/AdminCard/VehicleCard";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";

export default function AdDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [verificationIssues, setVerificationIssues] = useState([]);
  const navigate = useNavigate();

  // Static JSON data for pending verification requests
  const pendingUsersData = [
    { userId: 1, userName: "Alice Smith", requestDate: "2025-03-18" },
    { userId: 2, userName: "John Doe", requestDate: "2025-03-17" },
    { userId: 3, userName: "Emma Brown", requestDate: "2025-03-16" },
  ];

  // Static JSON data for verification issues
  const verificationIssuesData = [
    { userId: 4, userName: "Michael Lee", issue: "Invalid documents" },
    { userId: 5, userName: "Sophia Wilson", issue: "Mismatched ID details" },
    { userId: 6, userName: "David Johnson", issue: "Unclear image" },
  ];

  useEffect(() => {
    setPendingUsers(pendingUsersData);
  }, []);

  useEffect(() => {
    setVerificationIssues(verificationIssuesData);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toISOString().split("T")[0];
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "200vh" }}>
      <NavigationBar />

      <div style={{ display: "flex" }}>
        <VehicleCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="vehicle-Dash-card">Pending Vehicles</div>
              <div className="vehicle-count">100</div>
            </div>
            <div className="vehicle-icon">
              <FaCarRear />
            </div>
          </div>
        </VehicleCard>
        <VehicleCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="vehicle-Dash-card">Approved Vehicles</div>
              <div className="vehicle-count">50</div>
            </div>
            <div className="vehicle-icon">
              <FaCarOn />
            </div>
          </div>
        </VehicleCard>
        <VehicleCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="vehicle-Dash-card">Rejected Vehicles</div>
              <div className="vehicle-count">30</div>
            </div>
            <div className="vehicle-icon">
              <MdOutlineCarCrash />
            </div>
          </div>
        </VehicleCard>

      </div>

     

        {/* vehicle Request Table */}
        <div className="vehicle-requests">
          <p style={{ fontSize: "1.75rem", fontWeight: "500" }}>Vehicle Request</p>
          <div style={{ height: "410px" }}>
            
          </div>
        </div>
    
    </div>
  );
}
