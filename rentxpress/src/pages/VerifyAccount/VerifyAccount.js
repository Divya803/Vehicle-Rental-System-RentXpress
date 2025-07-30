// import React, { useState } from "react";
// import "./VerifyAccount.css";
// import Button from "../../components/Button/Button";
// import NavigationBar from "../../components/NavigationBar/NavigationBar";

// const VerifyAccount = () => {
//   const [role, setRole] = useState("");
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   return (
//     <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
//       <NavigationBar />
//     <div className="verify-container">
//       <h2 className="verify-title">Verify Your Account</h2>
//       <form className="verify-form">
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="first-name">First Name</label>
//             <input type="text" id="first-name" placeholder="First Name" className="form-input" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="last-name">Last Name</label>
//             <input type="text" id="last-name" placeholder="Last Name" className="form-input" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="age">Age</label>
//             <input type="number" id="age" placeholder="Age" className="form-input" />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="phone">Phone Number</label>
//             <input type="text" id="phone" placeholder="Phone Number" className="form-input" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="nic">NIC</label>
//             <input type="text" id="nic" placeholder="NIC" className="form-input" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="role">Role</label>
//             <select id="role" className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="">Select Role</option>
//               <option value="driver">Driver</option>
//               <option value="vehicle-owner">Vehicle Owner</option>
//             </select>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="dob">Date of Birth</label>
//             <input type="date" id="dob" className="form-input" />
//           </div>
//         </div>

//         {/* <div className="upload-container">
//           <label htmlFor="file-upload" className="upload-button">
//             Upload Profile Picture
//           </label>
//           <input id="file-upload" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} hidden />
//           <p className="upload-info">Max 10MB JPG/JPEG or PNG format</p>
//         </div> */}
//         <div className="upload-container">
//           <input
//             id="file-upload"
//             type="file"
//             accept=".jpg,.jpeg,.png"
//             onChange={handleFileChange}
//             hidden
//           />
//           <label htmlFor="file-upload" className="upload-label">
//             Upload Identifications
//           </label>
//           <p className="upload-info">Max 10MB JPG/JPEG or PNG format</p>
//         </div>


//         <div className="button-container">
//           <Button type="submit" value="Submit" style={{ width: "100px" }} />
//           <Button type="button" value="Cancel" red style={{ width: "100px" }} />
//         </div>
//       </form>
//     </div>
//     </div>
//   );
// };

// export default VerifyAccount;

// import React, { useState } from "react";
// import "./VerifyAccount.css";
// import Button from "../../components/Button/Button";
// import NavigationBar from "../../components/NavigationBar/NavigationBar";
// import axios from "axios";

// const VerifyAccount = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     age: "",
//     phoneNo: "",
//     nic: "",
//     dateOfBirth: "",
//     role: "",
//   });

//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//     setPreview(URL.createObjectURL(selectedFile));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const payload = new FormData();

//       // Replace this with the actual user ID (from context/auth)
//       const userId = 1;

//       for (let key in formData) {
//         payload.append(key, formData[key]);
//       }
//       payload.append("userId", userId);
//       if (file) payload.append("identification", file);

//       const response = await axios.post("http://localhost:5000/api/users/verify", payload);
//       setMessage(response.data.message);
//     } catch (error) {
//       console.error("Verification submission failed", error);
//       setMessage("Submission failed. Please try again.");
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
//       <NavigationBar />
//       <div className="verify-container">
//         <h2 className="verify-title">Verify Your Account</h2>
//         <form className="verify-form" >
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="firstName">First Name</label>
//               <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} className="form-input" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="lastName">Last Name</label>
//               <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} className="form-input" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="age">Age</label>
//               <input type="number" id="age" value={formData.age} onChange={handleChange} className="form-input" />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="phoneNo">Phone Number</label>
//               <input type="text" id="phoneNo" value={formData.phoneNo} onChange={handleChange} className="form-input" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="nic">NIC</label>
//               <input type="text" id="nic" value={formData.nic} onChange={handleChange} className="form-input" />
//             </div>
//             <div className="form-group">
//               <label htmlFor="role">Role</label>
//               <select id="role" value={formData.role} onChange={handleChange} className="form-input">
//                 <option value="Driver">Driver</option>
//                 <option value="Vehicle Owner">Vehicle Owner</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="dateOfBirth">Date of Birth</label>
//               <input type="date" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" />
//             </div>
//           </div>

//           <div className="upload-container">
//             <input
//               id="file-upload"
//               type="file"
//               accept=".jpg,.jpeg,.png"
//               onChange={handleFileChange}
//               hidden
//             />
//             <label htmlFor="file-upload" className="upload-label">
//               Upload Identification
//             </label>
//             <p className="upload-info">Max 10MB JPG/JPEG or PNG format</p>

//             {preview && (
//               <div className="preview-box">
//                 <img src={preview} alt="Preview" className="preview-img" />
//               </div>
//             )}
//           </div>

//           <div className="button-container">
//             <Button type="submit" value="Submit" style={{ width: "100px" }} onClick={handleSubmit}/>
//             <Button type="button" value="Cancel" red style={{ width: "100px" }} />
//           </div>

//           {message && <p style={{ marginTop: "10px" }}>{message}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VerifyAccount;

import React, { useState } from "react";
import "./VerifyAccount.css";
import Button from "../../components/Button/Button";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import axios from "axios";

const VerifyAccount = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phoneNo: "",
    nic: "",
    dateOfBirth: "",
    role: "",
  });

  // const [file, setFile] = useState(null);
  // const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState([]); // rename from single file to multiple
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setFile(selectedFile);
  //   setPreview(URL.createObjectURL(selectedFile));
  // };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const previewURLs = selectedFiles.map(file => {
      if (file.type.startsWith("image/")) return URL.createObjectURL(file);
      return null; // Skip preview for PDFs
    });
    setPreviews(previewURLs);
  };

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       alert("Please log in first");
  //       return;
  //     }

  //     const payload = new FormData();
  //     for (let key in formData) {
  //       payload.append(key, formData[key]);
  //     }
  //     if (file) {
  //       payload.append("identification", file);
  //     }

  //     const response = await axios.post("http://localhost:5000/api/users/verify", payload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     setMessage(response.data.message);

  //     // ✅ Reset the form fields and file after successful submission
  //     setFormData({
  //       firstName: "",
  //       lastName: "",
  //       age: "",
  //       phoneNo: "",
  //       nic: "",
  //       dateOfBirth: "",
  //       role: "",
  //     });
  //     setFile(null);
  //     setPreview(null);
  //   } catch (error) {
  //     console.error("Verification submission failed", error);
  //     setMessage("Submission failed. Please try again.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first");
        return;
      }

      const payload = new FormData();
      for (let key in formData) {
        payload.append(key, formData[key]);
      }

      // ✅ Append multiple files
      files.forEach((file) => {
        payload.append("identification", file);
      });

      const response = await axios.post("http://localhost:5000/api/users/verify", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);

      // ✅ Reset form
      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        phoneNo: "",
        nic: "",
        dateOfBirth: "",
        role: "",
      });
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error("Verification submission failed", error);
      setMessage("Submission failed. Please try again.");
    }
  };


  return (
<div style={{ backgroundColor: "white", minHeight: "100vh" }}>
  <NavigationBar />
  

  <div className="verify-container">
    
    
    <h2 className="verify-title">Verify Your Account</h2>
    <div>
    <p className="verify-subtitle">
      <strong>To get started as a Driver or Vehicle Owner on our platform, please complete the verification process by providing your personal and identification details. 
      Verified accounts help us maintain trust and safety across our rental community. Once verified, you'll be able to offer vehicles for rent or provide driving services, connect with customers, 
      and become an active part of our growing network. We’re excited to have you on board!
    </strong></p>
  </div>
    <form className="verify-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input type="number" id="age" value={formData.age} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNo">Phone Number</label>
              <input type="text" id="phoneNo" value={formData.phoneNo} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="nic">NIC</label>
              <input type="text" id="nic" value={formData.nic} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" value={formData.role} onChange={handleChange} className="form-input">
                <option value="Driver">Driver</option>
                <option value="Vehicle Owner">Vehicle Owner</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input type="date" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div className="upload-container">
            {/* <input
              id="file-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              hidden
            /> */}
            <input
              id="file-upload"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              hidden
              multiple
            />

            <label htmlFor="file-upload" className="upload-label">
              Upload Identification
            </label>
            <p className="upload-info">Max 10MB JPG/JPEG or PNG format</p>

            {/* {preview && (
              <div className="preview-box">
                <img src={preview} alt="Preview" className="preview-img" />
              </div>
            )} */}
            {previews.map((preview, index) =>
              preview ? (
                <div key={index} className="preview-box">
                  <img src={preview} alt={`Preview ${index}`} className="preview-img" />
                </div>
              ) : (
                <div key={index} className="preview-box">
                  <p>PDF File Uploaded</p>
                </div>
              )
            )}

          </div>

          <div className="button-container">
            <Button type="submit" value="Submit" style={{ width: "100px" }} onClick={handleSubmit} />
            <Button type="button" value="Cancel" red style={{ width: "100px" }} />
          </div>

          {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;
