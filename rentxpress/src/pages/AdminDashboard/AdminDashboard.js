import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUserShield, FaUserCog, FaUserTag } from "react-icons/fa";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import AdminCard from "../../components/AdminCard/AdminCard";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import axios from "axios";

export default function AdDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [verificationIssues, setVerificationIssues] = useState([]);
  const [roleCounts, setRoleCounts] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingVerifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/verify/pending", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setPendingUsers(data);
        } else {
          console.error("Unexpected response format:", data);
          setPendingUsers([]);
        }
      } catch (error) {
        console.error("Error fetching verification requests:", error);
        setPendingUsers([]);
      }
    };

    fetchPendingVerifications();
  }, []);

  useEffect(() => {
    const fetchVerificationIssues = async () => {
      const dummyData = [
        { userId: 4, userName: "Michael Lee", issue: "Invalid documents" },
        { userId: 5, userName: "Sophia Wilson", issue: "Mismatched ID details" },
        { userId: 6, userName: "David Johnson", issue: "Unclear image" },
      ];
      setVerificationIssues(dummyData);
    };

    fetchVerificationIssues();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toISOString().split("T")[0];
  };

  const handleVerify = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/verify/${selectedRequest.verifyId}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert("User verified successfully");
        setPendingUsers(pendingUsers.filter((u) => u.verifyId !== selectedRequest.verifyId));
        setIsModalOpen(false);
      } else {
        alert(data.message || "Verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Something went wrong");
    }
  };

  // const handleReject = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/users/verify/${selectedRequest.verifyId}/reject`, {
  //       method: "PATCH",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       alert("User verification rejected");
  //       setPendingUsers(pendingUsers.filter((u) => u.verifyId !== selectedRequest.verifyId));
  //       setIsModalOpen(false);
  //     } else {
  //       alert(data.message || "Rejection failed");
  //     }
  //   } catch (err) {
  //     console.error("Rejection error:", err);
  //     alert("Something went wrong");
  //   }
  // };

  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/verify/${selectedRequest.verifyId}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("User verification rejected");
        setPendingUsers(pendingUsers.filter((u) => u.verifyId !== selectedRequest.verifyId));
        setIsRejectModalOpen(false);
        setIsModalOpen(false);
        setRejectionReason(""); // clear input
      } else {
        alert(data.message || "Rejection failed");
      }
    } catch (err) {
      console.error("Rejection error:", err);
      alert("Something went wrong");
    }
  };


  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/counts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRoleCounts(res.data);
      } catch (error) {
        console.error("Error fetching user counts:", error);
      }
    };

    fetchUserCounts();
  }, []);

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <NavigationBar />

      <div style={{ display: "flex" }}>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Users</div>
              <div className="count">{roleCounts.user || 0}</div>
            </div>
            <div className="user-icon">
              <FaUsers />
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Drivers</div>
              <div className="count">{roleCounts["Driver"] || 0}</div>
            </div>
            <div className="user-icon">
              <FaUserShield />
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">V.Owners</div>
              <div className="count">{roleCounts["Vehicle Owner"] || 0}</div>
            </div>
            <div className="user-icon">
              <FaUserTag />
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Admins</div>
              <div className="count">{roleCounts["Admin"] || 0}</div>
            </div>
            <div className="user-icon">
              <FaUserCog />
            </div>
          </div>
        </AdminCard>
      </div>

      <div style={{ display: "flex" }}>
        <div className="requests">
          <p style={{ fontSize: "1.75rem", fontWeight: "500" }}>Verify Requests</p>
          <div style={{ height: "410px" }}>
            <Table hover={true} style={{ height: "65vh", overflowY: "auto", fontSize: "1.10rem" }}>
              <TableRow data={["Name", "Date of Birth", "Status"]} />
              {pendingUsers.map((user) => (
                <TableRow
                  key={user.verifyId}
                  data={[
                    `${user.firstName} ${user.lastName}`,
                    formatDate(user.dateOfBirth),
                    <Button
                      type="button"
                      style={{ width: "100px" }}
                      value="Verify"
                      outlined
                      onClick={() => {
                        setSelectedRequest(user);
                        setIsModalOpen(true);
                      }}
                    />,
                  ]}
                />
              ))}
            </Table>
          </div>
        </div>

        <div className="issues">
          <p style={{ fontSize: "1.75rem", fontWeight: "500" }}>Verification Issues</p>
          <div style={{ height: "410px" }}>
            <Table hover={true} style={{ height: "65vh", overflowY: "auto", fontSize: "1.10rem" }}>
              <TableRow data={["Name", "Issue", "Status"]} />
              {verificationIssues.slice(0, 7).map((user) => (
                <TableRow
                  key={user.userId}
                  data={[
                    user.userName,
                    user.issue,
                    <Button
                      type="button"
                      value="Review"
                      style={{ width: "100px" }}
                      outlined
                      red
                      onClick={() => navigate(`/Admin/AdminUserVerification/${user.userId}`)}
                    />,
                  ]}
                />
              ))}
            </Table>
          </div>
        </div>
      </div>

      <Modal open={isModalOpen} close={() => setIsModalOpen(false)} footer={false}>
        {selectedRequest && (
          <div style={{ padding: "10px" }}>
            <h2>User Verification Request</h2>
            <p><strong>Name:</strong> {selectedRequest.firstName} {selectedRequest.lastName}</p>
            <p><strong>Age:</strong> {selectedRequest.age}</p>
            <p><strong>Phone:</strong> {selectedRequest.phoneNo}</p>
            <p><strong>NIC:</strong> {selectedRequest.nic}</p>
            <p><strong>Date of Birth:</strong> {formatDate(selectedRequest.dateOfBirth)}</p>
            <p><strong>Role Requested:</strong> {selectedRequest.role}</p>
            <p><strong>Identification:</strong></p>
            {selectedRequest.identification && (
              <a
                href={`http://localhost:5000${selectedRequest.identification}`}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                Download File
              </a>
            )}

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <Button value="Verify" type="button" onClick={handleVerify} />
              {/* <Button value="Reject" type="button" red onClick={handleReject} /> */}
              <Button value="Reject" type="button" red onClick={() => setIsRejectModalOpen(true)} />

            </div>
          </div>
        )}
      </Modal>
      <Modal open={isRejectModalOpen} close={() => setIsRejectModalOpen(false)} footer={false}>
        <div style={{ padding: "10px" }}>
          <h3>Reason for Rejection</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason here..."
            style={{
              width: "100%",
              height: "100px",
              padding: "10px",
              marginTop: "10px",
              resize: "none",
              fontSize: "1rem",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
            <Button value="Cancel" type="button" onClick={() => setIsRejectModalOpen(false)} outlined />
            <Button value="Confirm Reject" type="button" red onClick={handleReject} />
          </div>
        </div>
      </Modal>

    </div>
  );
}
