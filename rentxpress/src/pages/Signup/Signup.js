// import React from "react";
// import "./Signup.css";

// const Signup = () => {
//   return (
//     <div className="signup-container">
//       {/* Left Section */}
//       <div className="signup-left">
//         <h1>Welcome to RentXpress</h1>
//         <p>Rent vehicle with safe</p>
//         {/* <div className="image-container">
//           <img
//             src="https://global.toyota/pages/news/images/2015/03/30/1330/002_2.jpg"
//             alt="Car"
//             className="car-image"
//           />
//         </div> */}
//       </div>

//       {/* Right Section */}
//       <div className="signup-right">
//         <div className="signup-box">
//           <h2>Sign up now</h2>
//           <form>
//             <div className="name-fields">
//               <div className="input-group">
//                 <label htmlFor="first-name">First name</label>
//                 <input type="text" id="first-name" placeholder="First name" required />
//               </div>
//               <div className="input-group">
//                 <label htmlFor="last-name">Last name</label>
//                 <input type="text" id="last-name" placeholder="Last name" required />
//               </div>
//             </div>

//             <div className="input-group">
//               <label htmlFor="email">Email address</label>
//               <input type="email" id="email" placeholder="Email address" required />
//             </div>

//             <div className="input-group">
//               <label htmlFor="phone">Phone number</label>
//               <input type="tel" id="phone" placeholder="Phone number" required />
//             </div>

//             <div className="input-group">
//               <label htmlFor="password">Password</label>
//               <input type="password" id="password" placeholder="Password" required />
//             </div>

//             <p className="password-info">
//               Use 8 or more characters with a mix of letters, numbers & symbols
//             </p>
//             <button type="submit" className="signup-btn">Sign up</button>
//           </form>
//           <p className="login-text">
//             Already have an account? <a href="/login">Log in</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import axios from "axios";
import { message } from "antd"; // ✅ Import Ant Design message
import "./Signup.css";

const Signup = () => {
  const [messageApi, contextHolder] = message.useMessage(); // ✅ AntD message hook

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:5000/api/users", {
      ...formData,
      role: "user"
    });
    messageApi.success("User created successfully!");
    console.log("Signup successful:", response.data);

    // ✅ Clear form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      password: ""
    });
  } catch (error) {
    console.error("Signup error:", error);
    messageApi.error("Error creating user.");
  }
};


  return (
    <div className="signup-container">
      {contextHolder} {/* ✅ Include contextHolder */}
      <div className="signup-left">
        <h1>Welcome to RentXpress</h1>
        <p>Rent vehicle with safe</p>
      </div>

      <div className="signup-right">
        <div className="signup-box">
          <h2>Sign up now</h2>
          <form onSubmit={handleSubmit}>
            <div className="name-fields">
              <div className="input-group">
                <label htmlFor="firstName">First name</label>
                <input type="text" id="firstName" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input type="email" id="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="phoneNo">Phone number</label>
              <input type="tel" id="phoneNo" name="phoneNo" placeholder="Phone number" value={formData.phoneNo} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>

            <p className="password-info">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
            <button type="submit" className="signup-btn">Sign up</button>
          </form>
          <p className="login-text">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
