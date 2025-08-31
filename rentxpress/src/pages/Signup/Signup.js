// import React, { useState } from "react";
// import axios from "axios";
// import { message } from "antd"; // ✅ Import Ant Design message
// import "./Signup.css";

// const Signup = () => {
//   const [messageApi, contextHolder] = message.useMessage(); // ✅ AntD message hook

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNo: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post("http://localhost:5000/api/users", {
//       ...formData,
//       role: "user"
//     });
//     messageApi.success("User created successfully!");
//     console.log("Signup successful:", response.data);

//     // ✅ Clear form
//     setFormData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       phoneNo: "",
//       password: ""
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     messageApi.error("Error creating user.");
//   }
// };


//   return (
//     <div className="signup-container">
//       {contextHolder} {/* ✅ Include contextHolder */}
//       <div className="signup-left">
//         <h1>Welcome to RentXpress</h1>
//         <p>Rent vehicle with safe</p>
//       </div>

//       <div className="signup-right">
//         <div className="signup-box">
//           <h2>Sign up now</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="name-fields">
//               <div className="input-group">
//                 <label htmlFor="firstName">First name</label>
//                 <input type="text" id="firstName" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required />
//               </div>
//               <div className="input-group">
//                 <label htmlFor="lastName">Last name</label>
//                 <input type="text" id="lastName" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required />
//               </div>
//             </div>

//             <div className="input-group">
//               <label htmlFor="email">Email address</label>
//               <input type="email" id="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
//             </div>

//             <div className="input-group">
//               <label htmlFor="phoneNo">Phone number</label>
//               <input type="tel" id="phoneNo" name="phoneNo" placeholder="Phone number" value={formData.phoneNo} onChange={handleChange} required />
//             </div>

//             <div className="input-group">
//               <label htmlFor="password">Password</label>
//               <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
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
import { message } from "antd";
import "./Signup.css";
import signupValidation from "../../validations/signupValidation";

const Signup = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };

    // Clear error for the field being changed
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      await signupValidation.validate(formData, { abortEarly: false });
      setErrors({}); // Clear any previous errors

      const response = await axios.post("http://localhost:5000/api/users", {
        ...formData,
        role: "user"
      });
      
      messageApi.success("User created successfully!");
      console.log("Signup successful:", response.data);

      // Clear form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        password: ""
      });

    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle Yup validation errors
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Signup error:", error);
        if (error.response?.data?.error) {
          messageApi.error(error.response.data.error);
        } else {
          messageApi.error("Error creating user.");
        }
      }
    }
  };

  return (
    <div className="signup-container">
      {contextHolder}
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
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  placeholder="First name" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  placeholder="Last name" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Email address" 
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="phoneNo">Phone number</label>
              <input 
                type="tel" 
                id="phoneNo" 
                name="phoneNo" 
                placeholder="Phone number" 
                value={formData.phoneNo} 
                onChange={handleChange} 
              />
              {errors.phoneNo && <p className="error-message">{errors.phoneNo}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
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