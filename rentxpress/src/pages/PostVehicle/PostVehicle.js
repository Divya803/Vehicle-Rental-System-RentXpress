// import React, { useState, useRef } from "react";
// import "./PostVehicle.css";
// import Button from "../../components/Button/Button";
// import NavigationBar from "../../components/NavigationBar/NavigationBar";
// import { message } from "antd";

// const PostVehicle = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     image: "",
//     category: "",
//     description: "",
//   });

//   const fileInputRef = useRef(null); // Add ref for file input

//   const [messageApi, contextHolder] = message.useMessage();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const userId = localStorage.getItem("userId"); // ✅ dynamic userId
//       const formDataObj = new FormData();

//       formDataObj.append("name", formData.name);
//       formDataObj.append("price", formData.price);
//       formDataObj.append("image", formData.image);
//       formDataObj.append("category", formData.category);
//       formDataObj.append("description", formData.description);
//       formDataObj.append("userId", userId);

//       const response = await fetch("http://localhost:5000/api/vehicles/postVehicle", {
//         method: "POST",
//         body: formDataObj,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         messageApi.success("Vehicle posted successfully!");
//         setFormData({
//           name: "",
//           price: "",
//           image: "",
//           category: "",
//           description: "",
//         });
//         // Reset the file input field
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//         }
//       } else {
//         messageApi.error("Failed to post vehicle: " + data.error);
//       }
//     } catch (error) {
//       console.error("Error posting vehicle:", error);
//       messageApi.error("Something went wrong");
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
//       {contextHolder}
//       <NavigationBar />
//       <div className="post-vehicle-container">
//         <h2 className="post-vehicle-title">Post Vehicle</h2>
//         <form className="post-vehicle-form" >
//           <div className="post-vehicle-row">
//             <div className="post-vehicle-group">
//               <label htmlFor="name">Vehicle Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Vehicle Name"
//                 className="post-vehicle-input"
//               />
//             </div>
//             <div className="post-vehicle-group">
//               <label htmlFor="price">Price</label>
//               <input
//                 type="number"
//                 id="price"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 placeholder="Price"
//                 className="post-vehicle-input"
//               />
//             </div>
//           </div>

//           <div className="post-vehicle-row">
//             <div className="post-vehicle-group">
//               <label htmlFor="image">Upload Image</label>
//               <input
//                 ref={fileInputRef} // Add ref here
//                 type="file"
//                 id="image"
//                 name="image"
//                 accept="image/*"
//                 onChange={(e) =>
//                   setFormData({ ...formData, image: e.target.files[0] })
//                 }
//                 className="post-vehicle-input"
//               />
//             </div>

//             <div className="post-vehicle-group">
//               <label htmlFor="category">Category</label>
//               <input
//                 type="text"
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 placeholder="Category"
//                 className="post-vehicle-input"
//               />
//             </div>
//           </div>

//           <div className="post-vehicle-row">
//             <div className="post-vehicle-group">
//               <label htmlFor="description">Description</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Description"
//                 className="post-vehicle-input"
//               ></textarea>
//             </div>
//           </div>

//           <div className="post-vehicle-button-container">
//             <Button type="submit" value="Submit" style={{ width: "100px" }} onClick={handleSubmit}/>
//             <Button type="button" value="Cancel" red style={{ width: "100px" }} />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PostVehicle;

import React, { useState, useRef } from "react";
import "./PostVehicle.css";
import Button from "../../components/Button/Button";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { message } from "antd";
import postVehicleValidation from "../../validations/postVehicleValidation";

const PostVehicle = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    
    // Clear error for the field being changed
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
    
    setFormData(newFormData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Clear error for image field
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      await postVehicleValidation.validate(formData, { abortEarly: false });
      setErrors({}); // Clear any previous errors

      const userId = localStorage.getItem("userId");
      if (!userId) {
        messageApi.error("Please log in first");
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("price", formData.price);
      formDataObj.append("image", formData.image);
      formDataObj.append("category", formData.category);
      formDataObj.append("description", formData.description);
      formDataObj.append("userId", userId);

      const response = await fetch("http://localhost:5000/api/vehicles/postVehicle", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();

      if (response.ok) {
        messageApi.success("Vehicle posted successfully!");
        
        // Reset form
        setFormData({
          name: "",
          price: "",
          image: "",
          category: "",
          description: "",
        });
        
        // Reset the file input field
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        messageApi.error("Failed to post vehicle: " + data.error);
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle Yup validation errors
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Error posting vehicle:", error);
        messageApi.error("Something went wrong");
      }
    }
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {contextHolder}
      <NavigationBar />
      <div className="post-vehicle-container">
        <h2 className="post-vehicle-title">Post Vehicle</h2>
        <form className="post-vehicle-form">
          <div className="post-vehicle-row">
            <div className="post-vehicle-group">
              <label htmlFor="name">Vehicle Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Vehicle Name"
                className="post-vehicle-input"
              />
              {errors.name && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.name}</p>}
            </div>
            <div className="post-vehicle-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="post-vehicle-input"
              />
              {errors.price && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.price}</p>}
            </div>
          </div>

          <div className="post-vehicle-row">
            <div className="post-vehicle-group">
              <label htmlFor="image">Upload Image</label>
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                name="image"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="post-vehicle-input"
              />
              <p className="upload-info" style={{ fontSize: "12px", color: "#D3D3D3", marginTop: "5px" }}>
                Max 10MB PNG, JPG or JPEG format
              </p>
              {errors.image && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.image}</p>}
            </div>

            <div className="post-vehicle-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="post-vehicle-input"
              />
              {errors.category && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.category}</p>}
            </div>
          </div>

          <div className="post-vehicle-row">
            <div className="post-vehicle-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="post-vehicle-input"
              ></textarea>
              {errors.description && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.description}</p>}
            </div>
          </div>

          <div className="post-vehicle-button-container">
            <Button type="submit" value="Submit" style={{ width: "100px" }} onClick={handleSubmit} />
            <Button type="button" value="Cancel" red style={{ width: "100px" }} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostVehicle;