// import React, { useEffect, useState } from "react";
// import NavigationBar from "../../components/NavigationBar/NavigationBar";
// import Button from "../../components/Button/Button";
// import Table, { TableRow } from "../../components/Table/Table";
// import "./DriverDashboard.css";
// import axios from "axios";
// import {
//   FaCheckCircle,
//   FaClock,
//   FaTimesCircle,
//   FaCalendarAlt,
//   FaCar,
//   FaUser,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaRoute,
//   FaMoneyBillWave
// } from "react-icons/fa";

// // Toggle mock mode here
// const useMock = true;

// // Mock Data
// const mockAssignedRides = [
//   {
//     id: 1,
//     status: "assigned",
//     vehicleName: "Toyota Prius",
//     date: "2025-08-01",
//     startTime: "2025-08-01T09:00:00Z",
//     pickupLocation: "Colombo Fort",
//     destination: "Galle",
//     duration: "2h 15m",
//     fare: 3500,
//     customer: {
//       firstName: "Nimal",
//       lastName: "Perera",
//       phone: "0771234567",
//       email: "nimal@example.com"
//     }
//   }
// ];

// const mockCompletedRides = [
//   {
//     id: 2,
//     status: "completed",
//     vehicleName: "Nissan Leaf",
//     date: "2025-07-28",
//     completedAt: "2025-07-28T15:30:00Z",
//     fare: 4200,
//     rating: 4,
//     customer: {
//       firstName: "Kamal",
//       lastName: "Fernando"
//     }
//   },
//   {
//     id: 3,
//     status: "completed",
//     vehicleName: "Honda Civic",
//     date: "2025-07-27",
//     completedAt: "2025-07-27T12:15:00Z",
//     fare: 2800,
//     rating: 5,
//     customer: {
//       firstName: "Saman",
//       lastName: "Silva"
//     }
//   }
// ];

// const mockDriverInfo = {
//   firstName: "Sunil",
//   lastName: "Wijesinghe"
// };

// const mockEarnings = 1500;

// const DriverDashboard = () => {
//   const [assignedRides, setAssignedRides] = useState([]);
//   const [completedRides, setCompletedRides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [driverInfo, setDriverInfo] = useState({});
//   const [todayEarnings, setTodayEarnings] = useState(0);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchDriverData = async () => {
//       if (useMock) {
//         await new Promise((res) => setTimeout(res, 500));
//         setAssignedRides(mockAssignedRides);
//         setCompletedRides(mockCompletedRides);
//         setDriverInfo(mockDriverInfo);
//         setTodayEarnings(mockEarnings);
//         setLoading(false);
//         return;
//       }

//       try {
//         const config = {
//           headers: { Authorization: `Bearer ${token}` },
//         };

//         const [assignedRes, completedRes, driverRes, earningsRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/rides/assignedToMe", config),
//           axios.get("http://localhost:5000/api/rides/myCompletedRides", config),
//           axios.get("http://localhost:5000/api/users/profile", config).catch(() => ({ data: {} })),
//           axios.get("http://localhost:5000/api/rides/todayEarnings", config).catch(() => ({ data: { earnings: 0 } })),
//         ]);

//         setAssignedRides(assignedRes.data || []);
//         // Filter to only show rides with status "completed"
//         const completedOnly = (completedRes.data || []).filter(ride => 
//           ride.status && ride.status.toLowerCase() === 'completed'
//         );
//         setCompletedRides(completedOnly);
//         setDriverInfo(driverRes.data || {});
//         setTodayEarnings(earningsRes.data.earnings || 0);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to load driver dashboard data:", error);
//         setLoading(false);
//       }
//     };

//     fetchDriverData();
//   }, [token]);

//   const handleRideAction = async (rideId, action) => {
//     if (useMock) {
//       alert(`Mock: ${action}ed ride with ID ${rideId}`);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };

//       await axios.patch(
//         `http://localhost:5000/api/rides/${rideId}/${action}`,
//         {},
//         config
//       );

