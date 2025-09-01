import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { FaUser } from "react-icons/fa";
import Button from "../../components/Button/Button";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Modal from "../../components/Modal/Modal";
import { message } from "antd";


const UserProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [messageApi, contextHolder] = message.useMessage();


  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phoneNo,
            password: "********",
            role: data.role,
          });
        } else {
          alert(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        alert("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      messageApi.warning("New passwords don't match ⚠️");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        messageApi.success("Password changed successfully");
        setIsChangePasswordModalOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        messageApi.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      messageApi.error("Something went wrong ❌");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        messageApi.success("Account deleted successfully");
        localStorage.removeItem("token");
        window.location.href = "/"; // redirect to homepage or login
      } else {
        messageApi.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete error:", error);
      messageApi.error("Something went wrong ❌");
    }
  };

  return (
    <div>
      {contextHolder}
      <NavigationBar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-icon">
            <FaUser size={60} />
          </div>
          <div className="profile-fields">
            <div className="input-container">
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-container">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Phone No</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-container">
              <div>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  value="Change Password"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  style={{ width: "200px", marginTop: "25px" }}
                />
              </div>
              <div>
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <Button
            value="Delete Account"
            red
            onClick={() => setIsModalOpen(true)}
            style={{ width: "200px", marginLeft: "-80%", marginTop: "25px" }}
          />
        </div>

        {/* Delete Account Modal */}
        <Modal open={isModalOpen} close={setIsModalOpen}>
          <h3>Are you sure you want to delete your account?</h3>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <Button
              type="button"
              style={{ width: "110px" }}
              onClick={handleDeleteAccount}
              value="Yes"
            />
            <Button
              type="button"
              style={{ width: "110px" }}
              onClick={() => setIsModalOpen(false)}
              value="No"
              red
            />
          </div>
        </Modal>

        {/* Change Password Modal */}
        <Modal open={isChangePasswordModalOpen} close={setIsChangePasswordModalOpen}>
          <h3>Change Password</h3>
          <div style={{ marginTop: "20px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                style={{ width: "90%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                style={{ width: "90%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                style={{ width: "90%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button
                type="button"
                style={{ width: "110px" }}
                onClick={() => setIsChangePasswordModalOpen(false)}
                value="Cancel"
                red
              />
              <Button
                type="button"
                style={{ width: "110px" }}
                onClick={handleChangePassword}
                value="Change"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserProfile;