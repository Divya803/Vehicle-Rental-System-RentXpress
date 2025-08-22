// import React, { useState, useEffect } from "react";
// import "./RentVehicle.css";
// import Button from "../../components/Button/Button";
// import Modal from "../../components/Modal/Modal";
// import { useParams } from "react-router-dom";
// import axios from "axios";


// const RentVehicle = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [rentalType, setRentalType] = useState("");
//   const [vehicle, setVehicle] = useState(null);
//   const { vehicleId } = useParams();
//   const [pickupDate, setPickupDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [duration, setDuration] = useState(0);

//   const openModal = (type) => {
//     setRentalType(type);
//     setIsModalOpen(true);
//   };

//   useEffect(() => {
//     const fetchVehicle = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/reservation/vehicles/${vehicleId}`);
//         setVehicle(res.data);
//       } catch (err) {
//         console.error("Failed to fetch vehicle", err);
//       }
//     };

//     fetchVehicle();
//   }, [vehicleId]);

//   useEffect(() => {
//     if (pickupDate && endDate) {
//       const start = new Date(pickupDate);
//       const end = new Date(endDate);
//       const timeDiff = end - start;
//       const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//       setDuration(dayDiff > 0 ? dayDiff : 0);
//     }
//   }, [pickupDate, endDate]);

//   // const handleConfirmRental = async () => {
//   //   try {
//   //     const userId = localStorage.getItem("userId"); // or from context/auth
//   //     const totalAmount = duration * (rentalType === "With Driver" ? vehicle?.withDriverPrice : vehicle?.price);

//   //     await axios.post("http://localhost:5000/api/reservation/createReservation", {
//   //       userId,
//   //       vehicleId: vehicle.vehicleId,
//   //       startDate: pickupDate,
//   //       endDate: endDate,
//   //       totalAmount,
//   //       reservationType: rentalType
//   //     });

//   //     alert("Reservation successful!");
//   //     setIsModalOpen(false);
//   //   } catch (error) {
//   //     console.error("Reservation failed", error);
//   //     alert("Failed to make reservation");
//   //   }
//   // };

//   const handleConfirmRental = async () => {
//   try {
//     const userId = parseInt(localStorage.getItem("userId")); // Parse as integer
//     const totalAmount = duration * (rentalType === "With Driver" ? vehicle?.withDriverPrice : vehicle?.price);

//     // Add debugging logs
//     console.log("User ID from localStorage:", localStorage.getItem("userId"));
//     console.log("Parsed User ID:", userId);
//     console.log("Vehicle ID:", vehicle.vehicleId);

//     const requestData = {
//       userId,
//       vehicleId: vehicle.vehicleId,
//       startDate: pickupDate,
//       endDate: endDate,
//       totalAmount,
//       reservationType: rentalType
//     };

//     console.log("Request data:", requestData);

//     await axios.post("http://localhost:5000/api/reservation/createReservation", requestData);

//     alert("Reservation successful!");
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Reservation failed", error);
//     alert("Failed to make reservation");
//   }
// };

//   return (
//     <div className="container">
//       <div className="rent-card">
//         <div className="details">
//           <h2>{vehicle?.vehicleName}</h2>
//           <p>
//             {vehicle?.description}
//           </p>
//           <p><strong>Without Driver Rental:</strong> LKR {vehicle?.price}</p>
//           <p><strong>With Driver Rental:</strong> LKR {vehicle?.withDriverPrice}</p>


//           <div className="date-inputs">
//             <div>
//               <label htmlFor="pickup-date">Pick Up Date</label>
//               {/* <input type="date" id="pickup-date" /> */}
//               <input
//                 type="date"
//                 id="pickup-date"
//                 value={pickupDate}
//                 onChange={(e) => {
//                   setPickupDate(e.target.value);
//                 }}
//               />
//             </div>
//             <div>
//               <label htmlFor="end-date">End Date</label>
//               {/* <input type="date" id="end-date" /> */}
//               <input
//                 type="date"
//                 id="end-date"
//                 value={endDate}
//                 onChange={(e) => {
//                   setEndDate(e.target.value);
//                 }}
//               />
//             </div>
//           </div>

//           <div className="buttons">
//             <Button value="Rent with driver" onClick={() => openModal("With Driver")} />
//             <Button value="Rent without driver" onClick={() => openModal("Without Driver")} />
//           </div>
//         </div>

//         <div className="image-container">
//           <img src={vehicle?.image} alt={vehicle?.vehicleName} />
//         </div>

//       </div>

//       {/* Modal */}
//       <Modal open={isModalOpen} close={setIsModalOpen}>
//         <h2><center>{rentalType} Rental</center></h2>
//         <p>Duration: {duration} {duration === 1 ? "day" : "days"}</p>
//         <p>
//           Total payment: LKR{" "}
//           {rentalType === "With Driver"
//             ? duration * vehicle?.withDriverPrice
//             : duration * vehicle?.price}
//         </p>
//         <p>Confirm your rental details for the {rentalType} option.</p>
//         <div className="modal-buttons">
//           <Button value="Confirm" onClick={() => {
//             setIsModalOpen(false);
//             handleConfirmRental();
//           }} style={{ width: "100px" }} />
//           <Button value="Cancel" onClick={() => setIsModalOpen(false)} red style={{ width: "100px" }} />
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default RentVehicle;

import React, { useState, useEffect } from "react";
import "./RentVehicle.css";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import { useParams } from "react-router-dom";
import axios from "axios";


const RentVehicle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentalType, setRentalType] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const { vehicleId } = useParams();
  const [pickupDate, setPickupDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);

  const openModal = (type) => {
    setRentalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reservation/vehicles/${vehicleId}`);
        setVehicle(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicle", err);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  useEffect(() => {
    if (pickupDate && endDate) {
      const start = new Date(pickupDate);
      const end = new Date(endDate);
      const timeDiff = end - start;
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setDuration(dayDiff > 0 ? dayDiff : 0);
    }
  }, [pickupDate, endDate]);



  const handleConfirmRental = async () => {
  try {
    const userId = parseInt(localStorage.getItem("userId")); // Parse as integer
    const totalAmount = duration * (rentalType === "With Driver" ? vehicle?.withDriverPrice : vehicle?.price);

    // Add debugging logs
    console.log("User ID from localStorage:", localStorage.getItem("userId"));
    console.log("Parsed User ID:", userId);
    console.log("Vehicle ID:", vehicle.vehicleId);

    const requestData = {
      userId,
      vehicleId: vehicle.vehicleId,
      startDate: pickupDate,
      endDate: endDate,
      totalAmount,
      reservationType: rentalType
    };

    console.log("Request data:", requestData);

    await axios.post("http://localhost:5000/api/reservation/createReservation", requestData);

    alert("Reservation successful!");
    setIsModalOpen(false);
  } catch (error) {
    console.error("Reservation failed", error);
    alert("Failed to make reservation");
  }
};

  return (
    <div className="container">
      <div className="rent-card">
        <div className="details">
          <h2>{vehicle?.vehicleName}</h2>
          <p>
            {vehicle?.description}
          </p>
          <p><strong>Without Driver Rental:</strong> LKR {vehicle?.price}</p>
          <p><strong>With Driver Rental:</strong> LKR {vehicle?.withDriverPrice}</p>


          <div className="date-inputs">
            <div>
              <label htmlFor="pickup-date">Pick Up Date</label>
              {/* <input type="date" id="pickup-date" /> */}
              <input
                type="date"
                id="pickup-date"
                value={pickupDate}
                onChange={(e) => {
                  setPickupDate(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="end-date">End Date</label>
              {/* <input type="date" id="end-date" /> */}
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="buttons">
            <Button value="Rent with driver" onClick={() => openModal("With Driver")} />
            <Button value="Rent without driver" onClick={() => openModal("Without Driver")} />
          </div>
        </div>

        <div className="image-container">
          <img src={vehicle?.image} alt={vehicle?.vehicleName} />
        </div>

      </div>

      {/* Modal */}
      <Modal open={isModalOpen} close={setIsModalOpen}>
        <h2><center>{rentalType} Rental</center></h2>
        <p>Duration: {duration} {duration === 1 ? "day" : "days"}</p>
        <p>
          Total payment: LKR{" "}
          {rentalType === "With Driver"
            ? duration * vehicle?.withDriverPrice
            : duration * vehicle?.price}
        </p>
        <p>Confirm your rental details for the {rentalType} option.</p>
        <div className="modal-buttons">
          <Button value="Confirm" onClick={() => {
            setIsModalOpen(false);
            handleConfirmRental();
          }} style={{ width: "100px" }} />
          <Button value="Cancel" onClick={() => setIsModalOpen(false)} red style={{ width: "100px" }} />
        </div>
      </Modal>
    </div>
  );
};

export default RentVehicle;