//       const assignedRes = await axios.get("http://localhost:5000/api/rides/assignedToMe", config);
//       setAssignedRides(assignedRes.data || []);
//       alert(`Ride ${action}ed successfully!`);
//     } catch (error) {
//       console.error(`Failed to ${action} ride:`, error);
//       alert(`Failed to ${action} ride. Please try again.`);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? "Invalid Time" : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'accepted':
//       case 'completed':
//         return <FaCheckCircle style={{ color: '#10B981' }} />;
//       case 'assigned':
//       case 'pending':
//         return <FaClock style={{ color: '#F59E0B' }} />;
//       case 'rejected':
//       case 'cancelled':
//         return <FaTimesCircle style={{ color: '#EF4444' }} />;
//       case 'in-progress':
//         return <FaCar style={{ color: '#3B82F6' }} />;
//       default:
//         return <FaClock style={{ color: '#6B7280' }} />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'accepted':
//       case 'completed':
//         return '#10B981';
//       case 'assigned':
//       case 'pending':
//         return '#F59E0B';
//       case 'rejected':
//       case 'cancelled':
//         return '#EF4444';
//       case 'in-progress':
//         return '#3B82F6';
//       default:
//         return '#6B7280';
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
//         <NavigationBar />
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
//           <p>Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
//       <NavigationBar />
//       <div className="welcome-section">
//         <h1>Good day, Driver {driverInfo.firstName || 'User'}!</h1>
//         <p>Manage your rides and track your earnings</p>
//         <div className="earnings-display">
//           <FaMoneyBillWave style={{ marginRight: '10px' }} />
//           Today's Earnings: <span className="earnings-amount">${todayEarnings.toFixed(2)}</span>
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: "20px", padding: "0 50px" }}>
//         {/* Assigned Rides */}
//         <div className="dashboard-section assigned-rides-section">
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
//             <FaCar style={{ color: '#00A8A8', fontSize: '24px' }} />
//             <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>Assigned Rides</p>
//           </div>

//           <div style={{ height: "450px", overflowY: "auto" }}>
//             {assignedRides.length > 0 ? (
//               <div className="rides-container">
//                 {assignedRides.map((ride, index) => (
//                   <div key={ride.id || index} className="ride-card">
//                     <div className="ride-header">
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                         {getStatusIcon(ride.status)}
//                         <h3 style={{ margin: 0, color: '#ffffff' }}>
//                           {ride.vehicleName || ride.vehicle?.name || 'N/A'}
//                         </h3>
//                         <span
//                           className="status-badge"
//                           style={{
//                             backgroundColor: `${getStatusColor(ride.status)}20`,
//                             color: getStatusColor(ride.status),
//                             border: `1px solid ${getStatusColor(ride.status)}`
//                           }}
//                         >
//                           {ride.status}
//                         </span>
//                       </div>
//                       <div className="ride-time">
//                         <FaCalendarAlt style={{ marginRight: '5px' }} />
//                         {formatDate(ride.date)} at {formatTime(ride.startTime)}
//                       </div>
//                     </div>

//                     <div className="customer-details">
//                       <h4 style={{ color: '#00A8A8', marginBottom: '10px' }}>
//                         <FaUser style={{ marginRight: '8px' }} />
//                         Customer Details
//                       </h4>
//                       <div className="customer-info">
//                         <p><strong>Name:</strong> {ride.customer?.firstName} {ride.customer?.lastName}</p>
//                         <p><strong>Phone:</strong>
//                           <a href={`tel:${ride.customer?.phone}`} style={{ color: '#00A8A8', marginLeft: '5px' }}>
//                             <FaPhone style={{ marginRight: '5px' }} />
//                             {ride.customer?.phone}
//                           </a>
//                         </p>
//                         <p><strong>Email:</strong> {ride.customer?.email}</p>
//                       </div>
//                     </div>

//                     {/* Trip Details section removed as requested */}

