// import React, { useState } from "react";
// import "./PostVehicle.css";
// import Button from "../../components/Button/Button";
// import NavigationBar from "../../components/NavigationBar/NavigationBar";

// const PostVehicle = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     image: "",
//     category: "",
//     description: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const userId = 6; // Replace with dynamic user ID (e.g., from logged-in user context)
//     const response = await fetch("http://localhost:5000/api/reservation/postVehicle", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ ...formData, userId }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       alert("Vehicle posted successfully!");
//       console.log(data.vehicle);
//       // Optionally reset form
//       setFormData({
//         name: "",
//         price: "",
//         image: "",
//         category: "",
//         description: "",
//       });
//     } else {
//       alert("Failed to post vehicle: " + data.error);
//     }
//   } catch (error) {
//     console.error("Error posting vehicle:", error);
//     alert("Something went wrong");
//   }
// };


//   return (
//     <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
//       <NavigationBar />
//       <div className="post-vehicle-container">
//         <h2 className="post-vehicle-title">Post Vehicle</h2>
//         <form className="post-vehicle-form">
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
//               <label htmlFor="image">Image URL</label>
//               <input
//                 type="text"
//                 id="image"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleChange}
//                 placeholder="Image URL"
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

import React, { useState } from "react";
import "./PostVehicle.css";
import Button from "../../components/Button/Button";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { message } from "antd";

const PostVehicle = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
  });

  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = 6; // Replace with dynamic user ID
      const response = await fetch("http://localhost:5000/api/reservation/postVehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        messageApi.success("Vehicle posted successfully!");
        console.log(data.vehicle);
        setFormData({
          name: "",
          price: "",
          image: "",
          category: "",
          description: "",
        });
      } else {
        messageApi.error("Failed to post vehicle: " + data.error);
      }
    } catch (error) {
      console.error("Error posting vehicle:", error);
      messageApi.error("Something went wrong");
    }
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {contextHolder}
      <NavigationBar />
      <div className="post-vehicle-container">
        <h2 className="post-vehicle-title">Post Vehicle</h2>
        <form className="post-vehicle-form" >
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
            </div>
          </div>

          <div className="post-vehicle-row">
            <div className="post-vehicle-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="post-vehicle-input"
              />
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
            </div>
          </div>

          <div className="post-vehicle-button-container">
            <Button type="submit" value="Submit" style={{ width: "100px" }} onClick={handleSubmit}/>
            <Button type="button" value="Cancel" red style={{ width: "100px" }} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostVehicle;

