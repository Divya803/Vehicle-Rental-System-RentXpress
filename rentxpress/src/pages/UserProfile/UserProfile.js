import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { FaUser } from "react-icons/fa";
import Button from "../../components/Button/Button";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Modal from "../../components/Modal/Modal";

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
  // 🔹 Fetch user profile when component mounts
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
            password: data.password,
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
        alert("Account deleted successfully");
        localStorage.removeItem("token");
        window.location.href = "/"; // redirect to homepage or login
      } else {
        alert(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };


  return (
    <div>
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
          {/* <Button
            value="Delete Account"
            red
            style={{ width: "200px", marginLeft: "-80%", marginTop: "25px" }}
          /> */}
          <Button
            value="Delete Account"
            red
            onClick={() => setIsModalOpen(true)}
            style={{ width: "200px", marginLeft: "-80%", marginTop: "25px" }}
          />

        </div>
        <Modal open={isModalOpen} close={setIsModalOpen}>
          <h3>Are you sure you want to delete your account?</h3>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            {/* <button onClick={() => setIsModalOpen(false)} style={{ padding: "8px 16px" }}>
      Cancel
    </button>
    <button
      onClick={handleDeleteAccount}
      style={{ backgroundColor: "red", color: "white", padding: "8px 16px" }}
    >
      Confirm Delete
    </button> */}
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

      </div>
    </div>
  );
};

export default UserProfile;