//                     {ride.status?.toLowerCase() === 'assigned' && (
//                       <div className="ride-actions">
//                         <Button
//                           type="button"
//                           value="Accept Ride"
//                           style={{
//                             backgroundColor: '#10B981',
//                             marginRight: '10px',
//                             flex: 1
//                           }}
//                           onClick={() => handleRideAction(ride.id, 'accept')}
//                         />
//                         <Button
//                           type="button"
//                           value="Reject"
//                           outlined
//                           style={{
//                             borderColor: '#EF4444',
//                             color: '#EF4444',
//                             flex: 1
//                           }}
//                           onClick={() => handleRideAction(ride.id, 'reject')}
//                         />
//                       </div>
//                     )}

//                     {ride.status?.toLowerCase() === 'accepted' && (
//                       <div className="ride-actions">
//                         <Button
//                           type="button"
//                           value="Start Trip"
//                           style={{
//                             backgroundColor: '#3B82F6',
//                             width: '100%'
//                           }}
//                           onClick={() => handleRideAction(ride.id, 'start')}
//                         />
//                       </div>
//                     )}

//                     {ride.status?.toLowerCase() === 'in-progress' && (
//                       <div className="ride-actions">
//                         <Button
//                           type="button"
//                           value="Complete Trip"
//                           style={{
//                             backgroundColor: '#10B981',
//                             width: '100%'
//                           }}
//                           onClick={() => handleRideAction(ride.id, 'complete')}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: '300px',
//                 color: '#9E9E9E'
//               }}>
//                 <FaCar style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
//                 <p>No rides assigned yet</p>
//                 <p style={{ fontSize: '14px' }}>Check back later for new ride assignments</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Completed Rides */}
//         <div className="dashboard-section completed-rides-section">
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
//             <FaCheckCircle style={{ color: '#00A8A8', fontSize: '24px' }} />
//             <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>Completed Rides</p>
//           </div>

//           <div style={{ height: "450px", overflowY: "auto" }}>
//             {completedRides.length > 0 ? (
//               <Table hover={true} style={{ fontSize: "1.10rem" }}>
//                 <TableRow data={["Customer", "Vehicle", "Date", "Fare", "Rating"]} />
//                 {completedRides.slice(0, 10).map((ride, index) => (
//                   <TableRow
//                     key={ride.id || index}
//                     data={[
//                       `${ride.customer?.firstName || ''} ${ride.customer?.lastName || ''}`.trim() || 'N/A',
//                       ride.vehicleName || ride.vehicle?.name || 'N/A',
//                       formatDate(ride.date || ride.completedAt),
//                       `$${ride.fare || ride.totalAmount || '0'}`,
//                       ride.rating ? `${ride.rating}/5 ⭐` : 'Not rated'
//                     ]}
//                   />
//                 ))}
//               </Table>
//             ) : (
//               <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: '300px',
//                 color: '#9E9E9E'
//               }}>
//                 <FaCheckCircle style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
//                 <p>No completed rides yet</p>
//                 <p style={{ fontSize: '14px' }}>Your completed rides will appear here</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DriverDashboard;

import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import "./DriverDashboard.css";
import axios from "axios";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCalendarAlt,
  FaCar,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaRoute,
  FaMoneyBillWave
} from "react-icons/fa";

// Toggle mock mode here
const useMock = true;

// Mock Data
const mockAssignedRides = [
  {
    id: 1,
    status: "assigned",
    vehicleName: "Toyota Prius",
    date: "2025-08-01",
    startTime: "2025-08-01T09:00:00Z",
    pickupLocation: "Colombo Fort",
    destination: "Galle",
    duration: "2h 15m",
    fare: 3500,
    customer: {
      firstName: "Nimal",
      lastName: "Perera",
      phone: "0771234567",
      email: "nimal@example.com"
    }
  }
];

const mockCompletedRides = [
  {
    id: 2,
    status: "completed",
    vehicleName: "Nissan Leaf",
    date: "2025-07-28",
    completedAt: "2025-07-28T15:30:00Z",
    fare: 4200,
    rating: 4,
    customer: {
      firstName: "Kamal",
      lastName: "Fernando"
    }
  },
  {
    id: 3,
    status: "completed",
    vehicleName: "Honda Civic",
    date: "2025-07-27",
    completedAt: "2025-07-27T12:15:00Z",
    fare: 2800,
    rating: 5,
    customer: {
      firstName: "Saman",
      lastName: "Silva"
    }
  }
];

