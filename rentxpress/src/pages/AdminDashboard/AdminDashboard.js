import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUserShield, FaUserCog, FaUserTag, FaDownload, FaEye } from "react-icons/fa";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import AdminCard from "../../components/AdminCard/AdminCard";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import axios from "axios";
import { message } from "antd";

export default function AdDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [verificationIssues, setVerificationIssues] = useState([]);
  const [roleCounts, setRoleCounts] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [fileError, setFileError] = useState("");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchPendingVerifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/verify/pending", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(res.data)) {
          setPendingUsers(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
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
      try {
        const res = await axios.get("http://localhost:5000/api/users/verify/issues", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(res.data)) {
          setVerificationIssues(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
          setVerificationIssues([]);
        }
      } catch (error) {
        console.error("Error fetching verification issues:", error);
        setVerificationIssues([]);
      }
    };

    fetchVerificationIssues();
  }, []);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toISOString().split("T")[0];
  };

  // Helper function to parse identification field
  const parseIdentificationFiles = (identificationData) => {
    if (!identificationData) return {};

    try {
      // If it's already an object, return it
      if (typeof identificationData === 'object') {
        return identificationData;
      }

      // If it's a JSON string, parse it
      if (typeof identificationData === 'string') {
        return JSON.parse(identificationData);
      }
    } catch (error) {
      console.error('Error parsing identification data:', error);
      return {};
    }

    return {};
  };

  // Function to handle file download with proper authentication
  const handleFileDownload = async (filePath, fileName) => {
    try {
      setFileError("");

      if (!filePath) {
        setFileError("No file path provided");
        return;
      }

      // Clean the file path - remove leading slash if present
      const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

      const response = await axios.get(`http://localhost:5000/${cleanPath}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: 'blob', // Important for file downloads
      });

      // Get the content type to determine file extension
      const contentType = response.headers['content-type'];

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from path or use provided fileName
      const downloadFileName = fileName || filePath.split('/').pop() || 'document';
      link.setAttribute('download', downloadFileName);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the URL
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download error:', error);
      if (error.response?.status === 404) {
        setFileError('File not found. It may have been moved or deleted.');
      } else {
        setFileError('Failed to download file. Please try again.');
      }
    }
  };

  // Function to handle file preview
  const handleFilePreview = async (filePath) => {
    try {
      setFileError("");

      if (!filePath) {
        setFileError("No file path provided");
        return;
      }

      const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

      // First check if file exists by making a HEAD request
      await axios.head(`http://localhost:5000/${cleanPath}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // If file exists, open in new tab
      const fileUrl = `http://localhost:5000/${cleanPath}?token=${localStorage.getItem("token")}`;
      window.open(fileUrl, '_blank');

    } catch (error) {
      console.error('Preview error:', error);
      if (error.response?.status === 404) {
        setFileError('File not found. It may have been moved or deleted.');
      } else {
        setFileError('Failed to preview file. Please try again.');
      }
    }
  };

  const handleVerify = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/verify/${selectedRequest.verifyId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      messageApi.success("User verified successfully"); // ✅ Success message
      setPendingUsers(pendingUsers.filter((u) => u.verifyId !== selectedRequest.verifyId));
      setIsModalOpen(false);
    } catch (err) {
      console.error("Verification error:", err);
      messageApi.error("Failed to verify user ❌"); // ❌ Error message
    }
  };

  const handleReject = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/verify/${selectedRequest.verifyId}/reject`,
        { reason: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      messageApi.success("User verification rejected"); // ✅ Rejected message
      setPendingUsers(pendingUsers.filter((u) => u.verifyId !== selectedRequest.verifyId));
      setIsRejectModalOpen(false);
      setIsModalOpen(false);
      setRejectionReason("");
    } catch (err) {
      console.error("Rejection error:", err);
      messageApi.error("Failed to reject verification ❌");
    }
  };


  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {contextHolder}
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
                        setFileError("");
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
              <TableRow data={["Name", "Issue"]} />
              {verificationIssues.slice(0, 7).map((user) => (
                <TableRow
                  key={user.userId}
                  data={[
                    user.userName,
                    user.issue,
                  ]}
                />
              ))}
            </Table>
          </div>
        </div>
      </div>

      <Modal open={isModalOpen} close={() => setIsModalOpen(false)} footer={false}>
        {selectedRequest && (
          <div style={{ padding: "20px", maxWidth: "700px" }}>
            <h2 style={{ marginBottom: "20px", color: "#333" }}>User Verification Request</h2>

            <div style={{ marginBottom: "15px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <p><strong>Name:</strong> {selectedRequest.firstName} {selectedRequest.lastName}</p>
                <p><strong>Age:</strong> {selectedRequest.age}</p>
                <p><strong>Phone:</strong> {selectedRequest.phoneNo}</p>
                <p><strong>NIC:</strong> {selectedRequest.nic}</p>
                <p><strong>Date of Birth:</strong> {formatDate(selectedRequest.dateOfBirth)}</p>
                <p><strong>Role Requested:</strong> {selectedRequest.role}</p>
              </div>
            </div>

            <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
              <p style={{ marginBottom: "15px", fontWeight: "bold", fontSize: "16px" }}>Uploaded Documents:</p>

              {(() => {
                const files = parseIdentificationFiles(selectedRequest.identification);
                const fileEntries = Object.entries(files);

                if (fileEntries.length === 0) {
                  return (
                    <p style={{ color: "#666", fontStyle: "italic" }}>No documents provided</p>
                  );
                }

                return fileEntries.map(([docType, filePath]) => {
                  if (!filePath) return null;

                  const docTypeLabels = {
                    nicDocument: 'NIC Document',
                    licenseDocument: 'License Document',
                    vehicleRegistration: 'Vehicle Registration'
                  };

                  const label = docTypeLabels[docType] || docType;
                  const fileName = filePath.split('/').pop();

                  return (
                    <div key={docType} style={{
                      marginBottom: "15px",
                      padding: "10px",
                      backgroundColor: "white",
                      borderRadius: "5px",
                      border: "1px solid #ddd"
                    }}>
                      <p style={{ marginBottom: "8px", fontWeight: "500" }}>{label}:</p>
                      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>{fileName}</p>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                          type="button"
                          value="Preview"
                          outlined
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "8px 16px",
                            fontSize: "0.9rem"
                          }}
                          onClick={() => handleFilePreview(filePath)}
                        >
                          <FaEye /> Preview
                        </Button>

                        <Button
                          type="button"
                          value="Download"
                          outlined
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "8px 16px",
                            fontSize: "0.9rem"
                          }}
                          onClick={() => handleFileDownload(
                            filePath,
                            `${selectedRequest.firstName}_${selectedRequest.lastName}_${label.replace(/\s+/g, '_')}`
                          )}
                        >
                          <FaDownload /> Download
                        </Button>
                      </div>
                    </div>
                  );
                });
              })()}

              {fileError && (
                <div style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "#ffe6e6",
                  borderRadius: "5px",
                  border: "1px solid #ffcccc"
                }}>
                  <p style={{ color: "#d00", margin: 0, fontSize: "0.9rem" }}>
                    {fileError}
                  </p>
                </div>
              )}
            </div>

            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              borderTop: "1px solid #eee",
              paddingTop: "20px"
            }}>
              <Button
                value="Cancel"
                type="button"
                outlined
                onClick={() => setIsModalOpen(false)}
              />
              <Button
                value="Reject"
                type="button"
                red
                onClick={() => setIsRejectModalOpen(true)}
              />
              <Button
                value="Verify"
                type="button"
                onClick={handleVerify}
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal open={isRejectModalOpen} close={() => setIsRejectModalOpen(false)} footer={false}>
        <div style={{ padding: "20px", minWidth: "400px" }}>
          <h3 style={{ marginBottom: "15px", color: "#333" }}>Reason for Rejection</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter detailed reason for rejection..."
            style={{
              width: "100%",
              height: "120px",
              padding: "12px",
              marginTop: "10px",
              resize: "vertical",
              fontSize: "1rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontFamily: "inherit"
            }}
          />
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px"
          }}>
            <Button
              value="Cancel"
              type="button"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason("");
              }}
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
