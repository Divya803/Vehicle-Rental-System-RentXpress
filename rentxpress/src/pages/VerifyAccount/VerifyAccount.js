import React, { useState } from "react";
import "./VerifyAccount.css";
import Button from "../../components/Button/Button";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import axios from "axios";
import verifyAccountValidation from "../../validations/verifyAccountValidation";

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

  // Separate state for different document types
  const [files, setFiles] = useState({
    nicDocument: null,
    licenseDocument: null,
    vehicleRegistration: null
  });

  const [previews, setPreviews] = useState({
    nicDocument: null,
    licenseDocument: null,
    vehicleRegistration: null
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.id]: e.target.value };

    // Clear files when role changes
    if (e.target.id === "role") {
      setFiles({
        nicDocument: null,
        licenseDocument: null,
        vehicleRegistration: null
      });
      setPreviews({
        nicDocument: null,
        licenseDocument: null,
        vehicleRegistration: null
      });
    }

    // Clear error for the field being changed
    if (errors[e.target.id]) {
      setErrors(prev => ({ ...prev, [e.target.id]: "" }));
    }

    setFormData(newFormData);
  };

  const handleFileChange = (documentType) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [documentType]: file }));

      // Clear error for the document being uploaded
      if (errors[documentType]) {
        setErrors(prev => ({ ...prev, [documentType]: "" }));
      }

      // Create preview if it's an image
      if (file.type.startsWith("image/")) {
        const previewURL = URL.createObjectURL(file);
        setPreviews(prev => ({ ...prev, [documentType]: previewURL }));
      } else {
        setPreviews(prev => ({ ...prev, [documentType]: "PDF" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create validation data including files
      const validationData = {
        ...formData,
        nicDocument: files.nicDocument,
        licenseDocument: files.licenseDocument,
        vehicleRegistration: files.vehicleRegistration
      };

      // Validate form data including documents
      await verifyAccountValidation.validate(validationData, { abortEarly: false });
      setErrors({}); // Clear any previous errors

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first");
        return;
      }

      const payload = new FormData();
      for (let key in formData) {
        payload.append(key, formData[key]);
      }

      // Add files based on role
      if (files.nicDocument) {
        payload.append("nicDocument", files.nicDocument);
      }

      if (formData.role === "Driver" && files.licenseDocument) {
        payload.append("licenseDocument", files.licenseDocument);
      }

      if (formData.role === "Vehicle Owner" && files.vehicleRegistration) {
        payload.append("vehicleRegistration", files.vehicleRegistration);
      }

      const response = await axios.post("http://localhost:5000/api/users/verify", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        phoneNo: "",
        nic: "",
        dateOfBirth: "",
        role: "",
      });
      setFiles({
        nicDocument: null,
        licenseDocument: null,
        vehicleRegistration: null
      });
      setPreviews({
        nicDocument: null,
        licenseDocument: null,
        vehicleRegistration: null
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle Yup validation errors
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        setMessage("");
      } else {
        console.error("Verification submission failed", error);
        setMessage("Submission failed. Please try again.");
      }
    }
  };

  const renderFileUpload = (documentType, label, accept = ".jpg,.jpeg,.png,.pdf") => (
    <div className="upload-container" key={documentType}>
      <input
        id={`${documentType}-upload`}
        type="file"
        accept={accept}
        onChange={handleFileChange(documentType)}
        hidden
      />
      <label htmlFor={`${documentType}-upload`} className="upload-label">
        {label}
      </label>
      <p className="upload-info">Max 10MB JPG/JPEG, PNG or PDF format</p>

      {previews[documentType] && (
        <div className="preview-box">
          {previews[documentType] === "PDF" ? (
            <p>PDF File Uploaded</p>
          ) : (
            <img
              src={previews[documentType]}
              alt={`${label} Preview`}
              className="preview-img"
            />
          )}
        </div>
      )}

      {errors[documentType] && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors[documentType]}</p>}
    </div>
  );

  const getRequiredDocuments = () => {
    const documents = [
      renderFileUpload("nicDocument", "Upload NIC Document")
    ];

    if (formData.role === "Driver") {
      documents.push(
        renderFileUpload("licenseDocument", "Upload Driver's License")
      );
    } else if (formData.role === "Vehicle Owner") {
      documents.push(
        renderFileUpload("vehicleRegistration", "Upload Vehicle Registration Document")
      );
    }

    return documents;
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
              and become an active part of our growing network. We're excited to have you on board!
            </strong>
          </p>
        </div>

        <form className="verify-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} className="form-input" />
              {errors.firstName && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.firstName}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} className="form-input" />
              {errors.lastName && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.lastName}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input type="number" id="age" value={formData.age} onChange={handleChange} className="form-input" />
              {errors.age && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.age}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNo">Phone Number</label>
              <input type="text" id="phoneNo" value={formData.phoneNo} onChange={handleChange} className="form-input" />
              {errors.phoneNo && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.phoneNo}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="nic">NIC</label>
              <input type="text" id="nic" value={formData.nic} onChange={handleChange} className="form-input" />
              {errors.nic && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.nic}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" value={formData.role} onChange={handleChange} className="form-input">
                <option value="">Select Role</option>
                <option value="Driver">Driver</option>
                <option value="Vehicle Owner">Vehicle Owner</option>
              </select>
              {errors.role && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.role}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input type="date" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" />
              {errors.dateOfBirth && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.dateOfBirth}</p>}
            </div>
          </div>

          {formData.role && (
            <>
              <h3 style={{ color: "white", marginBottom: "20px" }}>
                Required Documents for {formData.role}
              </h3>
              <div >
                {getRequiredDocuments()}
              </div>
            </>
          )}


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