const mockDriverInfo = {
  firstName: "Sunil",
  lastName: "Wijesinghe"
};

const mockEarnings = 1500;

const DriverDashboard = () => {
  const [assignedRides, setAssignedRides] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState({});
  const [todayEarnings, setTodayEarnings] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDriverData = async () => {
      if (useMock) {
        await new Promise((res) => setTimeout(res, 500));
        setAssignedRides(mockAssignedRides);
        setCompletedRides(mockCompletedRides);
        setDriverInfo(mockDriverInfo);
        setTodayEarnings(mockEarnings);
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [assignedRes, completedRes, driverRes, earningsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/rides/assignedToMe", config),
          axios.get("http://localhost:5000/api/rides/myCompletedRides", config),
          axios.get("http://localhost:5000/api/users/profile", config).catch(() => ({ data: {} })),
          axios.get("http://localhost:5000/api/rides/todayEarnings", config).catch(() => ({ data: { earnings: 0 } })),
        ]);

        setAssignedRides(assignedRes.data || []);
        // Filter to only show rides with status "completed"
        const completedOnly = (completedRes.data || []).filter(ride => 
          ride.status && ride.status.toLowerCase() === 'completed'
        );
        setCompletedRides(completedOnly);
        setDriverInfo(driverRes.data || {});
        setTodayEarnings(earningsRes.data.earnings || 0);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load driver dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [token]);

  const handleRideAction = async (rideId, action) => {
    if (useMock) {
      alert(`Mock: ${action}ed ride with ID ${rideId}`);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.patch(
        `http://localhost:5000/api/rides/${rideId}/${action}`,
        {},
        config
      );

      const assignedRes = await axios.get("http://localhost:5000/api/rides/assignedToMe", config);
      setAssignedRides(assignedRes.data || []);
      alert(`Ride ${action}ed successfully!`);
    } catch (error) {
      console.error(`Failed to ${action} ride:`, error);
      alert(`Failed to ${action} ride. Please try again.`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Time" : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'assigned':
      case 'pending':
        return <FaClock style={{ color: '#F59E0B' }} />;
      case 'rejected':
      case 'cancelled':
        return <FaTimesCircle style={{ color: '#EF4444' }} />;
      case 'in-progress':
        return <FaCar style={{ color: '#3B82F6' }} />;
      default:
        return <FaClock style={{ color: '#6B7280' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return '#10B981';
      case 'assigned':
      case 'pending':
        return '#F59E0B';
      case 'rejected':
      case 'cancelled':
        return '#EF4444';
      case 'in-progress':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
        <NavigationBar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <NavigationBar />
      <div className="welcome-section">
        <h1>Good day, Driver {driverInfo.firstName || 'User'}!</h1>
        <p>Manage your rides and track your earnings</p>
        <div className="earnings-display">
          <FaMoneyBillWave style={{ marginRight: '10px' }} />
          Today's Earnings: <span className="earnings-amount">${todayEarnings.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", padding: "0 50px" }}>
        {/* Assigned Rides */}
        <div className="dashboard-section assigned-rides-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FaCar style={{ color: '#00A8A8', fontSize: '24px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>Assigned Rides</p>
          </div>

          <div style={{ height: "450px", overflowY: "auto" }}>
            {assignedRides.length > 0 ? (
              <div className="rides-container">
                {assignedRides.map((ride, index) => (
                  <div key={ride.id || index} className="ride-card">
                    <div className="ride-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {getStatusIcon(ride.status)}
                        <h3 style={{ margin: 0, color: '#ffffff' }}>
                          {ride.vehicleName || ride.vehicle?.name || 'N/A'}
                        </h3>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(ride.status)}20`,
                            color: getStatusColor(ride.status),
                            border: `1px solid ${getStatusColor(ride.status)}`
                          }}
                        >
                          {ride.status}
                        </span>
                      </div>
                      <div className="ride-time">
                        <FaCalendarAlt style={{ marginRight: '5px' }} />
                        {formatDate(ride.date)} at {formatTime(ride.startTime)}
                      </div>
                    </div>

                    <div className="customer-details">
                      <h4 style={{ color: '#00A8A8', marginBottom: '10px' }}>
                        <FaUser style={{ marginRight: '8px' }} />
                        Customer Details
                      </h4>
                      <div className="customer-info">
                        <p><strong>Name:</strong> {ride.customer?.firstName} {ride.customer?.lastName}</p>
                        <p><strong>Phone:</strong>
                          <a href={`tel:${ride.customer?.phone}`} style={{ color: '#00A8A8', marginLeft: '5px' }}>
                            <FaPhone style={{ marginRight: '5px' }} />
                            {ride.customer?.phone}
                          </a>
                        </p>
                        <p><strong>Email:</strong> {ride.customer?.email}</p>
                      </div>
                    </div>

                    {/* Trip Details section removed as requested */}

                    {ride.status?.toLowerCase() === 'assigned' && (
                      <div className="ride-actions">
                        <Button
                          type="button"
                          value="Accept Ride"
                          style={{
                            backgroundColor: '#10B981',
                            marginRight: '10px',
                            flex: 1
                          }}
                          onClick={() => handleRideAction(ride.id, 'accept')}
                        />
                        <Button
                          type="button"
                          value="Reject"
                          outlined
                          style={{
                            borderColor: '#EF4444',
                            color: '#EF4444',
                            flex: 1
                          }}
                          onClick={() => handleRideAction(ride.id, 'reject')}
                        />
                      </div>
                    )}

                    {ride.status?.toLowerCase() === 'accepted' && (
                      <div className="ride-actions">
                        <Button
                          type="button"
                          value="Start Trip"
                          style={{
                            backgroundColor: '#3B82F6',
                            width: '100%'
                          }}
                          onClick={() => handleRideAction(ride.id, 'start')}
                        />
                      </div>
                    )}

                    {ride.status?.toLowerCase() === 'in-progress' && (
                      <div className="ride-actions">
                        <Button
                          type="button"
                          value="Complete Trip"
                          style={{
                            backgroundColor: '#10B981',
                            width: '100%'
                          }}
                          onClick={() => handleRideAction(ride.id, 'complete')}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: '#9E9E9E'
              }}>
                <FaCar style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
                <p>No rides assigned yet</p>
                <p style={{ fontSize: '14px' }}>Check back later for new ride assignments</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Rides */}
        <div className="dashboard-section completed-rides-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FaCheckCircle style={{ color: '#00A8A8', fontSize: '24px' }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>Completed Rides</p>
          </div>

          <div style={{ height: "450px", overflowY: "auto" }}>
            {completedRides.length > 0 ? (
              <div className="completed-rides-table">
                <div className="table-header">
                  <div className="table-cell">Customer</div>
                  <div className="table-cell">Vehicle</div>
                  <div className="table-cell">Date</div>
                  <div className="table-cell">Fare</div>
                  <div className="table-cell">Rating</div>
                </div>
                {completedRides.slice(0, 10).map((ride, index) => (
                  <div key={ride.id || index} className="table-row">
                    <div className="table-cell customer-name">
                      {`${ride.customer?.firstName || ''} ${ride.customer?.lastName || ''}`.trim() || 'N/A'}
                    </div>
                    <div className="table-cell vehicle-name">
                      {ride.vehicleName || ride.vehicle?.name || 'N/A'}
                    </div>
                    <div className="table-cell ride-date">
                      {formatDate(ride.date || ride.completedAt)}
                    </div>
                    <div className="table-cell ride-fare">
                      ${ride.fare || ride.totalAmount || '0'}
                    </div>
                    <div className="table-cell ride-rating">
                      {ride.rating ? `${ride.rating}/5 ⭐` : 'Not rated'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: '#9E9E9E'
              }}>
                <FaCheckCircle style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
                <p>No completed rides yet</p>
                <p style={{ fontSize: '14px' }}>Your completed rides will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;