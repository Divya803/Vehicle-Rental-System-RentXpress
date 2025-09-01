import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Image from "../../assets/login car.png";
import { message } from "antd";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();


    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/users/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phoneNo, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                messageApi.success(data.message || "Password reset successfully");
                navigate("/login");
            } else {
                messageApi.error(data.message || "Failed to reset password ❌");
            }
        } catch (err) {
            messageApi.error("Error resetting password");
            console.error(err);
        }
    };

    return (
        <div className="forgot-container">
            {contextHolder}
            <img src={Image} alt="Car" className="car-image" />
            <div className="forgot-box">
                <h2>Reset Password</h2>
                <p className="info-text">Verify your details to reset your password.</p>

                <form onSubmit={handleReset}>
                    <div className="input-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Phone number</label>
                        <input
                            type="text"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="reset-btn">Reset Password</button>
                    <p className="back-login">
                        Remembered your password? <a href="/login">Log in</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
